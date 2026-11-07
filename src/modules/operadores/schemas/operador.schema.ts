import { z } from "zod";

/**
 * RN-2.1: solo letras (incluidas acentuadas) y espacios simples entre
 * palabras. RN-2.3/RN-2.4: trim y minúsculas antes de validar.
 */
const TEXTO_OPERADOR_REGEX = /^[a-záéíóúüñ]+( [a-záéíóúüñ]+)*$/;

function textoOperador(campo: string) {
  return z
    .string({ error: `El campo ${campo} es obligatorio.` })
    .trim()
    .min(1, { error: `El campo ${campo} es obligatorio.` })
    .toLowerCase()
    .regex(TEXTO_OPERADOR_REGEX, {
      error: `El campo ${campo} solo puede contener letras y espacios simples.`,
    });
}

const camposOperador = {
  nombre: textoOperador("nombre"),
  apellido_paterno: textoOperador("apellido paterno"),
  apellido_materno: textoOperador("apellido materno"),
};

export const operadorSchema = z.object(camposOperador);

export const actualizarOperadorSchema = z.object({
  id: z.uuid({ error: "El identificador del operador no es válido." }),
  ...camposOperador,
});

export const eliminarOperadorSchema = z.object({
  id: z.uuid({ error: "El identificador del operador no es válido." }),
});

export type OperadorInput = z.input<typeof operadorSchema>;
export type OperadorValues = z.output<typeof operadorSchema>;
export type ActualizarOperadorInput = z.input<typeof actualizarOperadorSchema>;
export type ActualizarOperadorValues = z.output<typeof actualizarOperadorSchema>;
export type EliminarOperadorInput = z.input<typeof eliminarOperadorSchema>;
export type EliminarOperadorValues = z.output<typeof eliminarOperadorSchema>;
