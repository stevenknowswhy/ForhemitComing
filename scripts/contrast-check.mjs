// WCAG 2.x contrast computation for the migrated token pairings.
// Values sourced from the token definitions this PR ships:
//   tokens.css  — ladder/accent/body-ink/focus roles
//   globals.css — manuscript palette (--canvas, --parchment, --ink, --stone)
//   theme.css   — --color-brand #BC3E0A, --color-error #dc2626 (status tokens)
function lum(hex) {
  const c = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
  const f = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(fg, bg) {
  const [l1, l2] = [lum(fg), lum(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}
// alpha blend of fg over bg (for the chip's tinted background)
function blend(fg, bg, alpha) {
  const p = (h) => h.replace("#", "").match(/../g).map((x) => parseInt(x, 16));
  const [fr, fgc, fb] = p(fg), [br, bgc, bb] = p(bg);
  const m = (v1, v2) => Math.round(alpha * v1 + (1 - alpha) * v2).toString(16).padStart(2, "0");
  return `#${m(fr, br)}${m(fgc, bgc)}${m(fb, bb)}`;
}

const canvas = "#F9F7F2", parchment = "#F0EBE3", ink = "#1A1A1A";
const rows = [
  ["CTA primary: canvas on ink (Enter invitation code / Continue to site)", canvas, ink, "4.5:1 text"],
  ["CTA primary hover: canvas on lifted ink #2E2E2E", canvas, "#2E2E2E", "4.5:1 text"],
  ["Accent eyebrow: #BC3E0A on canvas (COMING SOON kicker)", "#BC3E0A", canvas, "4.5:1 text"],
  ["Accent eyebrow: #BC3E0A on parchment", "#BC3E0A", parchment, "4.5:1 text"],
  ["Body ink: #5A5A5A on canvas (contact footnote)", "#5A5A5A", canvas, "4.5:1 text"],
  ["Body ink: #5A5A5A on parchment", "#5A5A5A", parchment, "4.5:1 text"],
  ["Focus ring: ink on canvas (non-text)", ink, canvas, "3:1 non-text"],
  ["Focus ring: ink on parchment (non-text)", ink, parchment, "3:1 non-text"],
  ["Input focus border: ink on canvas (non-text)", ink, canvas, "3:1 non-text"],
  ["Error text: #dc2626 on canvas (Invalid invitation code)", "#dc2626", canvas, "4.5:1 text"],
  ["Chip: #BC3E0A on 10% accent over canvas", "#BC3E0A", blend("#FF6B00", canvas, 0.1), "4.5:1 text"],
];

console.log(`${"pairing".padEnd(70)} ratio     bar       pass`);
for (const [label, fg, bg, bar] of rows) {
  const r = ratio(fg, bg);
  const min = parseFloat(bar.split(" ")[0]);
  console.log(`${label.padEnd(70)} ${r.toFixed(2).padStart(5)}:1  ${bar.padEnd(9)} ${r >= min ? "PASS" : "FAIL"}`);
}
