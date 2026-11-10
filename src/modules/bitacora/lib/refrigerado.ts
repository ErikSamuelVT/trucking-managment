/**
 * Normaliza un texto para comparaciones sin distinguir mayúsculas ni
 * acentos (equivalente funcional a `lower(unaccent(...))`).
 */
export function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * RN-5.3: un destino requiere tiros cuando su nombre contiene la palabra
 * "refrigerado" en cualquier posición, sin distinguir mayúsculas ni acentos.
 */
export function contieneRefrigerado(destino: string): boolean {
  return normalizarTexto(destino).includes("refrigerado");
}
