"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAnonKey, getSupabaseUrl } from "./config";

let browserClient: SupabaseClient | undefined;

/**
 * Cliente de navegador único para evitar múltiples conexiones WebSocket de
 * Realtime. El JWT propio se aplicará con `realtime.setAuth(token)` en la
 * fase de autenticación.
 */
export function createSupabaseBrowserClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createBrowserClient(
      getSupabaseUrl(),
      getSupabaseAnonKey(),
    );
  }

  return browserClient;
}
