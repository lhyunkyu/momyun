'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { getSessions, InterviewRecord } from '@/lib/firestore'

interface SessionsContextType {
  sessions: InterviewRecord[]
  loading:  boolean
  refresh:  () => Promise<void>
}

const SessionsContext = createContext<SessionsContextType | null>(null)

export function SessionsProvider({ children }: { children: ReactNode }) {
  const { user }                    = useAuth()
  const [sessions, setSessions]     = useState<InterviewRecord[]>([])
  const [loading, setLoading]       = useState(true)

  const refresh = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const data = await getSessions(user.uid)
    setSessions(data)
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (!user) { setSessions([]); setLoading(false); return }
    refresh()
  }, [user, refresh])

  return (
    <SessionsContext.Provider value={{ sessions, loading, refresh }}>
      {children}
    </SessionsContext.Provider>
  )
}

export function useSessions() {
  const ctx = useContext(SessionsContext)
  if (!ctx) throw new Error('useSessions must be used within SessionsProvider')
  return ctx
}
