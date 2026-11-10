"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireSession } from "@/modules/auth/lib/session";

import { contieneRefrigerado } from "../lib/refrigerado";
import {
  actualizarViajeSchema,
  eliminarViajeSchema,
  viajeSchema,
} from "../schemas/viaje.schema";
import {
  actualizarViaje,
  crearViaje,
  eliminarViaje,
  listarViajes,
} from "../services/viaje.service";
import type {
  EliminarViajeResult,
  Viaje,
  ViajeActionResult,
} from "../types";

const RUTA_BITACORA = "/bitacora";

export async function listarViajesAction(): Promise<Viaje[]> {
  await requireSession();

  return listarViajes();
}

export async function crearViajeAction(
  input: unknown,
): Promise<ViajeActionResult> {
  await requireSession();

  const parsed = viajeSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    const viaje = await crearViaje({
      ...parsed.data,
      numero_tiros: contieneRefrigerado(parsed.data.destino_id)
        ? (parsed.data.numero_tiros ?? null)
        : null,
    });

    revalidatePath(RUTA_BITACORA);

    return {
      status: "success",
      message: "Viaje registrado correctamente.",
      data: viaje,
    };
  } catch (error) {
    console.error("Error al registrar viaje:", error);

    return {
      status: "error",
      message: "No fue posible registrar el viaje. Intenta de nuevo.",
    };
  }
}

export async function actualizarViajeAction(
  input: unknown,
): Promise<ViajeActionResult> {
  await requireSession();

  const parsed = actualizarViajeSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    const viaje = await actualizarViaje({
      ...parsed.data,
      numero_tiros: contieneRefrigerado(parsed.data.destino_id)
        ? (parsed.data.numero_tiros ?? null)
        : null,
    });

    revalidatePath(RUTA_BITACORA);

    return {
      status: "success",
      message: "Viaje actualizado correctamente.",
      data: viaje,
    };
  } catch (error) {
    console.error("Error al actualizar viaje:", error);

    return {
      status: "error",
      message: "No fue posible actualizar el viaje. Intenta de nuevo.",
    };
  }
}

export async function eliminarViajeAction(
  input: unknown,
): Promise<EliminarViajeResult> {
  await requireSession();

  const parsed = eliminarViajeSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "El viaje seleccionado no es válido.",
    };
  }

  try {
    const eliminado = await eliminarViaje(parsed.data);

    revalidatePath(RUTA_BITACORA);

    return {
      status: "success",
      message: "Viaje eliminado correctamente.",
      data: eliminado,
    };
  } catch (error) {
    console.error("Error al eliminar viaje:", error);

    return {
      status: "error",
      message: "No fue posible eliminar el viaje. Intenta de nuevo.",
    };
  }
}
