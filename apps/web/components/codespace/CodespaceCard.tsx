// apps/web/components/codespace/CodespaceCard.tsx

'use client'

import Link from 'next/link'
import { Codespace } from '@/types'
import { CodespaceStatus } from './CodespaceStatus'

interface CodespaceCardProps {
  codespace: Codespace
  onConnect?: () => void
  isLoading?: boolean
}

export function CodespaceCard({
  codespace,
  onConnect,
  isLoading = false,
}: CodespaceCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {codespace.name}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {codespace.repository.full_name}
          </p>
        </div>
        <CodespaceStatus state={codespace.state} />
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-500 mb-4">
        <p>Branch: {codespace.ref}</p>
        <p>Machine: {codespace.machine.display_name}</p>
      </div>

      <div className="flex gap-2">
        {codespace.state === 'Available' ? (
          <Link
            href={`/editor/${codespace.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded text-center text-sm transition-colors"
          >
            Connect
          </Link>
        ) : (
          <button
            disabled
            className="flex-1 bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400 font-medium py-2 px-3 rounded text-sm cursor-not-allowed"
          >
            {codespace.state === 'Shutdown' ? 'Stopped' : 'Starting...'}
          </button>
        )}

        <a
          href={codespace.web_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium py-2 px-3 rounded text-sm transition-colors"
        >
          Web
        </a>
      </div>
    </div>
  )
}
