-- ============================================================
-- 0002_cuentas.sql
-- Tabla nativa de autenticación propia (sin Supabase Auth ni correo).
--
-- Autocontenida a propósito: crea la tabla, su normalización, el trigger de
-- actualizado_en y habilita RLS desde el primer momento. Las migraciones
-- 0009/0010 de fases posteriores reutilizarán set_actualizado_en() y
-- añadirán las políticas del resto de tablas.
-- ============================================================

create table public.cuentas (
  id uuid primary key default gen_random_uuid(),
  usuario text not null,
  contrasena_hash text not null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),

  -- Debe evaluarse después del trigger de normalización (BEFORE INSERT/UPDATE).
  constraint cuentas_usuario_longitud
    check (char_length(usuario) >= 6),
  constraint cuentas_usuario_formato
    check (usuario ~ '^[a-z0-9áéíóúüñ]+$'),

  -- bcrypt produce hashes de 60 caracteres; se exige un mínimo defensivo y
  -- que el valor no contenga espacios.
  constraint cuentas_hash_longitud
    check (char_length(contrasena_hash) >= 50),
  constraint cuentas_hash_sin_espacios
    check (contrasena_hash !~ '\s')
);

-- Unicidad global sin distinguir mayúsculas. El trigger ya normaliza a
-- minúsculas, pero el índice protege ante escrituras directas.
create unique index cuentas_usuario_lower_idx
  on public.cuentas (lower(usuario));

-- ------------------------------------------------------------
-- Normalización de usuario: trim + minúsculas.
-- Nunca se aplica sobre contrasena_hash.
-- ------------------------------------------------------------
create or replace function public.fn_normalizar_cuenta()
returns trigger
language plpgsql
as $$
begin
  new.usuario := lower(btrim(new.usuario));
  return new;
end;
$$;

-- ------------------------------------------------------------
-- Trigger compartido de actualización. La migración 0009 lo
-- reutilizará para los catálogos y la bitácora.
-- ------------------------------------------------------------
create or replace function public.set_actualizado_en()
returns trigger
language plpgsql
as $$
begin
  new.actualizado_en := now();
  return new;
end;
$$;

drop trigger if exists cuentas_normalizar_usuario on public.cuentas;
create trigger cuentas_normalizar_usuario
  before insert or update of usuario on public.cuentas
  for each row
  execute function public.fn_normalizar_cuenta();

drop trigger if exists cuentas_set_actualizado_en on public.cuentas;
create trigger cuentas_set_actualizado_en
  before update on public.cuentas
  for each row
  execute function public.set_actualizado_en();

-- ------------------------------------------------------------
-- RLS habilitado sin políticas: solo service_role (servidor) puede
-- leer o escribir. El navegador nunca consulta esta tabla.
-- ------------------------------------------------------------
alter table public.cuentas enable row level security;

revoke all on table public.cuentas from anon, authenticated;

comment on table public.cuentas is
  'Cuentas de autenticación propia. Acceso exclusivo del servidor con service_role.';
