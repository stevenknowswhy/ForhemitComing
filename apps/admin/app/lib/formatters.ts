export function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length === 0) return "";

  // Truncate to 10 digits for US formatting
  const truncated = numbers.slice(0, 10);

  if (truncated.length <= 3) return `(${truncated}`;
  if (truncated.length <= 6) return `(${truncated.slice(0, 3)}) ${truncated.slice(3)}`;
  return `(${truncated.slice(0, 3)}) ${truncated.slice(3, 6)}-${truncated.slice(6, 10)}`;
}
