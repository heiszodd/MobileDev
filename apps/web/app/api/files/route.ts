// apps/web/app/api/files/route.ts

import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const codespaceId = url.searchParams.get('codespaceId')
  const path = url.searchParams.get('path')

  if (!codespaceId || !path) {
    return NextResponse.json(
      { error: 'Missing codespaceId or path' },
      { status: 400 }
    )
  }

  // TODO: Implement file reading via relay server
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}

export async function PUT(request: Request) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // TODO: Implement file writing via relay server
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
