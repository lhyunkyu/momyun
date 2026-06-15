import { Progress } from '@/components/ui/Progress'

const RADAR_CATEGORIES = [
  { label: 'React/JS',  score: 88, x: 145, y: 42,  dotX: 150, dotY: 62 },
  { label: '알고리즘', score: 92, x: 224, y: 96,  dotX: 210, dotY: 100, anchor: 'start' },
  { label: 'DB',        score: 71, x: 200, y: 190, dotX: 190, dotY: 168 },
  { label: '네트워크', score: 79, x: 100, y: 190, dotX: 110, dotY: 168 },
  { label: '시스템설계',score: 85, x: 54,  y: 96,  dotX: 91,  dotY: 105, anchor: 'end' },
]

const WEEK_BARS = [
  { day: '월', height: 32, opacity: 'bg-amber-200' },
  { day: '화', height: 48, opacity: 'bg-amber-400' },
  { day: '수', height: 24, opacity: 'bg-amber-200' },
  { day: '목', height: 56, opacity: 'bg-amber-500' },
  { day: '금', height: 40, opacity: 'bg-amber-300' },
  { day: '토', height: 16, opacity: 'bg-amber-100' },
  { day: '일', height: 8,  opacity: 'bg-black/5 dark:bg-white/10 border border-[var(--border-default)]' },
]

function scoreBarColor(score: number) {
  if (score >= 90) return 'bg-emerald-500'
  if (score >= 75) return 'bg-amber-500'
  return 'bg-amber-400'
}

function RadarChart() {
  return (
    <div className="border border-[var(--border-default)] rounded-2xl bg-[var(--bg-card)] p-6">
      <div className="text-[15px] font-semibold mb-1">역량 레이더 차트</div>
      <div className="text-[13px] text-[var(--text-tertiary)] mb-5">이번 달 기준</div>

      <div className="h-[200px]">
        <svg viewBox="0 0 300 210" className="w-full h-full">
          {/* Grid */}
          <polygon points="150,50 217,97 197,175 103,175 83,97" fill="none" stroke="var(--border-default)" strokeWidth="1" />
          <polygon points="150,80 199,116 183,170 117,170 101,116" fill="none" stroke="var(--border-default)" strokeWidth="1" />
          <polygon points="150,110 181,135 169,165 131,165 119,135" fill="none" stroke="var(--border-default)" strokeWidth="1" />
          {/* Axes */}
          {[[150,130,150,50],[150,130,217,97],[150,130,197,175],[150,130,103,175],[150,130,83,97]].map(([x1,y1,x2,y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border-default)" strokeWidth="1" />
          ))}
          {/* Data fill */}
          <polygon
            points="150,62 210,100 190,168 110,168 91,105"
            fill="rgba(245,158,11,0.18)" stroke="#F59E0B" strokeWidth="2"
          />
          {/* Dots */}
          {RADAR_CATEGORIES.map(({ dotX, dotY, label }) => (
            <circle key={label} cx={dotX} cy={dotY} r="4" fill="#F59E0B" />
          ))}
          {/* Labels */}
          {RADAR_CATEGORIES.map(({ label, x, y, anchor = 'middle' }) => (
            <text key={label} x={x} y={y} textAnchor={anchor as 'middle' | 'start' | 'end'} fontSize="11" fill="var(--text-secondary)" fontFamily="sans-serif">
              {label}
            </text>
          ))}
        </svg>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        {RADAR_CATEGORIES.map(({ label, score }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-[13px] text-[var(--text-secondary)]">{label}</span>
            <div className="flex items-center gap-2">
              <Progress value={score} color={scoreBarColor(score)} className="w-24" />
              <span className={`text-[12px] font-semibold min-w-[28px] text-right ${scoreBarColor(score).replace('bg-', 'text-')}`}>{score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GrowthChart() {
  return (
    <div className="border border-[var(--border-default)] rounded-2xl bg-[var(--bg-card)] p-6">
      <div className="text-[15px] font-semibold mb-1">점수 성장 추이</div>
      <div className="text-[13px] text-[var(--text-tertiary)] mb-5">최근 14일</div>

      <div className="h-[140px]">
        <svg viewBox="0 0 440 140" className="w-full h-full">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[20, 55, 90, 115].map((y) => (
            <line key={y} x1="40" y1={y} x2="420" y2={y} stroke="var(--border-default)" strokeWidth="1" />
          ))}
          <path d="M60,100 L120,85 L180,72 L240,65 L300,55 L360,40 L420,30 L420,115 L60,115 Z" fill="url(#lineGrad)" />
          <path d="M60,100 L120,85 L180,72 L240,65 L300,55 L360,40 L420,30"
            fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {[60, 120, 180, 240, 300, 360].map((x, i) => (
            <circle key={i} cx={x} cy={[100,85,72,65,55,40][i]} r="3.5" fill="#F59E0B" />
          ))}
          <circle cx="420" cy="30" r="5" fill="#F59E0B" stroke="white" strokeWidth="2" />
          {['40', '20'].map((label, i) => (
            <text key={label} x="32" y={i === 0 ? 24 : 58} textAnchor="end" fontSize="10" fill="var(--text-tertiary)" fontFamily="sans-serif">
              {[100, 80][i]}
            </text>
          ))}
        </svg>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { num: '83',  label: '평균 점수',  color: 'text-amber-500' },
          { num: '+18', label: '2주 성장',   color: 'text-emerald-500' },
          { num: '24',  label: '총 면접수',  color: 'text-[var(--text-primary)]' },
        ].map(({ num, label, color }) => (
          <div key={label} className="text-center p-3 bg-[var(--bg-subtle)] rounded-xl">
            <div className={`text-[20px] font-extrabold ${color}`}>{num}</div>
            <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Weekly Activity */}
      <div className="mt-5">
        <div className="text-[12px] font-semibold text-[var(--text-secondary)] mb-3">이번 주 활동</div>
        <div className="flex gap-1 items-end">
          {WEEK_BARS.map(({ day, height, opacity }) => (
            <div key={day} className="flex flex-col items-center gap-1 flex-1">
              <div className={`w-full rounded-t-sm ${opacity}`} style={{ height }} />
              <span className="text-[10px] text-[var(--text-tertiary)]">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AnalyticsSection() {
  return (
    <section id="analytics" className="py-16 bg-[var(--bg-base)]">
      <div className="max-w-[1160px] mx-auto px-6">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">성장 분석</p>
          <h2 className="text-[28px] font-bold mb-3">내 면접 역량 그래프</h2>
          <p className="text-[15px] text-[var(--text-secondary)]">카테고리별 점수와 시간에 따른 성장 추이를 시각화합니다.</p>
        </div>
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
          <RadarChart />
          <GrowthChart />
        </div>
      </div>
    </section>
  )
}
