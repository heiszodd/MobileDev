// apps/relay/src/index.js

import WebSocket from 'ws'
import http from 'http'
import dotenv from 'dotenv'
import { logger } from './logger.js'
import { validateGitHubToken, getCodespaceConnection } from './auth.js'
import { TerminalRelay } from './terminal.js'

dotenv.config()

const PORT = process.env.PORT || 3001
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',')

const server = http.createServer()
const wss = new WebSocket.Server({ server })

const connections = new Map()

wss.on('connection', (ws, req) => {
  logger('info', 'Client connected')

  const clientOrigin = req.headers.origin
  if (!ALLOWED_ORIGINS.includes(clientOrigin)) {
    logger('warn', 'Unauthorized origin', clientOrigin)
    ws.close(4003, 'Unauthorized origin')
    return
  }

  let relay = null

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data)

      switch (message.type) {
        case 'connect': {
          const { codespaceId, token } = message

          // Validate GitHub token
          const tokenValid = await validateGitHubToken(token)
          if (!tokenValid.valid) {
            ws.send(
              JSON.stringify({
                type: 'error',
                message: 'Invalid GitHub token',
                code: 'AUTH_FAILED',
              })
            )
            return
          }

          // Get Codespace connection details
          const codespaceInfo = await getCodespaceConnection(codespaceId, token)
          if (!codespaceInfo.success) {
            ws.send(
              JSON.stringify({
                type: 'error',
                message: codespaceInfo.error,
                code: 'CODESPACE_NOT_FOUND',
              })
            )
            return
          }

          // Create terminal relay
          relay = new TerminalRelay(ws, codespaceId, token, codespaceInfo.codespace)

          try {
            await relay.connect()
            connections.set(ws, relay)
            logger('info', `Relay connected for ${codespaceId}`)
          } catch (error) {
            logger('error', 'Relay connection failed', error.message)
            ws.send(
              JSON.stringify({
                type: 'error',
                message: 'Failed to connect to Codespace',
                code: 'RELAY_FAILED',
              })
            )
          }

          break
        }

        case 'input': {
          if (relay) {
            relay.sendInput(message.data)
          }
          break
        }

        case 'resize': {
          if (relay) {
            relay.resize(message.cols, message.rows)
          }
          break
        }

        case 'ping': {
          ws.send(JSON.stringify({ type: 'ping' }))
          break
        }

        case 'disconnect': {
          if (relay) {
            relay.disconnect()
            connections.delete(ws)
          }
          break
        }

        default: {
          logger('warn', 'Unknown message type', message.type)
        }
      }
    } catch (error) {
      logger('error', 'Message handling error', error.message)
      ws.send(
        JSON.stringify({
          type: 'error',
          message: 'Internal server error',
          code: 'SERVER_ERROR',
        })
      )
    }
  })

  ws.on('close', () => {
    if (relay) {
      relay.disconnect()
      connections.delete(ws)
    }
    logger('info', 'Client disconnected')
  })

  ws.on('error', (error) => {
    logger('error', 'WebSocket error', error.message)
  })
})

// Ping all connected clients every 30s to keep alive
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      return ws.terminate()
    }
    ws.isAlive = false
    ws.ping()
  })
}, 30000)

server.listen(PORT, () => {
  logger('info', `Relay server listening on port ${PORT}`)
})
