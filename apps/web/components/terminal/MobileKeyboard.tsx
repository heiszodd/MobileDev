// apps/web/components/terminal/MobileKeyboard.tsx

'use client'

import { useState, useEffect } from 'react'

interface MobileKeyboardProps {
  onKeyPress?: (key: string) => void
}

const keyRows = [
  [
    { label: 'Tab', value: '\t' },
    { label: 'Esc', value: '\x1b' },
    { label: 'Ctrl+C', value: '\x03' },
    { label: 'Ctrl+D', value: '\x04' },
  ],
  [
    { label: '↑', value: '\x1b[A' },
    { label: '↓', value: '\x1b[B' },
    { label: '←', value: '\x1b[D' },
    { label: '→', value: '\x1b[C' },
  ],
  [
    { label: 'Ctrl+L', value: '\x0c' },
    { label: 'Ctrl+Z', value: '\x1a' },
    { label: '~', value: '~' },
    { label: '|', value: '|' },
  ],
]

export function MobileKeyboard({ onKeyPress }: MobileKeyboardProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const updateKeyboardHeight = () => {
      if (typeof visualViewport !== 'undefined') {
        const screenHeight = window.innerHeight
        const viewportHeight = visualViewport?.height || window.innerHeight
        setKeyboardHeight(Math.max(0, screenHeight - viewportHeight))
      }
    }

    if (typeof visualViewport !== 'undefined') {
      visualViewport?.addEventListener('resize', updateKeyboardHeight)
      return () =>
        visualViewport?.removeEventListener('resize', updateKeyboardHeight)
    }
  }, [])

  const handleKeyPress = (value: string) => {
    onKeyPress?.(value)
  }

  return (
    <div className="bg-slate-800 border-t border-slate-700">
      <div className="flex flex-col gap-1 p-2 max-h-48 overflow-auto">
        {keyRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1">
            {row.map((key) => (
              <button
                key={key.label}
                onPointerDown={(e) => {
                  e.preventDefault()
                  handleKeyPress(key.value)
                }}
                className="flex-1 min-h-[44px] bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-slate-100 text-xs font-medium rounded transition-colors"
              >
                {key.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
