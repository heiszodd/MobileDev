// apps/web/components/terminal/MobileKeyboard.tsx

'use client'

import { useEffect, useState } from 'react'

interface MobileKeyboardProps {
  onData: (data: string) => void
}

export function MobileKeyboard({ onData }: MobileKeyboardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const handleVisualViewportChange = () => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        const vh = window.visualViewport.height
        const screenHeight = window.innerHeight
        const estimatedKeyboardHeight = screenHeight - vh
        setKeyboardHeight(estimatedKeyboardHeight)
        setIsVisible(estimatedKeyboardHeight > 100)
      }
    }

    if (typeof window !== 'undefined' && window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange)
      return () => {
        window.visualViewport?.removeEventListener('resize', handleVisualViewportChange)
      }
    }
  }, [])

  const handleKeyPress = (e: React.PointerEvent<HTMLButtonElement>, key: string) => {
    e.preventDefault()
    onData(key)
  }

  const keys = [
    [
      { label: 'Tab', key: '\t' },
      { label: 'Esc', key: '\x1b' },
      { label: 'Ctrl+C', key: '\x03' },
      { label: 'Ctrl+D', key: '\x04' },
    ],
    [
      { label: 'Ctrl+Z', key: '\x1a' },
      { label: 'Ctrl+L', key: '\x0c' },
      { label: '↑', key: '\x1b[A' },
      { label: '↓', key: '\x1b[B' },
    ],
    [
      { label: '←', key: '\x1b[D' },
      { label: '→', key: '\x1b[C' },
      { label: 'Enter', key: '\r' },
      { label: 'Space', key: ' ' },
    ],
  ]

  if (!isVisible) {
    return null
  }

  return (
    <div
      className="bg-slate-800 border-t border-slate-700 p-2 max-h-40 overflow-y-auto"
      style={{
        paddingBottom: `${Math.max(keyboardHeight + 8, 8)}px`,
      }}
    >
      <div className="space-y-2">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((btn, btnIndex) => (
              <button
                key={`${rowIndex}-${btnIndex}`}
                onPointerDown={(e) => handleKeyPress(e, btn.key)}
                className="flex-1 min-h-[44px] min-w-[44px] bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white text-sm font-medium rounded transition-colors"
                type="button"
              >
                {btn.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
