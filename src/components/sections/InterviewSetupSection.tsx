'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { useAuth } from '@/context/AuthContext'
import {
  createDraftSession,
  updateSessionMessages,
  finalizeSession,
  EvaluationResult,
} from '@/lib/firestore'
import { InterviewResultSection } from '@/components/sections/InterviewResultSection'
import { FOLLOW_UP_KEY } from '@/components/sections/SettingsSection'
import { useSessions } from '@/context/SessionsContext'

const TRACKS       = [{ v: 'frontend', l: '프론트엔드' }, { v: 'backend', l: '백엔드' }, { v: 'fullstack', l: '풀스택' }, { v: 'cs', l: 'CS 기초' }]
const EXPERIENCES  = [{ v: 'intern', l: '인턴/신입' }, { v: 'junior', l: '주니어' }, { v: 'mid', l: '미드레벨' }, { v: 'senior', l: '시니어' }]
const DIFFICULTIES = [{ v: 'easy', l: '쉬움' }, { v: 'medium', l: '보통' }, { v: 'hard', l: '어려움' }]
const TYPES        = [{ v: 'technical', l: '기술 면접' }, { v: 'behavioral', l: '인성 면접' }, { v: 'mixed', l: '혼합' }]

interface Message { role: 'user' | 'assistant'; content: string }
interface Config {
  track: string; experience: string; difficulty: string
  type: string;  questionCount: number; followUp: boolean
}

function ChipGroup({ label, options, value, onChange }: {
  label: string; options: { v: string; l: string }[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-[var(--text-tertiary)] mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(({ v, l }) => (
          <button key={v} onClick={() => onChange(v)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
              value === v
                ? 'bg-amber-500 text-white border-amber-500'
                : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:border-amber-400 hover:text-amber-600'
            )}
          >{l}</button>
        ))}
      </div>
    </div>
  )
}

