import { describe, expect, it } from "vitest";
import { aplicarDesconto, calcularMelhorPreco } from "./pricing";

describe("calcularMelhorPreco", () => {
  it("usa só diárias para períodos curtos", () => {
    const result = calcularMelhorPreco({
      dias: 3,
      valorDiaria: 100,
      valorSemana: 500,
      valorMes: 1500,
    });
    expect(result).toEqual({ meses: 0, semanas: 0, dias: 3, total: 300 });
  });

  it("escolhe semana quando for mais barato que 7 diárias", () => {
    const result = calcularMelhorPreco({
      dias: 7,
      valorDiaria: 100,
      valorSemana: 500,
      valorMes: 1500,
    });
    expect(result.semanas).toBe(1);
    expect(result.dias).toBe(0);
    expect(result.total).toBe(500);
  });

  it("combina mês + dias", () => {
    const result = calcularMelhorPreco({
      dias: 32,
      valorDiaria: 100,
      valorSemana: 500,
      valorMes: 1500,
    });
    expect(result.meses).toBe(1);
    expect(result.total).toBeLessThanOrEqual(32 * 100);
  });
});

describe("aplicarDesconto", () => {
  it("não permite desconto maior que o valor", () => {
    expect(aplicarDesconto(100, 150)).toBe(0);
  });
});
