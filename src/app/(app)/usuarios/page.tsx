import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { PlaceholderPage } from "@/components/shared/placeholder-page";

export default async function UsuariosPage() {
  const user = await getSessionUser();
  if (!user || user.perfil !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <PlaceholderPage
      title="Usuários"
      description="Cadastro de atendentes e administradores."
      etapa="etapa 1 (expansão) / administração"
    />
  );
}
