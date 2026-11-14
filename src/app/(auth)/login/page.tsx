import { redirect } from "next/navigation";
import { HardHat } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth/session";

export const instant = false;

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#d9ebe1,_#f4f6f3_55%)] p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <HardHat className="h-6 w-6" />
          </div>
          <div>
            <CardTitle>Entrar</CardTitle>
            <CardDescription className="mt-2">
              Sistema interno da locadora de equipamentos
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Use o usuário seed (admin@locadora.com) após rodar os emuladores e o
            script create-admin/seed.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
