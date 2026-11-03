import "server-only";

export function getSupabaseServiceRoleKey(): string {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!value) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY. Esta clave solo puede existir en el servidor (.env.local).",
    );
  }

  return value;
}

export function getSupabaseJwtSecret(): string {
  const value = process.env.SUPABASE_JWT_SECRET?.trim();

  if (!value) {
    throw new Error(
      "Falta SUPABASE_JWT_SECRET. Copia .env.local.example a .env.local y completa las credenciales.",
    );
  }

  return value;
}
