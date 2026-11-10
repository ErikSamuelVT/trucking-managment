import { z } from "zod";

import { contieneRefrigerado } from "../lib/refrigerado";

const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function esFechaValida(valor: string): boolean {
  if (!FECHA_REGEX.test(valor)) {
    return false;
  }

  const [anio, mes, dia] = valor.split("-").map(Number);
  const fecha = new Date(anio, mes - 1, dia);

  return (
    fecha.getFullYear() === anio &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia
  );
}

const camposViaje = {
  fecha: z
    .string({ error: "La fecha es obligatoria." })
    .trim()
    .min(1, { error: "La fecha es obligatoria." })
    .refine(esFechaValida, { error: "Selecciona una fecha válida." }),
  operador_id: z
    .string({ error: "Selecciona un operador." })
    .trim()
    .min(1, { error: "Selecciona un operador." }),
  unidad_id: z
    .string({ error: "Selecciona una unidad." })
    .trim()
    .min(1, { error: "Selecciona una unidad." }),
  destino_id: z
    .string({ error: "Selecciona un destino." })
    .trim()
    .min(1, { error: "Selecciona un destino." }),
  numero_tiros: z
    .number({ error: "El número de tiros es obligatorio." })
    .int({ error: "El número de tiros debe ser un entero." })
    .positive({ error: "El número de tiros debe ser mayor que cero." })
    .nullable()
    .optional(),
};

function validarTiros(
  data: { destino_id: string; numero_tiros?: number | null },
  ctx: z.RefinementCtx,
): void {
  if (
    contieneRefrigerado(data.destino_id) &&
    (data.numero_tiros == null || data.numero_tiros <= 0)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["numero_tiros"],
      message: "El número de tiros es obligatorio para destinos refrigerados.",
    });
  }
}

export const viajeSchema = z
  .object(camposViaje)
  .superRefine(validarTiros);

export const actualizarViajeSchema = z
  .object({
    id: z.uuid({ error: "El identificador del viaje no es válido." }),
    ...camposViaje,
  })
  .superRefine(validarTiros);

export const eliminarViajeSchema = z.object({
  id: z.uuid({ error: "El identificador del viaje no es válido." }),
});

export type ViajeInput = z.input<typeof viajeSchema>;
export type ViajeValues = z.output<typeof viajeSchema>;
export type ActualizarViajeInput = z.input<typeof actualizarViajeSchema>;
export type ActualizarViajeValues = z.output<typeof actualizarViajeSchema>;
export type EliminarViajeInput = z.input<typeof eliminarViajeSchema>;
export type EliminarViajeValues = z.output<typeof eliminarViajeSchema>;
