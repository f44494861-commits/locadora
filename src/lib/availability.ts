/**
 * Utilitários de disponibilidade / conflito de períodos.
 * A consulta Firestore completa entra na etapa 4; aqui fica a lógica pura.
 */

export interface Periodo {
  inicio: Date;
  fim: Date;
}

export interface OcupacaoQuantidade extends Periodo {
  quantidade: number;
}

export function periodosSobrepoem(a: Periodo, b: Periodo): boolean {
  return a.inicio <= b.fim && b.inicio <= a.fim;
}

export function unidadeLivreNoPeriodo(
  ocupacoes: Periodo[],
  solicitado: Periodo
): boolean {
  return !ocupacoes.some((o) => periodosSobrepoem(o, solicitado));
}

export function quantidadeDisponivelNoPeriodo(
  ocupacoes: OcupacaoQuantidade[],
  solicitado: Periodo,
  quantidadeTotal: number,
  quantidadeManutencao: number
): number {
  const capacidade = Math.max(0, quantidadeTotal - quantidadeManutencao);
  const sobrepostas = ocupacoes.filter((o) =>
    periodosSobrepoem(o, solicitado)
  );
  const ocupado = sobrepostas.reduce((acc, o) => acc + o.quantidade, 0);
  return Math.max(0, capacidade - ocupado);
}

export function temSaldoSuficiente(
  ocupacoes: OcupacaoQuantidade[],
  solicitado: Periodo,
  quantidadeSolicitada: number,
  quantidadeTotal: number,
  quantidadeManutencao: number
): boolean {
  return (
    quantidadeDisponivelNoPeriodo(
      ocupacoes,
      solicitado,
      quantidadeTotal,
      quantidadeManutencao
    ) >= quantidadeSolicitada
  );
}
