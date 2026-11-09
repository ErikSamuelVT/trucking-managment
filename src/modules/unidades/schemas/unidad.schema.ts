import { z } from "zod";

/**
 * RN-3.1/RN-3.3: textos alfanuméricos obligatorios. RN-3.5: trim y
 * minúsculas antes de validar. RN-3.2: NIV de exactamente 17 caracteres.
 */
const TEXTO_ALFANUMERICO_REGEX = /^[a-z0-9]+$/;
const NIV_REGEX = /^[a-z0-9]{17}$/;

function textoAlfanumerico(campo: string) {
  return z
    .string({ error: `El campo ${campo} es obligatorio.` })
    .trim()
    .min(1, { error: `El campo ${campo} es obligatorio.` })
    .toLowerCase()
    .regex(TEXTO_ALFANUMERICO_REGEX, {
      error: `El campo ${campo} solo puede contener letras y números.`,
    });
}

const camposUnidad = {
  placas: textoAlfanumerico("placas"),
  marca: z
    .string({ error: "Selecciona una marca válida." })
    .trim()
    .toLowerCase()
    .pipe(
      z.enum(["freightliner", "international", "chevrolet"], {
        error: "Selecciona una marca válida.",
      }),
    ),
  modelo: z
    .number({ error: "El campo modelo es obligatorio." })
    .int({ error: "El modelo debe ser un año entero." })
    .min(1950, { error: "El modelo debe estar entre 1950 y 2100." })
    .max(2100, { error: "El modelo debe estar entre 1950 y 2100." }),
  no_motor: textoAlfanumerico("número de motor"),
  niv: z
    .string({ error: "El campo NIV es obligatorio." })
    .trim()
    .min(1, { error: "El campo NIV es obligatorio." })
    .toLowerCase()
    .regex(NIV_REGEX, {
      error: "El NIV debe tener exactamente 17 caracteres alfanuméricos.",
    }),
};

export const unidadSchema = z.object(camposUnidad);

export const actualizarUnidadSchema = z.object({
  id: z.uuid({ error: "El identificador de la unidad no es válido." }),
  ...camposUnidad,
});

export const eliminarUnidadSchema = z.object({
  id: z.uuid({ error: "El identificador de la unidad no es válido." }),
});

export type UnidadInput = z.input<typeof unidadSchema>;
export type UnidadValues = z.output<typeof unidadSchema>;
export type ActualizarUnidadInput = z.input<typeof actualizarUnidadSchema>;
export type ActualizarUnidadValues = z.output<typeof actualizarUnidadSchema>;
export type EliminarUnidadInput = z.input<typeof eliminarUnidadSchema>;
export type EliminarUnidadValues = z.output<typeof eliminarUnidadSchema>;
