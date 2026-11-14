import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import type { Perfil, SessionUser } from "@/lib/types";

export const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME || "__session";

export function getSessionMaxAgeSeconds() {
  const days = Number(process.env.SESSION_COOKIE_MAX_AGE_DAYS || "5");
  return Math.max(1, days) * 24 * 60 * 60;
}

export async function createSessionCookie(idToken: string) {
  const expiresIn = getSessionMaxAgeSeconds() * 1000;
  const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
    expiresIn,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getSessionMaxAgeSeconds(),
  });

  return sessionCookie;
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(
      sessionCookie,
      true
    );
    const snap = await getAdminDb().collection("users").doc(decoded.uid).get();
    if (!snap.exists) {
      await clearSessionCookie();
      return null;
    }

    const data = snap.data()!;
    if (data.ativo === false) {
      await clearSessionCookie();
      return null;
    }

    return {
      uid: decoded.uid,
      email: decoded.email || data.email || "",
      nome: data.nome || "",
      perfil: (data.perfil || "ATENDENTE") as Perfil,
      ativo: data.ativo !== false,
    };
  } catch {
    try {
      await clearSessionCookie();
    } catch {
      // ignore
    }
    return null;
  }
}

export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Não autenticado");
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireSessionUser();
  if (user.perfil !== "ADMIN") {
    throw new Error("Acesso negado");
  }
  return user;
}
