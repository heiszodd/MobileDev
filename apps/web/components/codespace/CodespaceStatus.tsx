// apps/web/components/codespace/CodespaceStatus.tsx

import { CodespaceState } from '@/types'

interface CodespaceStatusProps {
  state: CodespaceState
}

export function CodespaceStatus({ state }: CodespaceStatusProps) {
  const statusConfig: Record<CodespaceState, { color: string; label: string }> = {
    Available: { color: 'bg-green-500', label: 'Running' },
    Shutdown: { color: 'bg-slate-400', label: 'Stopped' },
    Starting: { color: 'bg-yellow-500', label: 'Starting...' },
    Stopping: { color: 'bg-orange-500', label: 'Stopping...' },
    Rebuilding: { color: 'bg-blue-500', label: 'Rebuilding...' },
    Failed: { color: 'bg-red-500', label: 'Failed' },
  }

  const config = statusConfig[state] || { color: 'bg-slate-400', label: state }

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      <span className="text-sm text-slate-600 dark:text-slate-400">
        {config.label}
      </span>
    </div>
  )
}
