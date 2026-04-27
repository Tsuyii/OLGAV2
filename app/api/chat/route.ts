import { NextRequest, NextResponse } from 'next/server'

const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface ChatRequest {
  message: string
  userId?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    
    const { message, userId } = body
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }
    
    if (message.length > 1000) {
      return NextResponse.json(
        { error: 'Message is too long' },
        { status: 400 }
      )
    }

    const response = await fetch(`${PYTHON_BACKEND_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, userId }),
    })

    if (!response.ok) {
      throw new Error(`Python backend error: ${response.status}`)
    }

    const data = await response.json()
    
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        const content = data.reply || ''
        const chunks = content.match(/.{1,50}/g) || []
        
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
        }
        
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })
    
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Chat API is running. POST a message to start a conversation.',
  })
}