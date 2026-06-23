import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'

export interface InterviewRecord {
  id?:           string
  track:         string
  experience:    string
  difficulty:    string
  type:          string
  questionCount: number
  score:         number | null
  duration:      number          // 분 단위
  messages:      { role: string; content: string }[]
  createdAt:     Timestamp | null
}

/** 면접 세션 저장 */
export async function saveSession(
  userId: string,
  data: Omit<InterviewRecord, 'id' | 'createdAt'>
) {
  const ref = collection(db, 'users', userId, 'sessions')
  return addDoc(ref, { ...data, createdAt: serverTimestamp() })
}

/** 유저의 면접 기록 전체 조회 */
export async function getSessions(userId: string): Promise<InterviewRecord[]> {
  const ref = collection(db, 'users', userId, 'sessions')
  const q   = query(ref, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as InterviewRecord))
}
