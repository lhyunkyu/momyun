'use client'

import { useState } from 'react'
import { Search, Plus, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { Progress } from '@/components/ui/Progress'
import type { InterviewRecord } from '@/types'

const MOCK_RECORDS: InterviewRecord[] = [
  { id: '1', question: 'useSelector 리렌더링 최적화',    subCategory: 'React 상태관리 • 보통',   track: '프론트엔드', score: 88, date: '2025.06.13' },
  { id: '2', question: 'Virtual DOM key prop 올바른 사용', subCategory: 'React 렌더링 • 보통',    track: '프론트엔드', score: 92, date: '2025.06.12' },
  { id: '3', question: 'useRef vs useState 차이점',       subCategory: 'React Hooks • 쉬움',     track: '프론트엔드', score: 71, date: '2025.06.11' },
  { id: '4', question: 'HTTP vs HTTPS 차이와 TLS 원리',  subCategory: '네트워크 • 어려움',       track: 'CS 기초',    score: 54, date: '2025.06.10' },
  { id: '5', question: 'RESTful API 설계 원칙',          subCategory: '백엔드 • 보통',           track: '백엔드',     score: 79, date: '2025.06.09' },
  { id: '6', question: '이벤트 루프와 비동기 처리 원리', subCategory: 'JavaScript • 어려움',     track: '프론트엔드', score: 95, date: '2025.06.08' },
]

function scoreColor(score: number) {
  if (score >= 90) return { text: 'text-emerald-500', bar: 'bg-emerald-500' }
  if (score >= 70) return { text: 'text-amber-500',   bar: 'bg-amber-500' }
  return              { text: 'text-red-500',          bar: 'bg-red-500' }
}

function RecordRow({ record }: { record: InterviewRecord }) {
  const colors = scoreColor(record.score)
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] max-md:grid-cols-[2fr_1fr_1fr] items-center px-5 py-4 border-b border-[var(--border-default)] last:border-b-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-sm">
      <div>
        <div className="font-medium text-[var(--text-primary)]">{record.question}</div>
        <div className="text-xs text-[var(--text-tertiary)] mt-0.5">{record.subCategory}</div>
      </div>
      <div><Tag>{record.track}</Tag></div>
      <div className="flex items-center gap-2">
        <span className={`font-semibold text-[13px] min-w-[28px] ${colors.text}`}>{record.score}</span>
        <Progress value={record.score} color={colors.bar} className="w-20 max-md:hidden" />
      </div>
      <div className="text-[13px] text-[var(--text-tertiary)] max-md:hidden">{record.date}</div>
      <button className="flex items-center justify-end text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

export function RepositorySection() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_RECORDS.filter((r) =>
    r.question.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <section id="repository" className="py-16 bg-[var(--bg-subtle)]">
      <div className="max-w-[1160px] mx-auto px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">면접 레포지토리</p>
            <h2 className="text-[28px] font-bold mb-2">내 면접 기록</h2>
            <p className="text-[15px] text-[var(--text-secondary)]">지금까지 연습한 모든 면접 답변과 점수를 확인하세요.</p>
          </div>
          <Button variant="primary">
            <Plus size={16} />
            새 면접 시작
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex-1 min-w-[220px] relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="질문 검색..."
              className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-amber-400 transition-colors"
            />
          </div>
          <select className="px-3 py-2.5 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-amber-400 appearance-none">
            <option>전체 트랙</option>
            <option>프론트엔드</option>
            <option>백엔드</option>
            <option>CS 기초</option>
          </select>
          <select className="px-3 py-2.5 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-amber-400 appearance-none">
            <option>전체 점수</option>
            <option>80점 이상</option>
            <option>60–79점</option>
            <option>60점 미만</option>
          </select>
        </div>

        {/* Table */}
        <div className="border border-[var(--border-default)] rounded-2xl overflow-hidden bg-[var(--bg-card)]">
          {/* Head */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_80px] max-md:grid-cols-[2fr_1fr_1fr] px-5 py-2.5 border-b border-[var(--border-default)] bg-[var(--bg-subtle)] text-xs font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
            <span>질문</span>
            <span>트랙</span>
            <span>점수</span>
            <span className="max-md:hidden">날짜</span>
            <span />
          </div>
          {filtered.map((r) => <RecordRow key={r.id} record={r} />)}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-5 gap-2">
          <Button variant="ghost" size="sm"><ChevronLeft size={14} />이전</Button>
          <Button variant="secondary" size="sm">1</Button>
          <Button variant="ghost" size="sm">2</Button>
          <Button variant="ghost" size="sm">3</Button>
          <Button variant="ghost" size="sm">다음<ChevronRight size={14} /></Button>
        </div>

      </div>
    </section>
  )
}
