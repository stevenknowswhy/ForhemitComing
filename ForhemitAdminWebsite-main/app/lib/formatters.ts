export function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length === 0) return "";
  
  if (numbers.length === 11 && numbers.startsWith("1")) {
    return `+1 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 11)}`;
  }
  
  // Generic international fallback for other lengths
  if (numbers.length > 10) {
    if (value.startsWith("+")) return value; // keep original + representation
    return `+${numbers}`;
  }

  if (numbers.length <= 3) return `(${numbers}`;
  if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
}
