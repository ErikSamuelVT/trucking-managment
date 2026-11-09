"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireSession } from "@/modules/auth/lib/session";

import {
  actualizarUnidadSchema,
  eliminarUnidadSchema,
  unidadSchema,
} from "../schemas/unidad.schema";
import {
  actualizarUnidad,
  crearUnidad,
  eliminarUnidad,
  existePlaca,
  listarUnidades,
} from "../services/unidad.service";
import type {
  EliminarUnidadResult,
  Unidad,
  UnidadActionResult,
} from "../types";

const RUTA_UNIDADES = "/unidades";

export async function listarUnidadesAction(): Promise<Unidad[]> {
  await requireSession();

  return listarUnidades();
}

export async function crearUnidadAction(
  input: unknown,
): Promise<UnidadActionResult> {
  await requireSession();

  const parsed = unidadSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    if (await existePlaca(parsed.data.placas)) {
      return {
        status: "error",
        message: "Ya existe una unidad registrada con esas placas.",
        fieldErrors: {
          placas: ["Ya existe una unidad registrada con esas placas."],
        },
      };
    }

    const unidad = await crearUnidad(parsed.data);

    revalidatePath(RUTA_UNIDADES);

    return {
      status: "success",
      message: "Unidad registrada correctamente.",
      data: unidad,
    };
  } catch (error) {
    console.error("Error al registrar unidad:", error);

    return {
      status: "error",
      message: "No fue posible registrar la unidad. Intenta de nuevo.",
    };
  }
}

export async function actualizarUnidadAction(
  input: unknown,
): Promise<UnidadActionResult> {
  await requireSession();

  const parsed = actualizarUnidadSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    if (await existePlaca(parsed.data.placas, parsed.data.id)) {
      return {
        status: "error",
        message: "Ya existe otra unidad registrada con esas placas.",
        fieldErrors: {
          placas: ["Ya existe otra unidad registrada con esas placas."],
        },
      };
    }

    const unidad = await actualizarUnidad(parsed.data);

    revalidatePath(RUTA_UNIDADES);

    return {
      status: "success",
      message: "Unidad actualizada correctamente.",
      data: unidad,
    };
  } catch (error) {
    console.error("Error al actualizar unidad:", error);

    return {
      status: "error",
      message: "No fue posible actualizar la unidad. Intenta de nuevo.",
    };
  }
}

export async function eliminarUnidadAction(
  input: unknown,
): Promise<EliminarUnidadResult> {
  await requireSession();

  const parsed = eliminarUnidadSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "La unidad seleccionada no es válida.",
    };
  }

  try {
    const eliminado = await eliminarUnidad(parsed.data);

    revalidatePath(RUTA_UNIDADES);

    return {
      status: "success",
      message: "Unidad eliminada correctamente.",
      data: eliminado,
    };
  } catch (error) {
    console.error("Error al eliminar unidad:", error);

    return {
      status: "error",
      message: "No fue posible eliminar la unidad. Intenta de nuevo.",
    };
  }
}
