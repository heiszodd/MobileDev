import { withAuth } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/editor/:path*',
    '/api/protected/:path*',
  ],
}

export default withAuth({
  pages: {
    signIn: '/auth/login',
  },
})
