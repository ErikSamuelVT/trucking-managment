"use client";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "./client";

/**
 * Obtiene el JWT de la sesión propia desde `/api/sesion/token` y lo aplica
 * al cliente de Realtime. El hook de Realtime de la Fase 2 lo invocará al
 * inicializar y tras una reconexión.
 */
export async function applyRealtimeSession(
  client: SupabaseClient = createSupabaseBrowserClient(),
): Promise<boolean> {
  const response = await fetch("/api/sesion/token", {
    cache: "no-store",
    credentials: "same-origin",
  });

  if (!response.ok) {
    return false;
  }

  const body: unknown = await response.json();

  if (
    typeof body !== "object" ||
    body === null ||
    !("token" in body) ||
    typeof body.token !== "string"
  ) {
    return false;
  }

  await client.realtime.setAuth(body.token);

  return true;
}
