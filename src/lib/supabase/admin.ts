import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseUrl } from "./config";
import { getSupabaseServiceRoleKey } from "./server-config";

let adminClient: SupabaseClient | undefined;

/**
 * Cliente con `service_role`: omite RLS.
 *
 * Uso exclusivo del servidor y únicamente en las Server Actions del módulo
 * auth (tabla `cuentas`). Nunca debe importarse desde un Client Component.
 */
export function createSupabaseAdminClient(): SupabaseClient {
  if (!adminClient) {
    adminClient = createClient(
      getSupabaseUrl(),
      getSupabaseServiceRoleKey(),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      },
    );
  }

  return adminClient;
}
