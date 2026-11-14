"use server";

import {
  clearSessionCookie,
  createSessionCookie,
} from "@/lib/auth/session";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export async function createSessionAction(idToken: string) {
  try {
    if (!idToken) {
      return { ok: false as const, error: "Token ausente." };
    }

    const decoded = await getAdminAuth().verifyIdToken(idToken);
    const userSnap = await getAdminDb()
      .collection("users")
      .doc(decoded.uid)
      .get();

    if (!userSnap.exists) {
      return {
        ok: false as const,
        error: "Usuário sem perfil no sistema. Peça ao admin para cadastrá-lo.",
      };
    }

    const data = userSnap.data()!;
    if (data.ativo === false) {
      return { ok: false as const, error: "Usuário inativo." };
    }

    await createSessionCookie(idToken);
    return {
      ok: true as const,
      user: {
        uid: decoded.uid,
        nome: data.nome as string,
        perfil: data.perfil as string,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao criar sessão.";
    return { ok: false as const, error: message };
  }
}

export async function logoutAction() {
  await clearSessionCookie();
  return { ok: true as const };
}
