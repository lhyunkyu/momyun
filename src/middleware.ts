import { NextRequest, NextResponse } from 'next/server'

// Firebase 클라이언트 auth는 브라우저에서만 동작하므로
// 실제 보호는 (dashboard)/layout.tsx 에서 처리합니다.
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}
