'use client'

import { Sparkles, Play, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const STATS = [
  { num: '12,400+', label: '면접 문제 수' },
  { num: '98%',     label: '사용자 만족도' },
  { num: '3.2배',   label: '평균 성장 속도' },
  { num: '4개',     label: '전공 트랙 지원' },
]

export function HeroSection() {
  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      id="hero"
      className="pt-20 pb-18 bg-gradient-to-br from-[var(--bg-base)] to-amber-50 dark:to-amber-500/5"
    >
      <div className="max-w-[1160px] mx-auto px-6">

        {/* Kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[13px] font-semibold mb-6">
          <Sparkles size={14} />
          AI 기반 모의면접 서비스
        </div>

        {/* Title */}
        <h1 className="text-[52px] font-extrabold leading-[1.12] tracking-[-0.02em] mb-5 max-sm:text-[30px] max-md:text-[38px]">
          실전 같은 면접,<br />
          <em className="not-italic text-amber-500">AI와 함께</em> 준비해요
        </h1>

        {/* Description */}
        <p className="text-[17px] text-[var(--text-secondary)] max-w-[540px] mb-8">
          기술 면접부터 인성 면접까지 — 난이도, 전공, 경력에 맞춘 맞춤형 AI 면접관과
          실시간으로 연습하고, 데이터 기반 피드백으로 빠르게 성장하세요.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button size="lg" onClick={() => handleScroll('interview')}>
            <Play size={18} fill="white" stroke="white" />
            면접 시작하기
          </Button>
          <Button variant="secondary" size="lg" onClick={() => handleScroll('repository')}>
            <FolderOpen size={18} />
            레포지토리 보기
          </Button>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-12 pt-8 border-t border-[var(--border-default)] flex-wrap max-sm:gap-5">
          {STATS.map(({ num, label }) => (
            <div key={label}>
              <div className="text-[28px] font-extrabold text-amber-500 leading-none">{num}</div>
              <div className="text-[13px] text-[var(--text-secondary)] mt-1">{label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
