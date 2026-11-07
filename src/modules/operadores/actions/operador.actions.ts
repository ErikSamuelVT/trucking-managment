"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireSession } from "@/modules/auth/lib/session";

import {
  actualizarOperadorSchema,
  eliminarOperadorSchema,
  operadorSchema,
} from "../schemas/operador.schema";
import {
  actualizarOperador,
  crearOperador,
  eliminarOperador,
  listarOperadores,
} from "../services/operador.service";
import type {
  EliminarOperadorResult,
  Operador,
  OperadorActionResult,
} from "../types";

const RUTA_OPERADORES = "/operadores";

export async function listarOperadoresAction(): Promise<Operador[]> {
  await requireSession();

  return listarOperadores();
}

export async function crearOperadorAction(
  input: unknown,
): Promise<OperadorActionResult> {
  await requireSession();

  const parsed = operadorSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    const operador = await crearOperador(parsed.data);

    revalidatePath(RUTA_OPERADORES);

    return {
      status: "success",
      message: "Operador registrado correctamente.",
      data: operador,
    };
  } catch (error) {
    console.error("Error al registrar operador:", error);

    return {
      status: "error",
      message: "No fue posible registrar el operador. Intenta de nuevo.",
    };
  }
}

export async function actualizarOperadorAction(
  input: unknown,
): Promise<OperadorActionResult> {
  await requireSession();

  const parsed = actualizarOperadorSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    const operador = await actualizarOperador(parsed.data);

    revalidatePath(RUTA_OPERADORES);

    return {
      status: "success",
      message: "Operador actualizado correctamente.",
      data: operador,
    };
  } catch (error) {
    console.error("Error al actualizar operador:", error);

    return {
      status: "error",
      message: "No fue posible actualizar el operador. Intenta de nuevo.",
    };
  }
}

export async function eliminarOperadorAction(
  input: unknown,
): Promise<EliminarOperadorResult> {
  await requireSession();

  const parsed = eliminarOperadorSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "El operador seleccionado no es válido.",
    };
  }

  try {
    const eliminado = await eliminarOperador(parsed.data);

    revalidatePath(RUTA_OPERADORES);

    return {
      status: "success",
      message: "Operador eliminado correctamente.",
      data: eliminado,
    };
  } catch (error) {
    console.error("Error al eliminar operador:", error);

    return {
      status: "error",
      message: "No fue posible eliminar el operador. Intenta de nuevo.",
    };
  }
}
