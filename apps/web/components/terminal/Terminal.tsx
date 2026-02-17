// apps/web/components/terminal/Terminal.tsx

'use client'

import { useEffect, useRef, useState } from 'react'
import { RelayClient } from '@/lib/relay'
import { TerminalToolbar } from './TerminalToolbar'
import { MobileKeyboard } from './MobileKeyboard'

interface TerminalProps {
  codespaceId: string
  token: string
}

export function Terminal({ codespaceId, token }: TerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [connected, setConnected] = useState(false)
  const [reconnecting, setReconnecting] = useState(false)
  const [output, setOutput] = useState<string[]>([])
  const relayRef = useRef<RelayClient | null>(null)

  useEffect(() => {
    const initRelay = async () => {
      try {
        const relayUrl = process.env.NEXT_PUBLIC_RELAY_URL
        if (!relayUrl) {
          console.error('NEXT_PUBLIC_RELAY_URL not set')
          return
        }

        relayRef.current = new RelayClient(
          relayUrl,
          () => {
            setConnected(true)
            setReconnecting(false)
            console.log('[Terminal] Connected to relay')
          },
          () => {
            setConnected(false)
            setReconnecting(true)
            console.log('[Terminal] Disconnected from relay')
          }
        )

        await relayRef.current.connect()

        relayRef.current.on('output', (msg) => {
          if (msg.data) {
            setOutput((prev) => [...prev, msg.data])
          }
        })

        relayRef.current.on('error', (msg) => {
          console.error('[Terminal] Error:', msg.message)
          setOutput((prev) => [...prev, `❌ Error: ${msg.message}\n`])
        })

        // Connect to codespace
        relayRef.current.send({
          type: 'connect',
          codespaceId,
          token,
        })
      } catch (error) {
        console.error('[Terminal] Failed to initialize relay:', error)
        setOutput((prev) => [
          ...prev,
          `❌ Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}\n`,
        ])
      }
    }

    initRelay()

    return () => {
      if (relayRef.current) {
        relayRef.current.disconnect()
      }
    }
  }, [codespaceId, token])

  const handleSendInput = (data: string) => {
    if (relayRef.current && relayRef.current.isConnected()) {
      relayRef.current.send({ type: 'input', data })
    }
  }

  const handleClear = () => {
    setOutput([])
  }

  const handleCopy = () => {
    const text = output.join('')
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-mono text-sm">
      <TerminalToolbar onClear={handleClear} onCopy={handleCopy} />

      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 whitespace-pre-wrap break-words"
      >
        {output.length === 0 ? (
          <div className="text-slate-500">
            {connected ? (
              <div>
                <p>✓ Connected to {codespaceId}</p>
                <p>Ready for input...</p>
              </div>
            ) : reconnecting ? (
              <div>
                <p>⟳ Reconnecting...</p>
                <p className="text-xs text-slate-600">
                  If this persists, check that the relay server is running
                </p>
              </div>
            ) : (
              <div>
                <p>⟳ Connecting...</p>
                <p className="text-xs text-slate-600">
                  Make sure the relay server is running on port 3001
                </p>
              </div>
            )}
          </div>
        ) : (
          output.map((line, i) => <span key={i}>{line}</span>)
        )}
      </div>

      <div className="border-t border-slate-800">
        <MobileKeyboard onKeyPress={handleSendInput} />
      </div>
    </div>
  )
}
