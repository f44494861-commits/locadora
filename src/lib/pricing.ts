/**
 * Calcula o melhor preço combinando meses, semanas e dias.
 * Isolado para facilitar testes unitários (etapa 4 completa a integração).
 */
export interface PricingInput {
  dias: number;
  valorDiaria: number;
  valorSemana: number;
  valorMes: number;
}

export interface PricingBreakdown {
  meses: number;
  semanas: number;
  dias: number;
  total: number;
}

export function calcularMelhorPreco(input: PricingInput): PricingBreakdown {
  const { dias, valorDiaria, valorSemana, valorMes } = input;

  if (dias <= 0) {
    return { meses: 0, semanas: 0, dias: 0, total: 0 };
  }

  let melhor: PricingBreakdown = {
    meses: 0,
    semanas: 0,
    dias,
    total: dias * valorDiaria,
  };

  const maxMeses = Math.floor(dias / 30);

  for (let meses = 0; meses <= maxMeses; meses++) {
    const restoAposMes = dias - meses * 30;
    const maxSemanas = Math.floor(restoAposMes / 7);

    for (let semanas = 0; semanas <= maxSemanas; semanas++) {
      const diasAvulsos = restoAposMes - semanas * 7;
      const total =
        meses * valorMes + semanas * valorSemana + diasAvulsos * valorDiaria;

      if (total < melhor.total) {
        melhor = { meses, semanas, dias: diasAvulsos, total };
      }
    }
  }

  return melhor;
}

export function aplicarDesconto(valor: number, desconto: number) {
  const seguro = Math.max(0, Math.min(desconto, valor));
  return Math.max(0, valor - seguro);
}