export function InterviewSetupSection() {
  const { user } = useAuth()
  const { refresh } = useSessions()
  const [config, setConfig] = useState<Config>({
    track: 'frontend', experience: 'intern',
    difficulty: 'medium', type: 'technical', questionCount: 5, followUp: true,
  })

  useEffect(() => {
    const stored = localStorage.getItem(FOLLOW_UP_KEY)
    if (stored !== null) setConfig((c) => ({ ...c, followUp: stored === 'true' }))
  }, [])
  const [phase, setPhase]           = useState<'setup' | 'chat' | 'evaluating' | 'result'>('setup')
  const [messages, setMessages]     = useState<Message[]>([])
  const [input, setInput]           = useState('')
  const [streaming, setStreaming]   = useState(false)
  const [initializing, setInit]     = useState(false)
  const [sessionId, setSessionId]   = useState<string | null>(null)
  const sessionIdRef                = useRef<string>('')   // sid 최신값 동기 추적
  const [startTime, setStartTime]   = useState(0)
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null)
  const [duration, setDuration]     = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  /* AI 스트리밍 호출 */
  const sendToAI = async (history: Message[], cfg: Config, sid: string) => {
    setStreaming(true)
    const res = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history, config: cfg }),
    })
    if (!res.body) { setStreaming(false); return }

    const reader = res.body.getReader()
    const dec    = new TextDecoder()
    let   text   = ''

    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      text += dec.decode(value, { stream: true })
      setMessages((prev) => {
        const next = [...prev]
        next[next.length - 1] = { role: 'assistant', content: text }
        return next
      })
    }

    setStreaming(false)

    const finalMessages = [...history, { role: 'assistant' as const, content: text }]

    // 중간 자동저장
    if (user && sid) {
      await updateSessionMessages(user.uid, sid, finalMessages)
    }

    // 면접 종료 감지
    if (text.includes('면접이 모두 끝났습니다')) {
      const mins = Math.round((Date.now() - startTime) / 60000)
      setDuration(mins)
      setPhase('evaluating')
      await runEvaluation(finalMessages, cfg, sessionIdRef.current, mins)
    }
  }

  /* 결과 평가 API 호출 */
  const runEvaluation = async (
    msgs: Message[], cfg: Config, sid: string, mins: number
  ) => {
    let data: EvaluationResult | null = null

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs, config: cfg }),
      })
      if (!res.ok) throw new Error(`evaluate HTTP ${res.status}`)
      data = await res.json()
    } catch (e) {
      console.error('[runEvaluation] 평가 실패:', e)
    }

    // 평가 실패해도 세션은 저장 (score null로)
    const evalData = data ?? {
      score: null, attitude: '평가를 불러오지 못했어요.',
      strengths: [], questionReviews: [], improvements: [],
      overall: '평가 중 오류가 발생했습니다. 면접 기록은 저장되었어요.',
    } as unknown as EvaluationResult

    setEvaluation(evalData)

    if (user && sid) {
      try {
        await finalizeSession(user.uid, sid, {
          score: (evalData as EvaluationResult).score ?? null,
          duration: mins,
          evaluation: evalData,
          messages: msgs,
        })
        refresh()
      } catch (e) {
        console.error('[runEvaluation] Firestore 저장 실패:', e)
      }
    }
    setPhase('result')
  }

  /* 면접 시작 */
  const startInterview = () => {
    setStartTime(Date.now())
    setPhase('chat')

    // AI 즉시 시작
    sendToAI([], config, '')

    // Firestore 백그라운드 생성 → ref + state 동시 업데이트
    if (user) {
      createDraftSession(user.uid, config)
        .then((sid) => { sessionIdRef.current = sid; setSessionId(sid) })
        .catch((e) => console.warn('Firestore draft 생성 실패:', e))
    }
  }

  /* 답변 전송 */
  const submit = async () => {
    const text = input.trim()
    if (!text || streaming) return
    const next: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    await sendToAI(next, config, sessionId ?? '')
  }

  const reset = () => {
    setPhase('setup'); setMessages([]); setInput('')
    setSessionId(null); sessionIdRef.current = ''; setEvaluation(null)
  }

  /* ── 설정 화면 ── */
  if (phase === 'setup') return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold mb-1">면접 시작</h1>
      <p className="text-[var(--text-secondary)] text-sm mb-8">설정 후 AI 면접관과 실전 연습을 시작하세요.</p>
      <div className="flex flex-col gap-6 p-6 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)]">
        <ChipGroup label="전공 트랙" options={TRACKS}       value={config.track}      onChange={(v) => setConfig((c) => ({ ...c, track: v }))} />
        <ChipGroup label="경력 수준" options={EXPERIENCES}  value={config.experience} onChange={(v) => setConfig((c) => ({ ...c, experience: v }))} />
        <ChipGroup label="난이도"   options={DIFFICULTIES}  value={config.difficulty} onChange={(v) => setConfig((c) => ({ ...c, difficulty: v }))} />
        <ChipGroup label="면접 유형" options={TYPES}         value={config.type}       onChange={(v) => setConfig((c) => ({ ...c, type: v }))} />
        <div>
          <p className="text-xs font-semibold text-[var(--text-tertiary)] mb-2">질문 수: {config.questionCount}개</p>
          <input type="range" min={3} max={20} value={config.questionCount}
            onChange={(e) => setConfig((c) => ({ ...c, questionCount: Number(e.target.value) }))}
            className="w-full accent-amber-500"
          />
        </div>
      </div>
      <Button className="mt-6 w-full" size="lg" onClick={startInterview}>
        면접 시작하기
      </Button>
    </div>
  )

  /* ── 결과 분석 중 ── */
  if (phase === 'evaluating') return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Loader2 size={36} className="animate-spin text-amber-500" />
      <p className="font-semibold">결과를 분석하고 있어요...</p>
      <p className="text-sm text-[var(--text-secondary)]">AI가 전체 면접을 검토 중입니다. 잠시만 기다려주세요.</p>
    </div>
  )

  /* ── 결과 화면 ── */
  if (phase === 'result' && evaluation) return (
    <InterviewResultSection evaluation={evaluation} duration={duration} onRestart={reset} />
  )

  /* ── 채팅 화면 ── */
  return (
    <div className="flex flex-col h-screen">
      <div className="px-6 py-4 border-b border-[var(--border-default)] flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-bold">AI 면접 진행 중</h2>
          <p className="text-xs text-[var(--text-tertiary)]">
            {TRACKS.find((t) => t.v === config.track)?.l} · {DIFFICULTIES.find((d) => d.v === config.difficulty)?.l} · {config.questionCount}문제
          </p>
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <RotateCcw size={13} /> 다시 설정
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
        {messages.map((m, i) => (
          <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn(
              'max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap',
              m.role === 'user'
                ? 'bg-amber-500 text-white rounded-br-sm'
                : 'bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-bl-sm'
            )}>
              {m.content || <Loader2 size={14} className="animate-spin" />}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="px-6 py-4 border-t border-[var(--border-default)] shrink-0">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
            placeholder="답변 입력... (Enter: 전송 / Shift+Enter: 줄바꿈)"
            rows={2} disabled={streaming}
            className="flex-1 resize-none rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm outline-none focus:border-amber-400 disabled:opacity-50 transition-colors"
          />
          <Button size="icon" onClick={submit} disabled={streaming || !input.trim()}>
            {streaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </Button>
        </div>
      </div>
    </div>
  )
}
