"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { getClientAuth } from "@/lib/firebase/client";
import { logoutAction } from "@/server/auth/actions";

export function LogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      try {
        await signOut(getClientAuth());
      } catch {
        // Emulador/offline: ainda limpamos o cookie no servidor.
      }
      await logoutAction();
      router.replace("/login");
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-start"
      onClick={handleLogout}
      disabled={pending}
    >
      <LogOut className="h-4 w-4" />
      {pending ? "Saindo..." : "Sair"}
    </Button>
  );
}
