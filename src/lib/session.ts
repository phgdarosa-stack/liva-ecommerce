import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function getSessionUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Server-side guard for API routes. Middleware already blocks page
 * navigation, but every data-touching route re-checks here so access never
 * relies solely on frontend visibility.
 */
export async function requireUser() {
  const user = await getSessionUser();
  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        { error: "Entre ou crie sua conta para continuar." },
        { status: 401 }
      ),
    };
  }
  return { user, error: null };
}

export async function requireAdmin() {
  const { user, error } = await requireUser();
  if (error) return { user: null, error };
  if (user!.role !== "ADMIN") {
    return {
      user: null,
      error: NextResponse.json({ error: "Acesso restrito ao time LIVA." }, { status: 403 }),
    };
  }
  return { user, error: null };
}
