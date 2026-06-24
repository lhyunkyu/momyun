'use client'

import { EvaluationResult } from '@/lib/firestore'
import { CheckCircle2, AlertCircle, MinusCircle, TrendingUp, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const RATING_META = {
  good: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', label: '잘함' },
  fair: { icon: MinusCircle,  color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-500/10',   label: '보통' },
  poor: { icon: AlertCircle,  color: 'text-red-500',      bg: 'bg-red-50 dark:bg-red-500/10',       label: '미흡' },
}

interface Props {
  evaluation: EvaluationResult
  duration:   number
  onRestart:  () => void
}

export function InterviewResultSection({ evaluation, duration, onRestart }: Props) {
  const { score, attitude, strengths, questionReviews, improvements, overall } = evaluation

  const scoreColor = score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-red-500'
  const scoreRing  = score >= 80 ? 'stroke-emerald-500' : score >= 60 ? 'stroke-amber-500' : 'stroke-red-500'
  const circumference = 2 * Math.PI * 54
  const dash = circumference - (score / 100) * circumference

  return (
    <div className="p-8 max-w-2xl mx-auto pb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold">면접 결과</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">소요 시간 {duration}분</p>
        </div>
        <Button variant="secondary" onClick={onRestart}>
          <RotateCcw size={14} /> 새 면접 시작
        </Button>
      </div>

      {/* 점수 게이지 */}
      <div className="flex items-center gap-8 p-6 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] mb-6">
        <div className="relative shrink-0">
          <svg width="128" height="128" className="-rotate-90">
            <circle cx="64" cy="64" r="54" fill="none" stroke="var(--border-default)" strokeWidth="10" />
            <circle cx="64" cy="64" r="54" fill="none" strokeWidth="10"
              className={scoreRing}
              strokeDasharray={circumference}
              strokeDashoffset={dash}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('text-3xl font-extrabold', scoreColor)}>{score}</span>
            <span className="text-xs text-[var(--text-tertiary)]">/ 100</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] mb-1">태도 평가</p>
          <p className="text-sm leading-relaxed mb-4">{attitude}</p>
          <div className="flex flex-wrap gap-2">
            {strengths.map((s, i) => (
              <span key={i} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 font-medium">
                <TrendingUp size={11} /> {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 질문별 리뷰 */}
      <h2 className="font-bold mb-3">질문별 분석</h2>
      <div className="flex flex-col gap-3 mb-6">
        {questionReviews.map((qr, i) => {
          const meta = RATING_META[qr.rating]
          const Icon = meta.icon
          return (
            <div key={i} className={cn('p-4 rounded-xl border border-[var(--border-default)]', meta.bg)}>
              <div className="flex items-start gap-2 mb-2">
                <Icon size={16} className={cn('mt-0.5 shrink-0', meta.color)} />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{qr.question}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">내 답변: {qr.answer}</p>
                </div>
                <span className={cn('text-xs font-bold shrink-0', meta.color)}>{meta.label}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed pl-6">{qr.feedback}</p>
            </div>
          )
        })}
      </div>

      {/* 개선 사항 */}
      <h2 className="font-bold mb-3">개선 사항</h2>
      <ul className="flex flex-col gap-2 mb-6">
        {improvements.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)]">
            <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>

      {/* 총평 */}
      <div className="p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-default)]">
        <p className="text-xs font-bold text-[var(--text-tertiary)] mb-2">총평</p>
        <p className="text-sm leading-relaxed">{overall}</p>
      </div>
    </div>
  )
}
