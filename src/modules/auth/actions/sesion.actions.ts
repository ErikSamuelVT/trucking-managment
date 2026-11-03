"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

import { verifyPassword } from "../lib/hash";
import {
  clearSessionCookie,
  createSession,
} from "../lib/session";
import { loginSchema } from "../schemas/cuenta.schema";
import type { AuthActionResult } from "../types";

const MENSAJE_CREDENCIALES_INVALIDAS = "Usuario o contraseña incorrectos.";

export async function iniciarSesion(
  input: unknown,
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);

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

    const { data: cuenta, error } = await admin
      .from("cuentas")
      .select("id, contrasena_hash")
      .eq("usuario", usuario)
      .maybeSingle<{ id: string; contrasena_hash: string }>();

    if (error) {
      console.error(
        "Error al buscar cuenta para iniciar sesión:",
        error.code,
        error.message,
      );

      return {
        status: "error",
        message: "No fue posible iniciar sesión. Intenta de nuevo.",
      };
    }

    if (!cuenta) {
      return {
        status: "error",
        message: MENSAJE_CREDENCIALES_INVALIDAS,
      };
    }

    const contrasenaValida = await verifyPassword(
      contrasena,
      cuenta.contrasena_hash,
    );

    if (!contrasenaValida) {
      return {
        status: "error",
        message: MENSAJE_CREDENCIALES_INVALIDAS,
      };
    }

    await createSession(cuenta.id);

    return {
      status: "success",
      message: "Sesión iniciada correctamente.",
    };
  } catch (error) {
    console.error("Error inesperado al iniciar sesión:", error);

    return {
      status: "error",
      message: "No fue posible iniciar sesión. Intenta de nuevo.",
    };
  }
}

export async function cerrarSesion(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}
