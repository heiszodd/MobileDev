// apps/web/components/terminal/Terminal.tsx

'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { RelayClient } from '@/lib/relay'
import { RelayMessage } from '@/types'

const MobileKeyboard = dynamic(() => import('./MobileKeyboard').then(mod => ({ default: mod.MobileKeyboard })), { ssr: false })

interface TerminalProps {
  codespaceId: string
  token: string
}

export function Terminal({ codespaceId, token }: TerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<any>(null)
  const relayRef = useRef<RelayClient | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const setupTerminal = async () => {
      try {
        // Import xterm dynamically since it's browser-only
        const { Terminal: XTerminal } = await import('xterm')
        const { FitAddon } = await import('xterm-addon-fit')
        await import('xterm/css/xterm.css')

        if (!mounted || !containerRef.current) return

        // Create terminal instance
        const term = new XTerminal({
          cols: 80,
          rows: 24,
          theme: {
            background: '#0f172a',
            foreground: '#f1f5f9',
          },
          fontFamily: '"Fira Code", monospace',
          fontSize: 14,
        })

        term.open(containerRef.current)
        termRef.current = term

        // Setup fit addon
        const fitAddon = new FitAddon()
        term.loadAddon(fitAddon)
        fitAddon.fit()

        // Setup relay connection
        const relayUrl = process.env.NEXT_PUBLIC_RELAY_URL || 'ws://localhost:3001'
        const relay = new RelayClient(
          relayUrl,
          () => {
            if (mounted) {
              setIsConnected(true)
              setIsLoading(false)
            }
          },
          () => {
            if (mounted) {
              setIsConnected(false)
              term.writeln('\r\n[Connection lost. Reconnecting...]')
            }
          }
        )

        // Setup message handlers
        relay.on('output', (msg: RelayMessage) => {
          if (msg.data) {
            term.write(msg.data)
          }
        })

        relay.on('error', (msg: RelayMessage) => {
          if (msg.message) {
            term.writeln(`\r\n[Error: ${msg.message}]`)
          }
        })

        // Handle user input
        term.onData((data) => {
          relay.send({ type: 'input', data })
        })

        // Handle resize
        const handleResize = () => {
          fitAddon.fit()
          relay.send({
            type: 'resize',
            cols: term.cols,
            rows: term.rows,
          })
        }

        window.addEventListener('resize', handleResize)

        // Connect relay
        relayRef.current = relay
        await relay.connect()
        relay.send({ type: 'connect', codespaceId, token })

        return () => {
          window.removeEventListener('resize', handleResize)
          relay.disconnect()
          term.dispose()
        }
      } catch (error) {
        console.error('[Terminal] Setup error:', error)
        if (mounted && containerRef.current) {
          containerRef.current.innerHTML =
            '<div class="text-red-500 p-4">Failed to initialize terminal</div>'
        }
      }
    }

    setupTerminal()

    return () => {
      mounted = false
    }
  }, [codespaceId, token])

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-400">Connecting to Codespace...</p>
        </div>
      )}

      <div
        ref={containerRef}
        className={`flex-1 overflow-hidden ${isLoading ? 'hidden' : ''}`}
        style={{ minHeight: 0 }}
      />

      {termRef.current && <MobileKeyboard onData={(data) => termRef.current.write(data)} />}

      {!isConnected && !isLoading && (
        <div className="bg-red-900/20 border-t border-red-700 p-3 text-red-400 text-sm">
          <p>Terminal disconnected. Attempting to reconnect...</p>
        </div>
      )}
    </div>
  )
}
