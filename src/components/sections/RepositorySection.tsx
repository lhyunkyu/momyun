'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, RefreshCw, Play } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getAllSessions, InterviewRecord } from '@/lib/firestore'
import { Timestamp } from 'firebase/firestore'
import { SessionDetailView } from '@/components/sections/SessionDetailView'
import { Button } from '@/components/ui/Button'

const TRACK_LABEL: Record<string, string> = {
  frontend: '프론트엔드', backend: '백엔드', fullstack: '풀스택', cs: 'CS 기초',
}
const DIFF_COLOR: Record<string, string> = {
  easy: 'text-emerald-500', medium: 'text-amber-500', hard: 'text-red-500',
}
const DIFF_LABEL: Record<string, string> = { easy: '쉬움', medium: '보통', hard: '어려움' }

function formatDate(ts: Timestamp | null) {
  if (!ts) return '-'
  return ts.toDate().toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function RepositorySection() {
  const { user }    = useAuth()
  const router      = useRouter()
  const [allSessions, setAllSessions] = useState<InterviewRecord[]>([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [selected, setSelected]       = useState<InterviewRecord | null>(null)

  const fetchSessions = async () => {
    if (!user) return
    setLoading(true)
    const data = await getAllSessions(user.uid)
    setAllSessions(data)
    setLoading(false)
  }

  useEffect(() => { fetchSessions() }, [user])

  const drafts = allSessions.filter((r) => r.status === 'draft')
  const done   = allSessions.filter((r) => r.status === 'done').filter((r) =>
    !search || TRACK_LABEL[r.track]?.includes(search) || r.difficulty?.includes(search)
  )

  if (selected) {
    return <SessionDetailView session={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-1">
        <h1 className="text-2xl font-extrabold">레포지토리</h1>
        <button
          onClick={fetchSessions}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-40 transition-colors"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> 새로고침
        </button>
      </div>
      <p className="text-[var(--text-secondary)] text-sm mb-6">지금까지 진행한 면접 기록을 확인하세요.</p>

      {/* 진행 중인 면접 */}
      {!loading && drafts.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-[var(--text-tertiary)] mb-2">진행 중인 면접</p>
          <div className="flex flex-col gap-2">
            {drafts.map((r, i) => (
              <div
                key={r.id ?? i}
                className="flex items-center justify-between p-4 rounded-2xl border border-amber-300 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/5"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">
                      {TRACK_LABEL[r.track]} · {DIFF_LABEL[r.difficulty]} · {r.questionCount}문제
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)]">{formatDate(r.createdAt)}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => router.push(`/interview?resume=${r.id}`)}
                  className="flex items-center gap-1.5 shrink-0"
                >
                  <Play size={12} /> 이어하기
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 검색 */}
      <div className="relative mb-4 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="트랙 또는 난이도 검색"
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] py-10">
          <Loader2 size={16} className="animate-spin" /> 불러오는 중...
        </div>
      ) : done.length === 0 ? (
        <div className="py-16 text-center text-[var(--text-tertiary)] text-sm">
          {allSessions.filter((r) => r.status === 'done').length === 0
            ? '아직 완료된 면접이 없어요. 첫 면접을 시작해보세요!'
            : '검색 결과가 없어요.'}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--border-default)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-subtle)]">
              <tr>
                {['날짜', '트랙', '난이도', '유형', '문항', '점수', '시간'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-tertiary)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {done.map((r, i) => (
                <tr
                  key={r.id ?? i}
                  onClick={() => setSelected(r)}
                  className="border-t border-[var(--border-default)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 text-[var(--text-tertiary)]">{formatDate(r.createdAt)}</td>
                  <td className="px-4 py-3 font-medium">{TRACK_LABEL[r.track] ?? r.track}</td>
                  <td className={`px-4 py-3 font-medium ${DIFF_COLOR[r.difficulty]}`}>{DIFF_LABEL[r.difficulty] ?? r.difficulty}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {r.type === 'technical' ? '기술' : r.type === 'behavioral' ? '인성' : '혼합'}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{r.questionCount}문제</td>
                  <td className="px-4 py-3">
                    {r.score != null ? (
                      <span className={`font-bold ${r.score >= 80 ? 'text-emerald-500' : r.score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                        {r.score}점
                      </span>
                    ) : <span className="text-[var(--text-tertiary)]">-</span>}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{r.duration}분</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
