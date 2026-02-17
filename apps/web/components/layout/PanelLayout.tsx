// apps/web/components/layout/PanelLayout.tsx

'use client'

import { useState } from 'react'

interface PanelLayoutProps {
  top: React.ReactNode
  bottom: React.ReactNode
  dividerPosition?: number
}

export function PanelLayout({
  top,
  bottom,
  dividerPosition = 50,
}: PanelLayoutProps) {
  const [position, setPosition] = useState(dividerPosition)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const container = document.getElementById('panel-container')
    if (!container) return

    const rect = container.getBoundingClientRect()
    const newPosition = ((e.clientY - rect.top) / rect.height) * 100

    if (newPosition > 20 && newPosition < 80) {
      setPosition(newPosition)
    }
  }

  return (
    <div
      id="panel-container"
      className="flex flex-col flex-1 overflow-hidden"
      onMouseUp={handleMouseUp}
      onMouseMove={(e) => handleMouseMove(e as any)}
      onMouseLeave={handleMouseUp}
    >
      <div style={{ height: `${position}%` }} className="overflow-auto">
        {top}
      </div>

      <div
        onMouseDown={handleMouseDown}
        className={`h-1 bg-slate-300 dark:bg-slate-700 cursor-row-resize hover:bg-blue-400 transition-colors ${
          isDragging ? 'bg-blue-400' : ''
        }`}
      />

      <div style={{ height: `${100 - position}%` }} className="overflow-auto">
        {bottom}
      </div>
    </div>
  )
}
