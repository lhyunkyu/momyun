import { Brain, Play } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import type { ReinforceItem } from '@/types'

const REINFORCE_ITEMS: ReinforceItem[] = [
  {
    priority: 1,
    topic: '네트워크 / TLS',
    reason: '최근 2회 연속 60점 미만. HTTP/HTTPS 차이와 TLS Handshake 과정에서 정확성이 낮게 평가되었습니다.',
    currentScore: 54,
  },
  {
    priority: 2,
    topic: '데이터베이스 / 트랜잭션',
    reason: 'ACID 속성, 격리 수준 관련 질문에서 일관성 있는 답변이 부족합니다. 인덱스 최적화 개념도 함께 보완을 권장합니다.',
    currentScore: 71,
  },
  {
    priority: 3,
    topic: 'React Hooks 심화',
    reason: '기본 Hooks는 양호하나 useCallback, useMemo 메모이제이션 최적화와 커스텀 훅 패턴 설명에서 심화 역량을 더 키울 수 있습니다.',
    currentScore: 79,
  },
]

const PRIORITY_CONFIG = {
  1: { emoji: '🔴', label: '즉시 보완', borderColor: 'border-l-red-500',   textColor: 'text-red-500',   barColor: 'bg-red-500',   btnStyle: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' },
  2: { emoji: '🟡', label: '보완 필요', borderColor: 'border-l-amber-500', textColor: 'text-amber-600', barColor: 'bg-amber-500', btnStyle: 'bg-amber-500/10 text-amber-700 border border-amber-500/20 hover:bg-amber-500/20' },
  3: { emoji: '🟢', label: '유지·심화', borderColor: 'border-l-transparent', textColor: 'text-[var(--text-tertiary)]', barColor: 'bg-amber-500', btnStyle: '' },
}

function ReinforceCard({ item }: { item: ReinforceItem }) {
  const cfg = PRIORITY_CONFIG[item.priority]

  return (
    <div className={`p-5 border border-[var(--border-default)] border-l-[3px] ${cfg.borderColor} rounded-2xl bg-[var(--bg-card)]`}>
      <div className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${cfg.textColor}`}>
        {cfg.emoji} 우선순위 {item.priority} — {cfg.label}
      </div>
      <div className="text-[16px] font-semibold mb-2">{item.topic}</div>
      <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-4">{item.reason}</p>

      <div className="flex justify-between text-[12px] text-[var(--text-tertiary)] mb-1">
        <span>현재 역량</span>
        <span>{item.currentScore}점</span>
      </div>
      <Progress value={item.currentScore} color={cfg.barColor} />

      <button
        className={`mt-4 w-full py-2 flex items-center justify-center gap-2 text-[13px] font-semibold rounded-xl transition-all duration-[0.18s] ${
          item.priority === 3
            ? 'bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] hover:bg-black/10 border border-[var(--border-default)]'
            : cfg.btnStyle
        }`}
      >
        <Play size={13} />
        {item.priority === 3 ? '심화 학습 시작' : '집중 학습 시작'}
      </button>
    </div>
  )
}

const REINFORCE_LOG = [
  { title: 'React 이벤트 루프 집중 학습 완료', meta: '2025.06.11 · 3세션 · 90분', delta: '+17점' },
  { title: '알고리즘 BFS/DFS 집중 학습 완료',  meta: '2025.06.08 · 5세션 · 150분', delta: '+12점' },
]

export function ReinforceSection() {
  return (
    <section id="reinforce" className="py-16 bg-[var(--bg-subtle)]">
      <div className="max-w-[1160px] mx-auto px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">강화 학습</p>
            <h2 className="text-[28px] font-bold mb-2">AI 추천 약점 보완</h2>
            <p className="text-[15px] text-[var(--text-secondary)]">AI가 취약 영역을 분석해 맞춤 학습 우선순위를 제안합니다.</p>
          </div>
          <Button variant="primary">
            <Brain size={16} />
            AI 재분석
          </Button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-5">
          {REINFORCE_ITEMS.map((item) => <ReinforceCard key={item.topic} item={item} />)}
        </div>

        {/* Log */}
        <div className="mt-8">
          <div className="text-[15px] font-semibold mb-4">강화 학습 이력</div>
          <div className="flex flex-col gap-3">
            {REINFORCE_LOG.map(({ title, meta, delta }) => (
              <div key={title} className="flex items-center gap-4 p-4 border border-[var(--border-default)] rounded-xl bg-[var(--bg-card)]">
                <div className="flex-1">
                  <div className="text-sm font-medium">{title}</div>
                  <div className="text-xs text-[var(--text-tertiary)] mt-0.5">{meta}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-tertiary)]">점수 변화</span>
                  <span className="text-sm font-bold text-emerald-500">{delta}</span>
                </div>
                <Badge variant="success">완료</Badge>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
