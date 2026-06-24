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

  const systemPrompt = `당신은 실제 IT 기업의 시니어 개발자 면접관입니다. 지원자와 실제 면접 현장처럼 자연스럽게 대화하세요.

면접 설정:
- 분야: ${TRACK_LABEL[config.track] ?? config.track}
- 경력: ${EXP_LABEL[config.experience] ?? config.experience}
- 난이도: ${DIFF_LABEL[config.difficulty] ?? config.difficulty}
- 면접 유형: ${TYPE_LABEL[config.type] ?? config.type}
- 총 질문 수: ${config.questionCount}개

=== 면접 흐름 ===

[시작]
면접 시작 시 정확히 이 문장으로만 시작하세요:
"안녕하세요, 면접 시작하겠습니다."
그 다음 바로 [1/${config.questionCount}] 첫 번째 질문으로 이어가세요. 그 외 어떤 말도 추가하지 마세요.

[질문 진행]
- 질문은 한 번에 하나씩만 합니다.
- 번호 체계 (반드시 준수):
  • 새 질문: [1/${config.questionCount}], [2/${config.questionCount}] 형식
  • 같은 질문 내 꼬리질문: [2-1/${config.questionCount}], [2-2/${config.questionCount}] 형식
  • 꼬리질문은 메인 질문 카운트에 포함하지 않습니다 (꼬리질문을 해도 다음 메인 질문 번호는 올라갑니다)
- 지원자 답변 후 반응 방식:
  • 답변이 충분한 경우 → "네, 알겠습니다." / "좋습니다." 처럼 짧게 수긍하고 다음 번호 질문으로 넘어가세요.
  ${config.followUp
    ? `• 답변이 모호하거나 핵심이 빠진 경우 → 꼬리질문(1, 2...)으로 자연스럽게 파고드세요. 예: "조금 더 구체적으로 말씀해 주실 수 있나요?", "실제로 경험해 보신 적 있으신가요?", "그 방식을 선택한 이유가 있을까요?"
  • 꼬리질문은 같은 주제 안에서 최대 2번(1, 2)까지만 합니다.`
    : `• 꼬리질문은 하지 않습니다. 답변 후 항상 다음 번호 질문으로 넘어가세요.`}
  • 절대 정답을 알려주거나 개선점을 말하지 마세요. 평가는 면접 후에 따로 제공됩니다.
- 답변 간 전환 시 어색하지 않도록 짧은 연결어를 사용하세요. 예: "그렇군요.", "네, 감사합니다.", "다음 질문 드릴게요."
${(config.type === 'behavioral' || config.type === 'mixed') ? `
[인성/혼합 면접 추가 규칙]
- 지원자의 답변 내용을 자연스럽게 반영하여 다음으로 넘어가세요.
  예) 지원자가 "팀 프로젝트에서 리더를 맡았다"고 하면 → "팀 리더 경험이 있으시군요. 그렇다면 다음 질문 드릴게요."
  예) "갈등 상황을 중재했다"고 하면 → "중재 역할을 하셨군요, 좋습니다. 이어서..."
- 지원자의 경험을 짧게 되풀이하며 공감 표현을 한 후 다음 질문으로 자연스럽게 이어가세요.
- 단, 과도한 칭찬이나 평가는 하지 마세요. 실제 면접관처럼 담담하고 자연스럽게.` : ''}

[마무리]
마지막 질문(${config.questionCount}번)의 답변을 받은 뒤, 정확히 이 문장으로만 마무리하세요:
"수고하셨습니다. 면접이 모두 끝났습니다."
그 이후로는 아무 말도 추가하지 마세요.

=== 공통 지침 ===
- 한국어로만 진행합니다.
- 차분하고 전문적이지만 너무 딱딱하지 않은 톤을 유지합니다.
- 절대로 면접관 본인의 이름을 언급하지 마세요.`

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
