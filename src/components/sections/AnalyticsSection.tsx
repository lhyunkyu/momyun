'use client'

import { useSessions } from '@/context/SessionsContext'
import { InterviewRecord } from '@/lib/firestore'
import { Loader2, RefreshCw } from 'lucide-react'

const TRACK_LABEL: Record<string, string> = {
  frontend: '프론트엔드', backend: '백엔드', fullstack: '풀스택', cs: 'CS 기초',
}

function avg(arr: number[]) {
  return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0
}

function scoreColor(s: number) {
  return s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : '#ef4444'
}

export function AnalyticsSection() {
  const { sessions, loading, refresh } = useSessions()

  if (loading) return (
    <div className="flex items-center gap-2 justify-center h-64 text-sm text-[var(--text-secondary)]">
      <Loader2 size={16} className="animate-spin" /> 불러오는 중...
    </div>
  )

  if (sessions.length === 0) return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-1">
        <h1 className="text-2xl font-extrabold">분석 그래프</h1>
        <button onClick={refresh} disabled={loading}
          className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-40 transition-colors">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> 새로고침
        </button>
      </div>
      <p className="text-[var(--text-secondary)] text-sm">아직 완료된 면접이 없어요. 면접을 먼저 진행해보세요!</p>
    </div>
  )

  // 점수 추이 (최근 10개)
  const recent = [...sessions].reverse().slice(-10)
  const maxScore = 100
  const chartW = 480, chartH = 140, padL = 32, padR = 16, padT = 10, padB = 28

  const points = recent.map((s, i) => {
    const x = padL + (i / Math.max(recent.length - 1, 1)) * (chartW - padL - padR)
    const y = padT + (1 - (s.score ?? 0) / maxScore) * (chartH - padT - padB)
    return { x, y, score: s.score ?? 0, label: TRACK_LABEL[s.track] ?? s.track }
  })
  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ')

  // 트랙별 평균
  const trackGroups: Record<string, number[]> = {}
  sessions.forEach((s) => {
    if (s.score == null) return
    if (!trackGroups[s.track]) trackGroups[s.track] = []
    trackGroups[s.track].push(s.score)
  })

  // 주간 활동 (최근 7일)
  const today = new Date()
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return d
  })
  const weekCounts = weekDays.map((d) =>
    sessions.filter((s) => {
      if (!s.createdAt) return false
      const sd = s.createdAt.toDate()
      return sd.getFullYear() === d.getFullYear() &&
             sd.getMonth() === d.getMonth() &&
             sd.getDate() === d.getDate()
    }).length
  )
  const maxCount = Math.max(...weekCounts, 1)

  // 전체 통계
  const scores = sessions.map((s) => s.score ?? 0).filter(Boolean)
  const totalAvg = avg(scores)
  const totalSessions = sessions.length
  const totalMins = sessions.reduce((a, s) => a + (s.duration ?? 0), 0)

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-1">
        <h1 className="text-2xl font-extrabold">분석 그래프</h1>
        <button onClick={refresh} disabled={loading}
          className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-40 transition-colors">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> 새로고침
        </button>
      </div>
      <p className="text-[var(--text-secondary)] text-sm mb-6">지금까지의 면접 성과를 한눈에 확인하세요.</p>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: '총 면접 횟수', value: `${totalSessions}회` },
          { label: '평균 점수', value: `${totalAvg}점`, color: scoreColor(totalAvg) },
          { label: '총 연습 시간', value: `${totalMins}분` },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)]">
            <p className="text-xs text-[var(--text-tertiary)] mb-1">{label}</p>
            <p className="text-2xl font-extrabold" style={color ? { color } : {}}>{value}</p>
          </div>
        ))}
      </div>

      {/* 점수 추이 */}
      <div className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] mb-4">
        <p className="text-[15px] font-semibold mb-3">점수 추이</p>
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full">
          {/* 가이드라인 */}
          {[0, 25, 50, 75, 100].map((v) => {
            const y = padT + (1 - v / 100) * (chartH - padT - padB)
            return (
              <g key={v}>
                <line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke="var(--border-default)" strokeWidth="1" strokeDasharray="4,4" />
                <text x={padL - 4} y={y + 4} textAnchor="end" fontSize="9" fill="var(--text-tertiary)">{v}</text>
              </g>
            )
          })}
          {/* 라인 */}
          {points.length > 1 && <polyline points={polyline} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />}
          {/* 점 */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="5" fill={scoreColor(p.score)} stroke="white" strokeWidth="2" />
              <text x={p.x} y={chartH - 6} textAnchor="middle" fontSize="9" fill="var(--text-tertiary)">{i + 1}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 트랙별 평균 */}
        <div className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)]">
          <p className="text-[15px] font-semibold mb-4">트랙별 평균 점수</p>
          <div className="flex flex-col gap-3">
            {Object.entries(trackGroups).map(([track, scores]) => {
              const a = avg(scores)
              return (
                <div key={track}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--text-secondary)]">{TRACK_LABEL[track] ?? track}</span>
                    <span className="font-bold" style={{ color: scoreColor(a) }}>{a}점</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--border-default)] overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${a}%`, backgroundColor: scoreColor(a) }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 주간 활동 */}
        <div className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)]">
          <p className="text-[15px] font-semibold mb-4">주간 활동</p>
          <div className="flex items-end justify-between gap-1.5 h-24">
            {weekDays.map((d, i) => {
              const h = weekCounts[i] === 0 ? 4 : Math.round((weekCounts[i] / maxCount) * 80) + 8
              return (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${h}px`,
                      backgroundColor: weekCounts[i] > 0 ? '#f59e0b' : 'var(--border-default)',
                    }}
                  />
                  <span className="text-[9px] text-[var(--text-tertiary)]">
                    {['일','월','화','수','목','금','토'][d.getDay()]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
