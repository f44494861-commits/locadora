"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";
import { createSessionAction } from "@/server/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.email("Informe um e-mail válido"),
  senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@locadora.com",
      senha: "",
    },
  });

  function onSubmit(values: LoginValues) {
    setError(null);
    startTransition(async () => {
      try {
        const credential = await signInWithEmailAndPassword(
          getClientAuth(),
          values.email,
          values.senha
        );
        const idToken = await credential.user.getIdToken();
        const result = await createSessionAction(idToken);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        router.replace("/dashboard");
        router.refresh();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Falha ao autenticar";
        if (message.includes("auth/invalid-credential")) {
          setError("E-mail ou senha inválidos.");
        } else if (message.includes("auth/network-request-failed")) {
          setError(
            "Não foi possível conectar ao Auth. Verifique se os emuladores estão rodando."
          );
        } else {
          setError(message);
        }
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="senha">Senha</Label>
        <Input
          id="senha"
          type="password"
          autoComplete="current-password"
          {...form.register("senha")}
        />
        {form.formState.errors.senha && (
          <p className="text-sm text-destructive">
            {form.formState.errors.senha.message}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
