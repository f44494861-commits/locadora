export type Perfil = "ADMIN" | "ATENDENTE";

export type ClienteTipo = "PF" | "PJ";

export type ControleEstoque = "SERIALIZADO" | "QUANTIDADE";

export type CondicaoEquipamento = "NOVO" | "USADO";

export type StatusUnidade =
  | "DISPONIVEL"
  | "ALUGADO"
  | "MANUTENCAO"
  | "BAIXADO";

export type TipoMovimentoEstoque =
  | "ENTRADA"
  | "SAIDA_LOCACAO"
  | "RETORNO"
  | "MANUTENCAO"
  | "BAIXA"
  | "AJUSTE";

export type StatusLocacao =
  | "ORCAMENTO"
  | "RESERVADA"
  | "EM_ANDAMENTO"
  | "FINALIZADA"
  | "CANCELADA";

export type EntregaTipo = "RETIRADA" | "ENTREGA";

export type TipoLancamento = "RECEITA" | "DESPESA";

export type CategoriaLancamento =
  | "LOCACAO"
  | "CAUCAO"
  | "MULTA"
  | "MANUTENCAO"
  | "COMPRA_EQUIPAMENTO"
  | "SALARIO"
  | "OUTROS";

export type StatusLancamento = "PENDENTE" | "PAGO" | "ATRASADO" | "CANCELADO";

export type FormaPagamento =
  | "PIX"
  | "DINHEIRO"
  | "CARTAO"
  | "BOLETO"
  | "TRANSFERENCIA";

export interface SessionUser {
  uid: string;
  email: string;
  nome: string;
  perfil: Perfil;
  ativo: boolean;
}

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface ItemLocacao {
  equipamentoId: string;
  equipamentoNome: string;
  unidadeId?: string | null;
  condicao: CondicaoEquipamento;
  quantidade: number;
  valorUnitarioDiaria: number;
  periodoCobrado: string;
  subtotal: number;
}
