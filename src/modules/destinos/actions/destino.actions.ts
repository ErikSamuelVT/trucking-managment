"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireSession } from "@/modules/auth/lib/session";

import {
  actualizarDestinoSchema,
  destinoSchema,
  eliminarDestinoSchema,
} from "../schemas/destino.schema";
import {
  actualizarDestino,
  crearDestino,
  eliminarDestino,
  existeDestino,
  listarDestinos,
} from "../services/destino.service";
import type {
  Destino,
  DestinoActionResult,
  EliminarDestinoResult,
} from "../types";

const RUTA_DESTINOS = "/destinos";

export async function listarDestinosAction(): Promise<Destino[]> {
  await requireSession();

  return listarDestinos();
}

export async function crearDestinoAction(
  input: unknown,
): Promise<DestinoActionResult> {
  await requireSession();

  const parsed = destinoSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    if (await existeDestino(parsed.data.destino)) {
      return {
        status: "error",
        message: "Ya existe un destino registrado con ese nombre.",
        fieldErrors: {
          destino: ["Ya existe un destino registrado con ese nombre."],
        },
      };
    }

    const destino = await crearDestino(parsed.data);

    revalidatePath(RUTA_DESTINOS);

    return {
      status: "success",
      message: "Destino registrado correctamente.",
      data: destino,
    };
  } catch (error) {
    console.error("Error al registrar destino:", error);

    return {
      status: "error",
      message: "No fue posible registrar el destino. Intenta de nuevo.",
    };
  }
}

export async function actualizarDestinoAction(
  input: unknown,
): Promise<DestinoActionResult> {
  await requireSession();

  const parsed = actualizarDestinoSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    if (await existeDestino(parsed.data.destino, parsed.data.id)) {
      return {
        status: "error",
        message: "Ya existe otro destino registrado con ese nombre.",
        fieldErrors: {
          destino: ["Ya existe otro destino registrado con ese nombre."],
        },
      };
    }

    const destino = await actualizarDestino(parsed.data);

    revalidatePath(RUTA_DESTINOS);

    return {
      status: "success",
      message: "Destino actualizado correctamente.",
      data: destino,
    };
  } catch (error) {
    console.error("Error al actualizar destino:", error);

    return {
      status: "error",
      message: "No fue posible actualizar el destino. Intenta de nuevo.",
    };
  }
}

export async function eliminarDestinoAction(
  input: unknown,
): Promise<EliminarDestinoResult> {
  await requireSession();

  const parsed = eliminarDestinoSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "El destino seleccionado no es válido.",
    };
  }

  try {
    const eliminado = await eliminarDestino(parsed.data);

    revalidatePath(RUTA_DESTINOS);

    return {
      status: "success",
      message: "Destino eliminado correctamente.",
      data: eliminado,
    };
  } catch (error) {
    console.error("Error al eliminar destino:", error);

    return {
      status: "error",
      message: "No fue posible eliminar el destino. Intenta de nuevo.",
    };
  }
}
