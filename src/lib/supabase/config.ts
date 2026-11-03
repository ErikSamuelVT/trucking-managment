export function getSupabaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!value) {
    throw new Error(
      "Falta NEXT_PUBLIC_SUPABASE_URL. Copia .env.local.example a .env.local y completa las credenciales.",
    );
  }

  return value;
}

export function getSupabaseAnonKey(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!value) {
    throw new Error(
      "Falta NEXT_PUBLIC_SUPABASE_ANON_KEY. Copia .env.local.example a .env.local y completa las credenciales.",
    );
  }

  return value;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
}
