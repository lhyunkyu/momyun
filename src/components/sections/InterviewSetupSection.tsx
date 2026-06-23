'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { useAuth } from '@/context/AuthContext'
import { saveSession } from '@/lib/firestore'

const TRACKS      = [{ v: 'frontend', l: '프론트엔드' }, { v: 'backend', l: '백엔드' }, { v: 'fullstack', l: '풀스택' }, { v: 'cs', l: 'CS 기초' }]
const EXPERIENCES = [{ v: 'intern', l: '인턴/신입' }, { v: 'junior', l: '주니어' }, { v: 'mid', l: '미드레벨' }, { v: 'senior', l: '시니어' }]
const DIFFICULTIES= [{ v: 'easy', l: '쉬움' }, { v: 'medium', l: '보통' }, { v: 'hard', l: '어려움' }]
const TYPES       = [{ v: 'technical', l: '기술 면접' }, { v: 'behavioral', l: '인성 면접' }, { v: 'mixed', l: '혼합' }]

interface Message { role: 'user' | 'assistant'; content: string }
interface Config {
  track: string; experience: string; difficulty: string
  type: string;  questionCount: number
}

function ChipGroup({ label, options, value, onChange }: {
  label: string
  options: { v: string; l: string }[]
  value: string
  onChange: (v: string) => void
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
  const [config, setConfig] = useState<Config>({
    track: 'frontend', experience: 'intern',
    difficulty: 'medium', type: 'technical', questionCount: 5,
  })
  const [phase, setPhase]         = useState<'setup' | 'chat' | 'done'>('setup')
  const [messages, setMessages]   = useState<Message[]>([])
  const [input, setInput]         = useState('')
  const [streaming, setStreaming] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendToAI = async (history: Message[], cfg: Config) => {
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

    if (text.includes('면접 종합 평가')) {
      const match = text.match(/총점:\s*(\d+)\/100/)
      const score = match ? parseInt(match[1]) : null
      setPhase('done')
      if (user) {
        await saveSession(user.uid, {
          ...cfg, score,
          duration: Math.round((Date.now() - startTime) / 60000),
          messages: [...history, { role: 'assistant', content: text }],
        })
      }
    }
  }

  const startInterview = async () => {
    setPhase('chat')
    setStartTime(Date.now())
    await sendToAI([], config)
  }

  const submit = async () => {
    const text = input.trim()
    if (!text || streaming) return
    const next: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    await sendToAI(next, config)
  }

  const reset = () => { setPhase('setup'); setMessages([]); setInput('') }

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
          <input type="range" min={3} max={10} value={config.questionCount}
            onChange={(e) => setConfig((c) => ({ ...c, questionCount: Number(e.target.value) }))}
            className="w-full accent-amber-500"
          />
        </div>
      </div>
      <Button className="mt-6 w-full" size="lg" onClick={startInterview}>면접 시작하기</Button>
    </div>
  )

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
        {phase === 'done' ? (
          <div className="flex items-center gap-3">
            <p className="text-sm text-[var(--text-secondary)] flex-1">면접 완료! 결과가 레포지토리에 저장됐어요.</p>
            <Button variant="secondary" onClick={reset}>새 면접 시작</Button>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  )
}
