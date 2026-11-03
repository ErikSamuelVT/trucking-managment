"use server";

import { z } from "zod";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import { hashPassword } from "../lib/hash";
import { registroSchema } from "../schemas/cuenta.schema";
import type { AuthActionResult } from "../types";

export async function registrarCuenta(
  input: unknown,
): Promise<AuthActionResult> {
  const parsed = registroSchema.safeParse(input);

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

    const { data: existente, error: consultaError } = await admin
      .from("cuentas")
      .select("id")
      .eq("usuario", usuario)
      .maybeSingle<{ id: string }>();

    if (consultaError) {
      console.error(
        "Error al verificar usuario duplicado:",
        consultaError.code,
        consultaError.message,
      );

      return {
        status: "error",
        message: "No fue posible registrar la cuenta. Intenta de nuevo.",
      };
    }

    if (existente) {
      return {
        status: "error",
        message: "El usuario ya está registrado.",
        fieldErrors: { usuario: ["El usuario ya está registrado."] },
      };
    }

    const contrasenaHash = await hashPassword(contrasena);

    const { error: insertError } = await admin.from("cuentas").insert({
      usuario,
      contrasena_hash: contrasenaHash,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        return {
          status: "error",
          message: "El usuario ya está registrado.",
          fieldErrors: { usuario: ["El usuario ya está registrado."] },
        };
      }

      console.error(
        "Error al registrar cuenta:",
        insertError.code,
        insertError.message,
      );

      return {
        status: "error",
        message: "No fue posible registrar la cuenta. Intenta de nuevo.",
      };
    }

    return {
      status: "success",
      message: "Registro exitoso. Ahora puedes iniciar sesión.",
    };
  } catch (error) {
    console.error("Error inesperado al registrar cuenta:", error);

    return {
      status: "error",
      message: "No fue posible registrar la cuenta. Intenta de nuevo.",
    };
  }
}
