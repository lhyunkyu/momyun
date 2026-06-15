import { Zap } from 'lucide-react'

const FOOTER_LINKS = {
  서비스: ['면접 시작하기', '레포지토리', '분석 그래프', '강화 학습'],
  지원: ['자주 묻는 질문', '문의하기', '업데이트 내역'],
  '법적 고지': ['이용약관', '개인정보처리방침'],
}

export function Footer() {
  return (
    <footer className="bg-[var(--bg-subtle)] border-t border-[var(--border-default)] py-10">
      <div className="max-w-[1160px] mx-auto px-6">

        <div className="flex justify-between items-start gap-8 flex-wrap">

          {/* Brand */}
          <div className="max-w-[240px]">
            <div className="flex items-center gap-2 text-[18px] font-bold mb-3">
              <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center text-white">
                <Zap size={12} strokeWidth={2.5} />
              </div>
              모면
            </div>
            <p className="text-[13px] text-[var(--text-tertiary)] leading-relaxed">
              AI 기반 모의면접 서비스.<br />
              실전 같은 연습으로 합격을 앞당기세요.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="footer-links">
              <h4 className="text-[12px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-4">
                {title}
              </h4>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[var(--text-secondary)] hover:text-amber-500 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="mt-8 pt-5 border-t border-[var(--border-default)] flex justify-between items-center flex-wrap gap-2 text-[13px] text-[var(--text-tertiary)]">
          <span>© 2025 모면 (모의면접). All rights reserved.</span>
          <span>Powered by Claude AI · 이현규</span>
        </div>

      </div>
    </footer>
  )
}
