import { Sidebar } from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* 사이드바 너비만큼 margin */}
      <main className="flex-1 ml-[220px] min-h-screen bg-[var(--bg-base)]">
        {children}
      </main>
    </div>
  )
}
