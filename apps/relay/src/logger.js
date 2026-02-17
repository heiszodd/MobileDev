// apps/relay/src/logger.js

const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

const levels = { debug: 0, info: 1, warn: 2, error: 3 }
const currentLevel = levels[LOG_LEVEL]

export function logger(level, message, data = null) {
  if (levels[level] >= currentLevel) {
    const timestamp = new Date().toISOString()
    if (data) {
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, data)
    } else {
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`)
    }
  }
}
