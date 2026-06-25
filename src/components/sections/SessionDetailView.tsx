'use client'

import { InterviewRecord } from '@/lib/firestore'
import { cn } from '@/lib/cn'
import { ArrowLeft, Trophy, MessageSquare } from 'lucide-react'

function scoreColor(s: number | null) {
  if (s == null) return '#9CA3AF'
  return s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : '#ef4444'
}

const RATING_STYLE: Record<string, string> = {
  good: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  fair: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  poor: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
}

const TRACK_LABEL: Record<string, string> = {
  frontend: '프론트엔드', backend: '백엔드', fullstack: '풀스택', cs: 'CS 기초',
}
const DIFF_LABEL: Record<string, string> = { easy: '쉬움', medium: '보통', hard: '어려움' }
const TYPE_LABEL: Record<string, string> = { technical: '기술', behavioral: '인성', mixed: '혼합' }

export function SessionDetailView({
  session,
  onBack,
}: {
  session: InterviewRecord
  onBack: () => void
}) {
  const messages = (session.messages ?? []).filter((m) => m.content?.trim())

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* 헤더 */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-2 transition-colors"
      >
        <ArrowLeft size={15} /> 목록으로
      </button>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-extrabold">
          {TRACK_LABEL[session.track]} · {DIFF_LABEL[session.difficulty]} · {TYPE_LABEL[session.type]}
        </h1>
        {session.score != null && (
          <span className="text-lg font-bold" style={{ color: scoreColor(session.score) }}>
            {session.score}점
          </span>
        )}
      </div>

      {/* 대화 내역 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare size={15} className="text-amber-500" />
          <h2 className="font-bold">면접 대화</h2>
        </div>
        <div className="flex flex-col gap-3 p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] max-h-[420px] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-sm text-[var(--text-tertiary)] text-center py-4">대화 내역이 없어요.</p>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap',
                  m.role === 'user'
                    ? 'bg-amber-500 text-white rounded-br-sm'
                    : 'bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-bl-sm'
                )}>
                  {m.content}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 평가 결과 */}
      {session.evaluation ? (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={15} className="text-amber-500" />
            <h2 className="font-bold">면접 결과</h2>
          </div>

          {/* 점수 + 태도 */}
          <div className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] mb-4 flex items-center gap-6">
            <div className="text-5xl font-extrabold shrink-0" style={{ color: scoreColor(session.score) }}>
              {session.score ?? '-'}
            </div>
            <div>
              <p className="text-xs text-[var(--text-tertiary)] mb-1">종합 점수</p>
              <p className="text-sm text-[var(--text-secondary)]">{session.evaluation.attitude}</p>
            </div>
          </div>

          {/* 강점 */}
          {session.evaluation.strengths?.length > 0 && (
            <div className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] mb-4">
              <p className="text-sm font-semibold mb-3">강점</p>
              <div className="flex flex-col gap-2">
                {session.evaluation.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <span className="text-amber-500 mt-0.5 shrink-0">✓</span>{s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 질문별 평가 */}
          {session.evaluation.questionReviews?.length > 0 && (
            <div className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] mb-4">
              <p className="text-sm font-semibold mb-3">질문별 평가</p>
              <div className="flex flex-col gap-3">
                {session.evaluation.questionReviews.map((qr, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[var(--bg-subtle)]">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-medium leading-snug">{qr.question}</p>
                      <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full shrink-0', RATING_STYLE[qr.rating] ?? '')}>
                        {qr.rating}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{qr.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 개선사항 */}
          {session.evaluation.improvements?.length > 0 && (
            <div className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] mb-4">
              <p className="text-sm font-semibold mb-3">개선할 점</p>
              <div className="flex flex-col gap-2">
                {session.evaluation.improvements.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <span className="text-red-400 mt-0.5 shrink-0">•</span>{s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 총평 */}
          <div className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)]">
            <p className="text-sm font-semibold mb-2">총평</p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{session.evaluation.overall}</p>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] text-sm text-[var(--text-tertiary)] text-center">
          평가 결과가 없어요.
        </div>
      )}
    </div>
  )
}
