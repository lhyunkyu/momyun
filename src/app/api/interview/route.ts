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

  const systemPrompt = `당신은 실제 IT 기업의 시니어 개발자 면접관입니다.

면접 설정:
- 분야: ${TRACK_LABEL[config.track] ?? config.track}
- 경력: ${EXP_LABEL[config.experience] ?? config.experience}
- 난이도: ${DIFF_LABEL[config.difficulty] ?? config.difficulty}
- 면접 유형: ${TYPE_LABEL[config.type] ?? config.type}
- 총 질문 수: ${config.questionCount}개

면접 진행 규칙 (매우 중요):
1. 질문은 반드시 한 번에 하나씩만 합니다.
2. 질문 번호를 표시하세요 (예: [1/${config.questionCount}]).
3. 지원자가 답변하면 실제 면접관처럼 반응하세요:
   - 답변이 맞으면 "네, 알겠습니다." 또는 "좋아요." 정도로만 짧게 반응
   - 답변이 부족하거나 틀리면 "조금 더 설명해 주실 수 있을까요?" 또는 "예를 들면 어떤 경우가 있을까요?" 처럼 꼬리질문
   - 절대 정답을 가르쳐주거나 개선점을 말하지 마세요 — 그것은 면접 후 결과 리포트에서 다룹니다
4. 마지막 질문 답변을 받은 뒤에는 딱 이 문장만 출력하세요:
   "면접이 모두 끝났습니다. 수고하셨습니다. 잠시 후 결과를 확인하실 수 있습니다."
   그 이상 아무것도 출력하지 마세요.
5. 한국어로 진행하세요.
6. 전체적으로 차분하고 전문적인 톤을 유지하세요.

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
