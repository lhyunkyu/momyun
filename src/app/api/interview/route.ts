import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const TRACK_LABEL: Record<string, string> = {
  frontend:  '프론트엔드',
  backend:   '백엔드',
  fullstack: '풀스택',
  cs:        'CS 기초',
}
const EXP_LABEL: Record<string, string> = {
  intern:  '인턴/신입',
  junior:  '주니어(1-3년)',
  mid:     '미드레벨(3-5년)',
  senior:  '시니어(5년+)',
}
const DIFF_LABEL: Record<string, string> = {
  easy:   '쉬움',
  medium: '보통',
  hard:   '어려움',
}
const TYPE_LABEL: Record<string, string> = {
  technical:   '기술 면접',
  behavioral:  '인성 면접',
  mixed:       '혼합',
}

export async function POST(req: NextRequest) {
  const { messages, config } = await req.json()

  const systemPrompt = `당신은 전문 AI 기술 면접관입니다.

면접 설정:
- 분야: ${TRACK_LABEL[config.track] ?? config.track}
- 경력: ${EXP_LABEL[config.experience] ?? config.experience}
- 난이도: ${DIFF_LABEL[config.difficulty] ?? config.difficulty}
- 면접 유형: ${TYPE_LABEL[config.type] ?? config.type}
- 총 질문 수: ${config.questionCount}개

규칙:
1. 질문은 반드시 한 번에 하나씩만 하세요.
2. 지원자 답변 후 간단한 피드백(1-2문장)을 주고 다음 질문으로 넘어가세요.
3. 질문 번호를 표시하세요 (예: [질문 1/5]).
4. 마지막 질문의 답변을 받은 뒤 종합 평가를 작성하세요.
   종합 평가 형식:
   ---
   📊 면접 종합 평가
   총점: XX/100

   강점: ...
   개선점: ...

   총평: ...
   ---
5. 한국어로 진행하세요.

지금 바로 첫 번째 질문으로 시작하세요.`

  // 첫 호출 시 빈 배열이면 시작 트리거 메시지 추가
  const msgs = messages.length > 0
    ? messages
    : [{ role: 'user', content: '면접을 시작해주세요.' }]

  const stream = await client.messages.stream({
    model:      'claude-sonnet-4-6',
    max_tokens: 1024,
    system:     systemPrompt,
    messages:   msgs,
  })

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
