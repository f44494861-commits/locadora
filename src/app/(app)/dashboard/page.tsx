import { getSessionUser } from "@/lib/auth/session";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await getSessionUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Olá, {user?.nome}. Visão geral da locadora.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          "Locações em andamento",
          "Devoluções hoje",
          "Locações atrasadas",
          "Receita do mês",
        ].map((title) => (
          <Card key={title}>
            <CardHeader className="pb-2">
              <CardDescription>{title}</CardDescription>
              <CardTitle className="text-3xl">—</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Dados na etapa 7
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
