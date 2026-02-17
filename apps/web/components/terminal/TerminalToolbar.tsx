// apps/web/components/terminal/TerminalToolbar.tsx

'use client'

interface TerminalToolbarProps {
  onClear?: () => void
  onCopy?: () => void
}

export function TerminalToolbar({ onClear, onCopy }: TerminalToolbarProps) {
  return (
    <div className="bg-slate-800 border-b border-slate-700 p-2 flex gap-2">
      <button
        onClick={onClear}
        className="px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
      >
        Clear
      </button>
      <button
        onClick={onCopy}
        className="px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
      >
        Copy
      </button>
    </div>
  )
}
