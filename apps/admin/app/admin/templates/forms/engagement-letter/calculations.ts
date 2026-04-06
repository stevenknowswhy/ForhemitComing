export function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function calcFee(evStr: string): { label: string; fee: string; tier: 1 | 2 | 3 | 0 } {
  const ev = parseFloat(evStr) || 0;
  if (ev <= 0) return { label: "Enter EV above", fee: "—", tier: 0 };
  if (ev < 8_000_000) return { label: `EV of ${fmt(ev)} falls in the under-$8M tier.`, fee: "$25,000", tier: 1 };
  if (ev <= 12_000_000) return { label: `EV of ${fmt(ev)} falls in the $8M–$12M tier.`, fee: "$35,000", tier: 2 };
  return { label: `EV of ${fmt(ev)} falls in the above-$12M tier.`, fee: "$45,000", tier: 3 };
}
