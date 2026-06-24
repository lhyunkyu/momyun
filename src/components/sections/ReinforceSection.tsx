'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, MinusCircle, RotateCcw, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSessions } from '@/context/SessionsContext'
import { InterviewRecord, QuestionReview } from '@/lib/firestore'

interface WeakItem {
  question:  string
  feedback:  string
  count:     number
  rating:    'poor' | 'fair'
  track:     string
}

const TRACK_LABEL: Record<string, string> = {
  frontend: '프론트엔드', backend: '백엔드', fullstack: '풀스택', cs: 'CS 기초',
}

const PRIORITY = {
  poor: { label: '즉시 보완', icon: AlertCircle, border: 'border-l-red-500',   text: 'text-red-500',   bg: 'bg-red-50 dark:bg-red-500/5' },
  fair: { label: '보완 필요', icon: MinusCircle, border: 'border-l-amber-500', text: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/5' },
}

export function ReinforceSection() {
  const router   = useRouter()
  const { sessions, loading, refresh } = useSessions()
  const [items, setItems]   = useState<WeakItem[]>([])

  useEffect(() => {
    if (loading) return
    (() => {
      const data = sessions

      // poor/fair 질문 추출
      const map = new Map<string, WeakItem>()
      data.forEach((s) => {
        s.evaluation?.questionReviews?.forEach((qr: QuestionReview) => {
          if (qr.rating === 'poor' || qr.rating === 'fair') {
            const key = qr.question.slice(0, 40)
            const existing = map.get(key)
            if (existing) {
              existing.count++
              if (qr.rating === 'poor') existing.rating = 'poor'
            } else {
              map.set(key, {
                question: qr.question,
                feedback: qr.feedback,
                count: 1,
                rating: qr.rating,
                track: s.track,
              })
            }
          }
        })
      })

      // poor 우선, count 내림차순 정렬
      const sorted = [...map.values()].sort((a, b) => {
        if (a.rating !== b.rating) return a.rating === 'poor' ? -1 : 1
        return b.count - a.count
      })
      setItems(sorted.slice(0, 10))

    })()
  }, [sessions, loading])

  const goReinforce = (item: WeakItem) => {
    // 해당 트랙으로 면접 시작
    router.push(`/interview?track=${item.track}&difficulty=hard`)
  }

  if (loading) return (
    <div className="flex items-center gap-2 justify-center h-64 text-sm text-[var(--text-secondary)]">
      <Loader2 size={16} className="animate-spin" /> 불러오는 중...
    </div>
  )

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-1">
        <h1 className="text-2xl font-extrabold">강화 학습</h1>
        <button onClick={refresh} disabled={loading}
          className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-40 transition-colors">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> 새로고침
        </button>
      </div>
      <p className="text-[var(--text-secondary)] text-sm mb-6">
        {items.length > 0
          ? `${items.length}개의 취약 질문이 발견됐어요. 집중 연습으로 점수를 올려보세요.`
          : '아직 분석할 데이터가 없어요. 면접을 먼저 진행해보세요!'}
      </p>

      {items.length === 0 && sessions.length === 0 && (
        <div className="py-10 text-center text-[var(--text-tertiary)] text-sm">
          완료된 면접이 없어요.
        </div>
      )}

      {items.length === 0 && sessions.length > 0 && (
        <div className="py-10 text-center">
          <p className="text-emerald-500 font-semibold mb-1">🎉 취약 질문이 없어요!</p>
          <p className="text-sm text-[var(--text-secondary)]">모든 질문에서 good 이상의 평가를 받았습니다.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {items.map((item, i) => {
          const cfg = PRIORITY[item.rating]
          const Icon = cfg.icon
          return (
            <div key={i} className={`border-l-4 ${cfg.border} ${cfg.bg} rounded-r-2xl p-4 border border-l-0 border-[var(--border-default)]`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={14} className={cfg.text} />
                    <span className={`text-xs font-bold ${cfg.text}`}>{cfg.label}</span>
                    <span className="text-xs text-[var(--text-tertiary)]">{TRACK_LABEL[item.track]} · {item.count}회 오답</span>
                  </div>
                  <p className="text-sm font-semibold mb-1 leading-snug">{item.question}</p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.feedback}</p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => goReinforce(item)}
                  className="shrink-0"
                >
                  <RotateCcw size={12} /> 재연습
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
