'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  Zap, MessageSquare, FolderOpen, TrendingUp,
  Brain, Sun, Moon, Settings, User,
} from 'lucide-react'
import { cn } from '@/lib/cn'

const NAV_ITEMS = [
  { label: '면접 시작',   href: '/interview',  icon: MessageSquare },
  { label: '레포지토리',  href: '/repository', icon: FolderOpen },
  { label: '분석 그래프', href: '/analytics',  icon: TrendingUp },
  { label: '강화 학습',   href: '/reinforce',  icon: Brain },
]

export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] flex flex-col border-r border-[var(--border-default)] bg-[var(--bg-subtle)] z-40">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-[var(--border-default)]">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-[17px]">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white shrink-0">
            <Zap size={16} strokeWidth={2.5} />
          </div>
          모면
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] px-2 mb-2">
          메뉴
        </p>
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-[0.18s]',
                isActive
                  ? 'bg-amber-500 text-white'
                  : 'text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10 hover:text-[var(--text-primary)]'
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 py-4 border-t border-[var(--border-default)] flex flex-col gap-1">
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10 hover:text-[var(--text-primary)] transition-all w-full"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          {isDark ? '라이트 모드' : '다크 모드'}
        </button>
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10 hover:text-[var(--text-primary)] transition-all"
        >
          <Settings size={16} />
          설정
        </Link>

        {/* User Profile */}
        <div className="mt-2 pt-3 border-t border-[var(--border-default)] flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <User size={15} />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold truncate">이현규</div>
            <div className="text-[11px] text-[var(--text-tertiary)] truncate">프론트엔드 · 신입</div>
          </div>
        </div>
      </div>

    </aside>
  )
}
