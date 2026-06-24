'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Sidebar } from '@/components/layout/Sidebar'
import { SessionsProvider } from '@/context/SessionsContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [user, loading, router])

  if (loading || !user) return null

  return (
    <SessionsProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-[220px] min-h-screen bg-[var(--bg-base)]">
          {children}
        </main>
      </div>
    </SessionsProvider>
  )
}
