// apps/web/components/layout/TopBar.tsx

'use client'

import { useSession, signOut } from 'next-auth/react'

export function TopBar() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-14 flex items-center justify-between px-4 z-40">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">
        MobileDev
      </h1>

      {session?.user && (
        <div className="flex items-center gap-3">
          {session.user.image && (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-8 h-8 rounded-full"
            />
          )}
          <button
            onClick={() => signOut()}
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  )
}
