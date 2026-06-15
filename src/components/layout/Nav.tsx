'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const NAV_ITEMS = [
  { label: '면접 시작', href: '#interview' },
  { label: '레포지토리', href: '#repository' },
  { label: '분석 그래프', href: '#analytics' },
  { label: '강화 학습', href: '#reinforce' },
]

export function Nav() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  const handleScroll = (href: string) => {
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="sticky top-0 z-50 bg-[var(--bg-base)] border-b border-[var(--border-default)] backdrop-blur-xl">
      <div className="max-w-[1160px] mx-auto px-6 flex items-center justify-between h-[60px]">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 text-[18px] font-bold text-[var(--text-primary)]">
          <div className="w-8 h-8 rounded-md bg-amber-500 flex items-center justify-center text-white">
            <Zap size={16} strokeWidth={2.5} />
          </div>
          모면
        </a>

        {/* Menu */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <button
                onClick={() => handleScroll(item.href)}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-[0.18s]"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-500/15 dark:hover:text-amber-400 transition-all duration-[0.18s]"
            aria-label="테마 전환"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Button variant="secondary" size="sm">로그인</Button>
          <Button variant="primary" size="sm">무료 시작</Button>
        </div>

      </div>
    </nav>
  )
}
