import "server-only";

import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { getSupabaseAnonKey, getSupabaseUrl } from "./config";
import { getSessionAccessToken } from "@/modules/auth/lib/session";

/**
 * Cliente de Supabase para Server Components, Server Actions y Route Handlers.
 *
 * Cuando exista una sesión propia, pásale el JWT para que PostgREST y RLS lo
 * traten como rol `authenticated`.
 */
export async function createSupabaseServerClient(
  accessToken?: string,
): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Un Server Component no puede escribir cookies. El refresco de
          // sesión corresponde al middleware/proxy de la fase de autenticación.
        }
      },
    },
    ...(accessToken ? { accessToken: async () => accessToken } : {}),
  });
}

/**
 * Cliente de servidor con el JWT propio de la cookie `tc_session`.
 * PostgREST y RLS reciben el rol `authenticated`. Úsalo después de
 * `requireSession()` en Server Components y Server Actions del dashboard.
 */
export async function createSupabaseSessionClient(): Promise<SupabaseClient> {
  const accessToken = await getSessionAccessToken();

  return createSupabaseServerClient(accessToken ?? undefined);
}
