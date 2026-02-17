// apps/web/middleware.ts

import { withAuth } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/editor/:path*',
    '/api/protected/:path*',
  ],
}

export default withAuth(function middleware(req) {
  // Middleware code here (optional)
})
