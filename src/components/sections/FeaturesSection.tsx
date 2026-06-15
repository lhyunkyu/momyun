import {
  MessageCircle, Sliders, Database, TrendingUp,
  Brain, Star, Mic, Share2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Feature {
  icon: LucideIcon
  title: string
  desc: string
}

const FEATURES: Feature[] = [
  { icon: MessageCircle, title: 'AI 실시간 면접',    desc: 'Claude AI 면접관과 실시간 질의응답. 꼬리 질문, 심화 질문까지 실전 그대로.' },
  { icon: Sliders,       title: '맞춤 난이도 설정',  desc: '신입·주니어·시니어, 전공 트랙, 개발 실력 수준별 최적화된 문제 세트.' },
  { icon: Database,      title: '면접 레포지토리',   desc: '답변 기록 자동 저장, 카테고리별 검색, 점수 이력 트래킹.' },
  { icon: TrendingUp,    title: '성장 그래프',       desc: '레이더 차트, 점수 추이, 카테고리 분석으로 내 약점을 한눈에.' },
  { icon: Brain,         title: '강화 학습',         desc: 'AI가 약점 분석 후 반복 학습 우선순위를 자동으로 설정해줍니다.' },
  { icon: Star,          title: 'AI 피드백 채점',    desc: '답변 완성도, 기술적 정확성, 커뮤니케이션 스킬을 항목별로 채점.' },
  { icon: Mic,           title: '음성 답변 모드',    desc: '실제 면접처럼 마이크로 답변. 발화 속도, 명확성 피드백 제공.' },
  { icon: Share2,        title: '답변 공유',         desc: '우수 답변을 커뮤니티에 공유하고 다른 지원자의 답변에서 인사이트를.' },
]

function FeatureCard({ icon: Icon, title, desc }: Feature) {
  return (
    <div className="p-6 border border-[var(--border-default)] rounded-2xl bg-[var(--bg-card)] transition-all duration-[0.18s] hover:border-amber-300 hover:-translate-y-0.5">
      <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
        <Icon size={22} />
      </div>
      <h3 className="text-[16px] font-semibold mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 bg-[var(--bg-subtle)]">
      <div className="max-w-[1160px] mx-auto px-6">

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">핵심 기능</p>
          <h2 className="text-[28px] font-bold mb-3">합격을 위한 모든 것</h2>
          <p className="text-[15px] text-[var(--text-secondary)]">면접 준비의 처음부터 끝까지, 모면이 함께합니다.</p>
        </div>

        <div className="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>

      </div>
    </section>
  )
}
