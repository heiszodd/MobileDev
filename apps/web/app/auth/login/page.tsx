// apps/web/app/auth/login/page.tsx

'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-center text-slate-900 dark:text-white">
            MobileDev
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Mobile-optimized GitHub Codespaces
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
              <p className="font-medium">Authentication failed</p>
              <p>{error}</p>
            </div>
          )}

          <button
            onClick={() =>
              signIn('github', {
                redirect: true,
                callbackUrl: '/dashboard',
              })
            }
            className="w-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Sign in with GitHub</span>
          </button>

          <p className="text-xs text-slate-500 dark:text-slate-500 text-center mt-6">
            By signing in, you authorize MobileDev to access your Codespaces.
            Your authentication token is stored securely and never shared.
          </p>
        </div>
      </div>
    </main>
  )
}
