// apps/relay/src/terminal.js

import { Client } from 'ssh2'
import { logger } from './logger.js'

export class TerminalRelay {
  constructor(ws, codespaceId, token, codespace) {
    this.ws = ws
    this.codespaceId = codespaceId
    this.token = token
    this.codespace = codespace
    this.sshClient = null
    this.stream = null
    this.connected = false
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const client = new Client()

      client.on('ready', () => {
        logger('info', `SSH connected to ${this.codespaceId}`)

        client.shell((err, stream) => {
          if (err) {
            logger('error', 'Failed to open shell', err.message)
            reject(err)
            return
          }

          this.stream = stream
          this.connected = true

          stream.on('data', (data) => {
            if (this.ws.readyState === 1) {
              this.ws.send(JSON.stringify({ type: 'output', data: data.toString() }))
            }
          })

          stream.on('error', (err) => {
            logger('error', 'Stream error', err.message)
            this.disconnect()
          })

          stream.on('close', () => {
            logger('info', 'Stream closed')
            this.connected = false
          })

          this.sshClient = client

          // Send status
          this.ws.send(
            JSON.stringify({
              type: 'status',
              connected: true,
              codespaceId: this.codespaceId,
            })
          )

          resolve()
        })
      })

      client.on('error', (err) => {
        logger('error', 'SSH connection error', err.message)
        reject(err)
      })

      client.on('close', () => {
        logger('info', 'SSH connection closed')
        this.connected = false
      })

      // Connect via GitHub Codespaces API
      const connectionDetails = this.codespace.connection_details
      if (!connectionDetails) {
        reject(new Error('No connection details available'))
        return
      }

      client.connect({
        host: connectionDetails.host,
        port: connectionDetails.port || 22,
        username: connectionDetails.username,
        privateKey: Buffer.from(connectionDetails.private_key, 'base64'),
      })
    })
  }

  sendInput(data) {
    if (this.stream && this.connected) {
      this.stream.write(data)
    }
  }

  resize(cols, rows) {
    if (this.stream && this.connected) {
      this.stream.setWindow(rows, cols)
    }
  }

  disconnect() {
    if (this.stream) {
      this.stream.end()
    }
    if (this.sshClient) {
      this.sshClient.end()
    }
    this.connected = false
  }
}
