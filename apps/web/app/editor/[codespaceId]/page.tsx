// apps/web/app/editor/[codespaceId]/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Terminal } from '@/components/terminal/Terminal'
import { TopBar } from '@/components/layout/TopBar'
import { BottomNav } from '@/components/layout/BottomNav'

interface EditorPageProps {
  params: {
    codespaceId: string
  }
}

export default function EditorPage({ params }: EditorPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'terminal' | 'editor' | 'ai'>(
    'terminal'
  )

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <p className="text-slate-400">Loading...</p>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const accessToken = (session as any).accessToken

  return (
    <div className="flex flex-col h-screen bg-slate-950">
      <TopBar />

      <main className="flex-1 overflow-hidden mb-16 md:mb-0">
        {activeTab === 'terminal' && (
          <Terminal codespaceId={params.codespaceId} token={accessToken} />
        )}
        {activeTab === 'editor' && (
          <div className="flex items-center justify-center h-full text-slate-400">
            Editor coming soon...
          </div>
        )}
        {activeTab === 'ai' && (
          <div className="flex items-center justify-center h-full text-slate-400">
            AI Assistant coming soon...
          </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
