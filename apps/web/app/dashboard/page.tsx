// apps/web/app/dashboard/page.tsx

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { TopBar } from '@/components/layout/TopBar'
import { CodespaceCard } from '@/components/codespace/CodespaceCard'
import { listCodespaces } from '@/lib/github'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session?.user) {
    redirect('/login')
  }

  const accessToken = (session as any).accessToken
  if (!accessToken) {
    redirect('/login')
  }

  let codespaces = []
  let error = null

  try {
    codespaces = await listCodespaces(accessToken)
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load Codespaces'
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950">
      <TopBar />

      <main className="flex-1 overflow-auto p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            Your Codespaces
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {codespaces.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                No Codespaces found
              </p>
              <a
                href="https://github.com/codespaces"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Create one on GitHub
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {codespaces.map((codespace) => (
                <CodespaceCard key={codespace.id} codespace={codespace} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
