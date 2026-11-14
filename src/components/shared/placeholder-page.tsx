import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
  etapa: string;
}

export function PlaceholderPage({
  title,
  description,
  etapa,
}: PlaceholderPageProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Em construção</CardTitle>
          <CardDescription>
            Este módulo será implementado na {etapa}.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          A etapa 1 entregou autenticação, layout e navegação. Confirme para
          seguirmos.
        </CardContent>
      </Card>
    </div>
  );
}
