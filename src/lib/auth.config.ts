import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe config (no Prisma/bcrypt) used by middleware for route
 * authorization. The Credentials provider itself lives in auth.ts, which
 * only runs in the Node.js runtime (API routes / server components).
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/entrar",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const { pathname } = nextUrl;

      if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        return isLoggedIn && role === "ADMIN";
      }
      if (pathname.startsWith("/conta") || pathname.startsWith("/checkout")) {
        return isLoggedIn;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
