import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { getSupabaseAnonKey, getSupabaseUrl } from "./config";
import { getSessionAccessToken } from "@/modules/auth/lib/session";

/**
 * Cliente de Supabase para Server Components, Server Actions y Route Handlers
 * que no necesitan el JWT propio (por ejemplo, operaciones anónimas).
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient> {
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
          // sesión corresponde al proxy de autenticación.
        }
      },
    },
  });
}

/**
 * Cliente de servidor con el JWT propio de la cookie `tc_session`.
 * PostgREST y RLS reciben el rol `authenticated`. Úsalo después de
 * `requireSession()` en Server Components y Server Actions del dashboard.
 *
 * Se usa `createClient` de `@supabase/supabase-js` con el header
 * Authorization directo: `@supabase/ssr` no admite la opción `accessToken`
 * junto con su adaptador de cookies.
 */
export async function createSupabaseSessionClient(): Promise<SupabaseClient> {
  const accessToken = await getSessionAccessToken();

  if (!accessToken) {
    return createSupabaseServerClient();
  }

  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
