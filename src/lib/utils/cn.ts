export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[];

/**
 * Une clases condicionales descartando valores vacíos.
 * No resuelve conflictos entre utilidades de Tailwind: el orden de las
 * clases en el arreglo determina la precedencia.
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) {
      continue;
    }

    if (Array.isArray(input)) {
      const nested = cn(...input);

      if (nested) {
        classes.push(nested);
      }

      continue;
    }

    classes.push(String(input));
  }

  return classes.join(" ");
}
