// apps/web/components/layout/BottomNav.tsx

'use client'

interface BottomNavProps {
  activeTab: 'terminal' | 'editor' | 'ai'
  onTabChange: (tab: 'terminal' | 'editor' | 'ai') => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'terminal', label: 'Terminal', icon: '█' },
    { id: 'editor', label: 'Editor', icon: '{}' },
    { id: 'ai', label: 'AI', icon: '✨' },
  ] as const

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around h-16 md:hidden">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-colors ${
            activeTab === tab.id
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400'
          }`}
          aria-label={tab.label}
          aria-pressed={activeTab === tab.id}
        >
          <span className="text-lg">{tab.icon}</span>
          <span className="text-xs font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
