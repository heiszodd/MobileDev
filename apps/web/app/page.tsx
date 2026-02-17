import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Link from 'next/link'

export default async function Home() {
  const session = await getServerSession()

  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          MobileDev
        </h1>
        <p className="text-xl text-slate-300 mb-4">
          Mobile-optimized interface for GitHub Codespaces
        </p>
        <p className="text-slate-400 mb-12 max-w-md mx-auto">
          Code on the go with a touch-friendly terminal, editor, and AI assistant.
          All optimized for your phone or tablet.
        </p>

        <div className="space-y-4">
          <Link
            href="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-lg min-h-[44px]"
          >
            Sign in with GitHub
          </Link>

          <p className="text-sm text-slate-500">
            No account? Create one free on{' '}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              GitHub
            </a>
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div>
            <div className="text-3xl mb-2">█</div>
            <h3 className="font-semibold text-white mb-2">Terminal</h3>
            <p className="text-slate-400 text-sm">
              Full xterm.js shell with keyboard shortcuts and mobile-optimized input
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">{'{}'}</div>
            <h3 className="font-semibold text-white mb-2">Code Editor</h3>
            <p className="text-slate-400 text-sm">
              CodeMirror 6 with syntax highlighting for 6+ languages
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">✨</div>
            <h3 className="font-semibold text-white mb-2">AI Assistant</h3>
            <p className="text-slate-400 text-sm">
              Google Gemini integration for smart code suggestions
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
