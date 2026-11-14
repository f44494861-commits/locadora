import { describe, expect, it } from "vitest";
import {
  periodosSobrepoem,
  temSaldoSuficiente,
  unidadeLivreNoPeriodo,
} from "./availability";

const d = (iso: string) => new Date(iso);

describe("periodosSobrepoem", () => {
  it("detecta sobreposição", () => {
    expect(
      periodosSobrepoem(
        { inicio: d("2026-01-01"), fim: d("2026-01-10") },
        { inicio: d("2026-01-05"), fim: d("2026-01-15") }
      )
    ).toBe(true);
  });

  it("não sobrepõe períodos adjacentes sem cruzar", () => {
    expect(
      periodosSobrepoem(
        { inicio: d("2026-01-01"), fim: d("2026-01-05") },
        { inicio: d("2026-01-06"), fim: d("2026-01-10") }
      )
    ).toBe(false);
  });
});

describe("unidadeLivreNoPeriodo", () => {
  it("bloqueia conflito", () => {
    const livre = unidadeLivreNoPeriodo(
      [{ inicio: d("2026-01-01"), fim: d("2026-01-10") }],
      { inicio: d("2026-01-08"), fim: d("2026-01-12") }
    );
    expect(livre).toBe(false);
  });
});

describe("temSaldoSuficiente", () => {
  it("considera manutenção e ocupações sobrepostas", () => {
    const ok = temSaldoSuficiente(
      [
        {
          inicio: d("2026-01-01"),
          fim: d("2026-01-10"),
          quantidade: 30,
        },
      ],
      { inicio: d("2026-01-05"), fim: d("2026-01-08") },
      20,
      50,
      5
    );
    // capacidade = 45, ocupado = 30, disponível = 15 < 20
    expect(ok).toBe(false);
  });
});
