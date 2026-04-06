export function fmtCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function calcStewardshipFee(ebitdaStr: string) {
  const ebitda = parseFloat(ebitdaStr) || 0;
  if (ebitda <= 0) {
    return { annual: 0, quarterly: 0, t1: 0, t2: 0, t3: 0, t4: 0, ebitda: 0 };
  }
  const annual = ebitda * 0.025;
  return {
    ebitda,
    annual,
    quarterly: annual / 4,
    t1: annual * 0.6,
    t2: annual * 0.2,
    t3: annual * 0.1,
    t4: annual * 0.1,
  };
}
