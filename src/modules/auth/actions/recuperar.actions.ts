"use server";

import { z } from "zod";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import { hashPassword } from "../lib/hash";
import {
  recuperarUsuarioSchema,
  restablecerContrasenaSchema,
} from "../schemas/cuenta.schema";
import type { AuthActionResult } from "../types";

const MENSAJE_USUARIO_NO_REGISTRADO = "El usuario no está registrado.";

export async function verificarUsuario(
  input: unknown,
): Promise<AuthActionResult> {
  const parsed = recuperarUsuarioSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa el campo marcado.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { usuario } = parsed.data;

  try {
    const admin = createSupabaseAdminClient();

    const { data, error } = await admin
      .from("cuentas")
      .select("id")
      .eq("usuario", usuario)
      .maybeSingle<{ id: string }>();

    if (error) {
      console.error(
        "Error al verificar usuario para recuperación:",
        error.code,
        error.message,
      );

      return {
        status: "error",
        message: "No fue posible verificar el usuario. Intenta de nuevo.",
      };
    }

    if (!data) {
      return {
        status: "error",
        message: MENSAJE_USUARIO_NO_REGISTRADO,
        fieldErrors: { usuario: [MENSAJE_USUARIO_NO_REGISTRADO] },
      };
    }

    return {
      status: "success",
      message: "Usuario verificado. Ingresa tu nueva contraseña.",
      data: { usuario, existe: true },
    };
  } catch (error) {
    console.error("Error inesperado al verificar usuario:", error);

    return {
      status: "error",
      message: "No fue posible verificar el usuario. Intenta de nuevo.",
    };
  }
}

export async function restablecerContrasena(
  input: unknown,
): Promise<AuthActionResult> {
  const parsed = restablecerContrasenaSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { usuario, contrasena } = parsed.data;

  try {
    const admin = createSupabaseAdminClient();
    const contrasenaHash = await hashPassword(contrasena);

    const { data, error } = await admin
      .from("cuentas")
      .update({ contrasena_hash: contrasenaHash })
      .eq("usuario", usuario)
      .select("id")
      .maybeSingle<{ id: string }>();

    if (error) {
      console.error(
        "Error al restablecer contraseña:",
        error.code,
        error.message,
      );

      return {
        status: "error",
        message: "No fue posible actualizar la contraseña. Intenta de nuevo.",
      };
    }

    if (!data) {
      return {
        status: "error",
        message: MENSAJE_USUARIO_NO_REGISTRADO,
        fieldErrors: { usuario: [MENSAJE_USUARIO_NO_REGISTRADO] },
      };
    }

    return {
      status: "success",
      message: "Contraseña actualizada correctamente.",
    };
  } catch (error) {
    console.error("Error inesperado al restablecer contraseña:", error);

    return {
      status: "error",
      message: "No fue posible actualizar la contraseña. Intenta de nuevo.",
    };
  }
}
