'use client'

import { useState } from 'react'
import { Zap, Send, Mic } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import type { DifficultyLevel, ExperienceLevel, InterviewTrack, InterviewType } from '@/types'

const TRACKS: InterviewTrack[]       = ['프론트엔드', '백엔드', '풀스택', '데이터/AI', 'DevOps', 'CS 기초']
const EXPERIENCES: ExperienceLevel[] = ['신입', '주니어', '시니어']
const DIFFICULTIES: DifficultyLevel[]= ['쉬움', '보통', '어려움']
const TYPES: InterviewType[]         = ['기술 면접', '인성 면접', '코딩 테스트 풀이', '시스템 설계']

function DifficultyButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`py-2 text-[13px] font-medium rounded-xl border-[1.5px] transition-all duration-[0.18s] ${
        active
          ? 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'
          : 'border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-500/10 dark:hover:text-amber-300'
      }`}
    >
      {label}
    </button>
  )
}

function InterviewTimer() {
  return (
    <div className="bg-[var(--bg-subtle)] px-5 py-4 flex items-center justify-between border-b border-[var(--border-default)]">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-[11px] font-bold">AI</div>
        <div>
          <div className="text-[13px] font-semibold">모면 AI 면접관</div>
          <div className="text-[11px] text-[var(--text-tertiary)]">프론트엔드 • 신입 • 보통</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[22px] font-bold text-amber-500 tabular-nums">03:45</span>
        <Badge variant="success">진행 중</Badge>
      </div>
    </div>
  )
}

function AiChatPreview() {
  return (
    <div className="border border-[var(--border-default)] rounded-3xl overflow-hidden bg-[var(--bg-card)]">
      <InterviewTimer />

      {/* Chat Body */}
      <div className="p-6 flex flex-col gap-5">
        {/* AI message */}
        <div className="flex gap-3">
          <div className="w-9 h-9 min-w-[36px] rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">AI</div>
          <div className="bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-tr-2xl rounded-b-2xl px-5 py-4 text-[15px] leading-relaxed">
            React의 <strong>useSelector</strong>를 사용할 때 불필요한 리렌더링이 발생하는 원인과,
            이를 방지하기 위한 방법에 대해 설명해주세요.
            <div className="mt-2 text-xs text-[var(--text-tertiary)]">Q3 / 8</div>
          </div>
        </div>

        {/* User message */}
        <div className="flex justify-end">
          <div className="max-w-[85%] bg-amber-500 text-white rounded-tl-2xl rounded-b-2xl px-5 py-4 text-[15px] leading-relaxed">
            useSelector는 스토어 전체를 구독하기 때문에, selector 함수가 매번 새 객체를 반환하면
            값이 같아도 참조가 달라져 리렌더링이 발생합니다. reselect의 createSelector로 메모이제이션하거나,
            필요한 값만 좁게 구독하는 방법으로 해결할 수 있습니다.
          </div>
        </div>

        {/* AI follow-up */}
        <div className="flex gap-3">
          <div className="w-9 h-9 min-w-[36px] rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">AI</div>
          <div className="bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-tr-2xl rounded-b-2xl px-5 py-4 text-[15px] leading-relaxed">
            좋습니다! createSelector의 메모이제이션 원리에 대해 더 자세히 설명해주실 수 있나요?
            특히 <strong>입력 셀렉터</strong>와 <strong>결과 셀렉터</strong>의 관계를 중심으로요.
            <span className="inline-block w-0.5 h-[1em] bg-amber-500 align-text-bottom animate-pulse ml-0.5" />
          </div>
        </div>
      </div>

      {/* Input Row */}
      <div className="px-5 py-4 border-t border-[var(--border-default)] flex gap-2">
        <div className="flex-1 px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-tertiary)]">
          답변을 입력하세요...
        </div>
        <Button size="icon" variant="primary"><Send size={16} /></Button>
        <Button size="icon" variant="secondary"><Mic size={16} /></Button>
      </div>

      {/* Progress Bar */}
      <div className="px-5 py-3 bg-[var(--bg-subtle)] flex gap-4 items-center">
        <div className="flex-1">
          <div className="flex justify-between text-[11px] text-[var(--text-tertiary)] mb-1">
            <span>진행도</span><span>3 / 8</span>
          </div>
          <Progress value={37.5} />
        </div>
        <div className="text-[12px] text-[var(--text-tertiary)] flex items-center gap-1">
          <Zap size={12} className="text-amber-500" />
          현재 점수: <strong className="text-amber-500">82</strong>
        </div>
      </div>
    </div>
  )
}

