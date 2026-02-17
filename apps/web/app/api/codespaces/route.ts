// apps/web/app/api/codespaces/route.ts

import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { listCodespaces } from '@/lib/github'

export async function GET() {
  const session = await getServerSession()

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const codespaces = await listCodespaces(session.accessToken as string)
    return NextResponse.json({ codespaces })
  } catch (error) {
    console.error('Error listing codespaces:', error)
    return NextResponse.json(
      { error: 'Failed to list codespaces' },
      { status: 500 }
    )
  }
}
