import { z } from "zod";

/**
 * RN-4.1/RN-4.3: solo letras con acentos y espacios simples entre
 * palabras. RN-4.5: trim y minúsculas antes de validar.
 */
const TEXTO_DESTINO_REGEX = /^[a-záéíóúüñ]+( [a-záéíóúüñ]+)*$/;

const camposDestino = {
  destino: z
    .string({ error: "El campo destino es obligatorio." })
    .trim()
    .min(1, { error: "El campo destino es obligatorio." })
    .toLowerCase()
    .regex(TEXTO_DESTINO_REGEX, {
      error:
        "El destino solo puede contener letras, acentos y espacios simples entre palabras.",
    }),
  km: z
    .number({ error: "El campo km es obligatorio." })
    .finite({ error: "El campo km debe ser un número válido." })
    .positive({ error: "Los kilómetros deben ser mayores que cero." }),
};

export const destinoSchema = z.object(camposDestino);

export const actualizarDestinoSchema = z.object({
  id: z.uuid({ error: "El identificador del destino no es válido." }),
  ...camposDestino,
});

export const eliminarDestinoSchema = z.object({
  id: z.uuid({ error: "El identificador del destino no es válido." }),
});

export type DestinoInput = z.input<typeof destinoSchema>;
export type DestinoValues = z.output<typeof destinoSchema>;
export type ActualizarDestinoInput = z.input<typeof actualizarDestinoSchema>;
export type ActualizarDestinoValues = z.output<typeof actualizarDestinoSchema>;
export type EliminarDestinoInput = z.input<typeof eliminarDestinoSchema>;
export type EliminarDestinoValues = z.output<typeof eliminarDestinoSchema>;
