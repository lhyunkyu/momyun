import { redirect } from 'next/navigation'

// 루트 접근 시 대시보드 인터뷰 페이지로 리다이렉트
export default function RootPage() {
  redirect('/interview')
}
