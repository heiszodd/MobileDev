// apps/web/app/api/ai/route.ts

import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { message, context } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Missing message' },
        { status: 400 }
      )
    }

    // TODO: Implement Gemini API streaming
    return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
  } catch (error) {
    console.error('Error in AI route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
