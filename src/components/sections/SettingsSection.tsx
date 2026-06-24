'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useAuth } from '@/context/AuthContext'
import { deleteAllSessions } from '@/lib/firestore'
import { deleteUser, reauthenticateWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { Sun, Moon, User, Trash2, LogOut, AlertTriangle, MessageSquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const FOLLOW_UP_KEY = 'momyun_followup_enabled'

export function SettingsSection() {
  const { user, logout }      = useAuth()
  const { theme, setTheme }   = useTheme()
  const router                = useRouter()
  const [showDelete, setShowDelete]   = useState(false)
  const [deleting, setDeleting]       = useState(false)
  const [followUp, setFollowUp]       = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(FOLLOW_UP_KEY)
    if (stored !== null) setFollowUp(stored === 'true')
  }, [])

  const toggleFollowUp = (val: boolean) => {
    setFollowUp(val)
    localStorage.setItem(FOLLOW_UP_KEY, String(val))
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    setDeleting(true)
    try {
      // 데이터 삭제
      await deleteAllSessions(user.uid)
      // 재인증 후 계정 삭제
      await reauthenticateWithPopup(auth.currentUser!, googleProvider)
      await deleteUser(auth.currentUser!)
      router.replace('/login')
    } catch (e) {
      console.error(e)
      alert('회원탈퇴 중 오류가 발생했어요. 다시 시도해주세요.')
    } finally {
      setDeleting(false)
      setShowDelete(false)
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-extrabold mb-6">설정</h1>

      {/* 프로필 */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-3">프로필</h2>
        <div className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
            {user?.photoURL
              ? <Image src={user.photoURL} alt="프로필" width={56} height={56} className="object-cover" />
              : <User size={24} className="text-amber-500" />}
          </div>
          <div>
            <p className="font-semibold">{user?.displayName ?? '사용자'}</p>
            <p className="text-sm text-[var(--text-secondary)]">{user?.email}</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Google 계정으로 로그인됨</p>
          </div>
        </div>
      </section>

      {/* 면접 설정 */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-3">면접 설정</h2>
        <div className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquarePlus size={16} className="text-[var(--text-secondary)]" />
              <div>
                <p className="text-sm font-medium">꼬리질문</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">답변이 부족할 때 AI가 추가 질문을 합니다</p>
              </div>
            </div>
            <button
              onClick={() => toggleFollowUp(!followUp)}
              className={`relative w-11 h-6 rounded-full transition-colors ${followUp ? 'bg-amber-500' : 'bg-[var(--border-default)]'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${followUp ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </section>

      {/* 테마 */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-3">화면 설정</h2>
        <div className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)]">
          <p className="text-sm font-medium mb-3">테마</p>
          <div className="flex gap-2">
            {[
              { value: 'light', label: '라이트', icon: Sun },
              { value: 'dark',  label: '다크',   icon: Moon },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  theme === value
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:border-amber-400'
                }`}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 계정 */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-3">계정</h2>
        <div className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] flex flex-col gap-3">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/10 transition-all w-full text-left"
          >
            <LogOut size={16} /> 로그아웃
          </button>
          <div className="h-px bg-[var(--border-default)]" />
          <button
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all w-full text-left"
          >
            <Trash2 size={16} /> 회원탈퇴
          </button>
        </div>
      </section>

      {/* 탈퇴 확인 모달 */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-surface)] rounded-2xl p-6 max-w-sm w-full border border-[var(--border-default)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/15 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-red-500" />
              </div>
              <div>
                <p className="font-bold">정말 탈퇴하시겠어요?</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">모든 면접 기록이 삭제되며 복구할 수 없어요.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setShowDelete(false)} disabled={deleting}>
                취소
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? '처리 중...' : '탈퇴하기'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
