export const COLOR_HEX: Record<string, string> = {
  "Off White": "#F1EADC",
  "Branco": "#FFFFFF",
  "Preto": "#111111",
  "Cinza": "#9C9A94",
  "Marrom": "#6B4A34",
  "Verde Oliva": "#69705A",
  "Bege": "#D9CBB0",
  "Azul Claro": "#A9C4D8",
  "Azul Médio": "#4A6C8C",
  "Champagne": "#E4D3AE",
  "Vinho": "#5C1F2E",
};

export function colorHex(name: string): string {
  return COLOR_HEX[name] ?? "#111111";
}
