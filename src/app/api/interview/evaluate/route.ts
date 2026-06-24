import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { messages, config } = await req.json()

  const conversation = messages
    .map((m: { role: string; content: string }) =>
      `[${m.role === 'user' ? '지원자' : '면접관'}]: ${m.content}`
    )
    .join('\n\n')

  const prompt = `다음은 실제로 진행된 면접 전체 대화입니다.

면접 설정: ${config.track} / ${config.experience} / ${config.difficulty} / ${config.type} / ${config.questionCount}문제

---
${conversation}
---

위 대화를 바탕으로 지원자를 상세히 평가해주세요.
반드시 아래 JSON 형식으로만 응답하세요. JSON 외 다른 텍스트는 절대 출력하지 마세요.

{
  "score": 숫자(0-100),
  "attitude": "면접 태도에 대한 한 문장 평가 (자신감, 말투, 성실성 등)",
  "strengths": ["강점1", "강점2", "강점3"],
  "questionReviews": [
    {
      "question": "면접관이 물어본 질문 원문",
      "answer": "지원자 답변 요약 (1-2문장)",
      "rating": "good | fair | poor",
      "feedback": "이 질문에서 아쉬웠던 점 또는 잘한 점 (2-3문장)"
    }
  ],
  "improvements": ["개선할 점1", "개선할 점2", "개선할 점3"],
  "overall": "총평 (3-4문장, 구체적으로)"
}`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''

  // JSON 파싱
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return NextResponse.json({ error: 'parse_failed' }, { status: 500 })
  }

  const result = JSON.parse(jsonMatch[0])
  return NextResponse.json(result)
}
