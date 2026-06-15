/* ============================================================
   Global Types — 모면 (모의면접)
   ============================================================ */

export type Theme = 'light' | 'dark'

export type DifficultyLevel = '쉬움' | '보통' | '어려움'
export type ExperienceLevel = '신입' | '주니어' | '시니어'
export type InterviewTrack =
  | '프론트엔드'
  | '백엔드'
  | '풀스택'
  | '데이터/AI'
  | 'DevOps'
  | 'CS 기초'
export type InterviewType = '기술 면접' | '인성 면접' | '코딩 테스트 풀이' | '시스템 설계'

export interface InterviewConfig {
  track: InterviewTrack[]
  experience: ExperienceLevel
  difficulty: DifficultyLevel
  types: InterviewType[]
  questionCount: number
}

export interface InterviewRecord {
  id: string
  question: string
  subCategory: string
  track: InterviewTrack
  score: number
  date: string
}

export interface CategoryScore {
  category: string
  score: number
}

export interface ReinforceItem {
  priority: 1 | 2 | 3
  topic: string
  reason: string
  currentScore: number
}
