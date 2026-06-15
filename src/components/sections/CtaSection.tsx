import { Zap } from 'lucide-react'

export function CtaSection() {
  return (
    <section id="cta" className="py-16 bg-amber-500 text-center">
      <div className="max-w-[1160px] mx-auto px-6">
        <h2 className="text-[36px] font-extrabold text-white mb-4">
          지금 바로 면접 연습을 시작하세요
        </h2>
        <p className="text-[17px] text-white/80 mb-8">
          무료로 시작하고, AI와 함께 면접 합격률을 높이세요.
        </p>
        <a
          href="#interview"
          className="inline-flex items-center gap-2 bg-white text-amber-700 font-bold text-base px-8 py-3.5 rounded-2xl hover:bg-amber-50 transition-colors"
        >
          <Zap size={18} />
          무료로 시작하기
        </a>
      </div>
    </section>
  )
}
