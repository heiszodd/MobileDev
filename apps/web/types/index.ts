// apps/web/types/index.ts

export interface Codespace {
  id: string
  name: string
  repository: { full_name: string; html_url: string }
  ref: string
  state: CodespaceState
  machine: { name: string; display_name: string; cpus: number; memory_in_bytes: number }
  created_at: string
  last_used_at: string
  web_url: string
}

export type CodespaceState =
  | 'Available' | 'Shutdown' | 'Starting' | 'Stopping' | 'Rebuilding' | 'Failed'

export interface FileNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FileNode[]
  language?: string
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface EditorContext {
  fileName: string | null
  fileContent: string | null
  language: string | null
  cursorLine: number
}

export interface TerminalContext {
  history: string[]
  cwd: string | null
}

export interface RelayMessage {
  type: 'connect' | 'input' | 'resize' | 'disconnect' | 'output' | 'status' | 'error' | 'ping'
  data?: string
  codespaceId?: string
  token?: string
  cols?: number
  rows?: number
  connected?: boolean
  message?: string
  code?: string
}

export interface UserPreferences {
  theme: 'dark' | 'light'
  fontSize: number
  fontFamily: 'mono' | 'jetbrains' | 'fira'
  hapticFeedback: boolean
  autoScroll: boolean
}
