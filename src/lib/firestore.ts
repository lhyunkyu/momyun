import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'

export interface QuestionReview {
  question: string
  answer:   string
  rating:   'good' | 'fair' | 'poor'
  feedback: string
}

export interface EvaluationResult {
  score:           number
  attitude:        string
  strengths:       string[]
  questionReviews: QuestionReview[]
  improvements:    string[]
  overall:         string
}

export interface InterviewRecord {
  id?:            string
  track:          string
  experience:     string
  difficulty:     string
  type:           string
  questionCount:  number
  score:          number | null
  duration:       number
  messages:       { role: string; content: string }[]
  evaluation?:    EvaluationResult
  status:         'draft' | 'done'
  createdAt:      Timestamp | null
  updatedAt?:     Timestamp | null
}

/** 면접 시작 시 draft 생성 → sessionId 반환 */
export async function createDraftSession(
  userId: string,
  config: Pick<InterviewRecord, 'track' | 'experience' | 'difficulty' | 'type' | 'questionCount'>
): Promise<string> {
  const ref = collection(db, 'users', userId, 'sessions')
  const docRef = await addDoc(ref, {
    ...config,
    score: null, duration: 0, messages: [],
    status: 'draft',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

/** Q&A 한 턴마다 messages 중간 저장 */
export async function updateSessionMessages(
  userId: string,
  sessionId: string,
  messages: { role: string; content: string }[]
) {
  const ref = doc(db, 'users', userId, 'sessions', sessionId)
  return updateDoc(ref, { messages, updatedAt: serverTimestamp() })
}

/** 면접 완료 시 최종 저장 (evaluation 포함) */
export async function finalizeSession(
  userId: string,
  sessionId: string,
  data: { score: number | null; duration: number; evaluation: EvaluationResult; messages: { role: string; content: string }[] }
) {
  const ref = doc(db, 'users', userId, 'sessions', sessionId)
  return updateDoc(ref, { ...data, status: 'done', updatedAt: serverTimestamp() })
}

/** 단일 세션 조회 */
export async function getSession(userId: string, sessionId: string): Promise<InterviewRecord | null> {
  const ref  = doc(db, 'users', userId, 'sessions', sessionId)
  const snap = await getDoc(ref)
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as InterviewRecord) : null
}

/** 유저의 모든 세션 삭제 */
export async function deleteAllSessions(userId: string) {
  const ref  = collection(db, 'users', userId, 'sessions')
  const snap = await getDocs(ref)
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)))
}

/** 전체 세션 목록 조회 (done만) */
export async function getSessions(userId: string): Promise<InterviewRecord[]> {
  const ref  = collection(db, 'users', userId, 'sessions')
  const q    = query(ref, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as InterviewRecord))
    .filter((r) => r.status === 'done')
}

/** 전체 세션 목록 조회 (draft + done 모두) */
export async function getAllSessions(userId: string): Promise<InterviewRecord[]> {
  const ref  = collection(db, 'users', userId, 'sessions')
  const q    = query(ref, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as InterviewRecord))
}