export function InterviewSetupSection() {
  const [selectedTracks, setSelectedTracks]     = useState<InterviewTrack[]>(['프론트엔드'])
  const [selectedTypes, setSelectedTypes]       = useState<InterviewType[]>(['기술 면접'])
  const [experience, setExperience]             = useState<ExperienceLevel>('신입')
  const [difficulty, setDifficulty]             = useState<DifficultyLevel>('보통')
  const [questionCount, setQuestionCount]       = useState(8)

  const toggleTrack = (t: InterviewTrack) =>
    setSelectedTracks((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])

  const toggleType = (t: InterviewType) =>
    setSelectedTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])

  return (
    <section id="interview" className="py-16 bg-[var(--bg-base)]">
      <div className="max-w-[1160px] mx-auto px-6">
        <div className="grid grid-cols-[1fr_1.2fr] max-md:grid-cols-1 gap-12 items-center">

          {/* Left: Setup */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">면접 시작</p>
            <h2 className="text-[28px] font-bold mb-3">나만의 면접 세팅</h2>
            <p className="text-[15px] text-[var(--text-secondary)] mb-8">
              전공, 경력, 난이도를 선택하면 AI가 최적의 질문셋을 준비합니다.
            </p>

            <div className="border border-[var(--border-default)] rounded-3xl overflow-hidden bg-[var(--bg-card)]">

              {/* Header */}
              <div className="px-6 py-5 border-b border-[var(--border-default)] flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-sm font-semibold">면접 설정</span>
              </div>

              {/* Body */}
              <div className="px-6 py-6 flex flex-col gap-5">

                {/* Track */}
                <div>
                  <label className="block text-[13px] font-semibold text-[var(--text-secondary)] mb-2">전공 트랙</label>
                  <div className="flex flex-wrap gap-2">
                    {TRACKS.map((t) => (
                      <Tag key={t} selectable active={selectedTracks.includes(t)} onClick={() => toggleTrack(t)}>{t}</Tag>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-[13px] font-semibold text-[var(--text-secondary)] mb-2">경력</label>
                  <div className="grid grid-cols-3 gap-2">
                    {EXPERIENCES.map((e) => (
                      <DifficultyButton key={e} label={e} active={experience === e} onClick={() => setExperience(e)} />
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-[13px] font-semibold text-[var(--text-secondary)] mb-2">면접 난이도</label>
                  <div className="grid grid-cols-3 gap-2">
                    {DIFFICULTIES.map((d) => (
                      <DifficultyButton key={d} label={d} active={difficulty === d} onClick={() => setDifficulty(d)} />
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-[13px] font-semibold text-[var(--text-secondary)] mb-2">면접 유형</label>
                  <div className="flex flex-wrap gap-2">
                    {TYPES.map((t) => (
                      <Tag key={t} selectable active={selectedTypes.includes(t)} onClick={() => toggleType(t)}>{t}</Tag>
                    ))}
                  </div>
                </div>

                {/* Question count */}
                <div>
                  <label className="block text-[13px] font-semibold text-[var(--text-secondary)] mb-2">질문 수</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range" min={3} max={20} value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="flex-1 accent-amber-500"
                    />
                    <span className="font-bold text-amber-500 min-w-[24px]">{questionCount}</span>
                    <span className="text-[13px] text-[var(--text-tertiary)]">문제</span>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[var(--border-default)]">
                <Button variant="primary" className="w-full justify-center">
                  <Zap size={16} />
                  AI 면접 시작하기
                </Button>
              </div>

            </div>
          </div>

          {/* Right: Preview */}
          <AiChatPreview />

        </div>
      </div>
    </section>
  )
}
