// apps/web/lib/relay.ts

import { RelayMessage } from '@/types'

export class RelayClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private readonly maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private messageHandlers: Map<string, (msg: RelayMessage) => void> = new Map()
  private pingInterval: NodeJS.Timeout | null = null

  constructor(
    private url: string,
    private onConnect?: () => void,
    private onDisconnect?: () => void
  ) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          console.log('[Relay] Connected')
          this.reconnectAttempts = 0
          this.reconnectDelay = 1000

          // Setup ping interval
          this.pingInterval = setInterval(() => {
            this.send({ type: 'ping' })
          }, 30000)

          this.onConnect?.()
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as RelayMessage
            const handler = this.messageHandlers.get(message.type)
            if (handler) {
              handler(message)
            }
          } catch (error) {
            console.error('[Relay] Failed to parse message:', error)
          }
        }

        this.ws.onerror = (error) => {
          console.error('[Relay] WebSocket error:', error)
          reject(new Error('Failed to connect to relay'))
        }

        this.ws.onclose = () => {
          console.log('[Relay] Disconnected')
          if (this.pingInterval) {
            clearInterval(this.pingInterval)
          }
          this.onDisconnect?.()
          this.attemptReconnect()
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[Relay] Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    console.log(
      `[Relay] Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    )

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('[Relay] Reconnection failed:', error)
      })
    }, this.reconnectDelay)

    // Exponential backoff: 1s → 2s → 4s → 8s → 30s
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000)
  }

  send(message: RelayMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('[Relay] WebSocket is not open')
    }
  }

  on(type: RelayMessage['type'], handler: (msg: RelayMessage) => void) {
    this.messageHandlers.set(type, handler)
  }

  disconnect() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
    }
    if (this.ws) {
      this.ws.close()
    }
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }
}
