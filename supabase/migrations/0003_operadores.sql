-- ============================================================
-- 0003_operadores.sql
-- Catálogo de operadores de la flotilla.
--
-- Autocontenida: crea la tabla, normaliza los textos (trim + lower),
-- reutiliza set_actualizado_en() de 0002 y habilita RLS para que solo
-- el rol authenticated pueda operar el catálogo.
--
-- El borrado es lógico: la aplicación solo ejecuta UPDATE activo = false.
-- ============================================================

create table public.operadores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido_paterno text not null,
  apellido_materno text not null,
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),

  -- RN-2.1: solo letras (incluidas acentuadas) y espacios simples entre
  -- palabras. Se evalúa después del trigger de normalización.
  constraint operadores_nombre_formato
    check (nombre ~ '^[a-záéíóúüñ]+( [a-záéíóúüñ]+)*$'),
  constraint operadores_apellido_paterno_formato
    check (apellido_paterno ~ '^[a-záéíóúüñ]+( [a-záéíóúüñ]+)*$'),
  constraint operadores_apellido_materno_formato
    check (apellido_materno ~ '^[a-záéíóúüñ]+( [a-záéíóúüñ]+)*$'),

  -- RN-2.2: ningún campo obligatorio puede quedar vacío.
  constraint operadores_nombre_obligatorio
    check (char_length(btrim(nombre)) > 0),
  constraint operadores_apellido_paterno_obligatorio
    check (char_length(btrim(apellido_paterno)) > 0),
  constraint operadores_apellido_materno_obligatorio
    check (char_length(btrim(apellido_materno)) > 0)
);

-- ------------------------------------------------------------
-- RN-2.3 y RN-2.4: trim + minúsculas antes de validar y guardar.
-- ------------------------------------------------------------
create or replace function public.fn_normalizar_operador()
returns trigger
language plpgsql
as $$
begin
  new.nombre := lower(btrim(new.nombre));
  new.apellido_paterno := lower(btrim(new.apellido_paterno));
  new.apellido_materno := lower(btrim(new.apellido_materno));
  return new;
end;
$$;

drop trigger if exists operadores_normalizar on public.operadores;
create trigger operadores_normalizar
  before insert or update of nombre, apellido_paterno, apellido_materno
  on public.operadores
  for each row
  execute function public.fn_normalizar_operador();

-- ------------------------------------------------------------
-- Trigger compartido definido en 0002_cuentas.sql.
-- ------------------------------------------------------------
drop trigger if exists operadores_set_actualizado_en on public.operadores;
create trigger operadores_set_actualizado_en
  before update on public.operadores
  for each row
  execute function public.set_actualizado_en();

-- ------------------------------------------------------------
-- RLS: solo el rol authenticated (JWT de la sesión propia).
-- Sin acceso anónimo y sin roles por fila: todos los usuarios
-- autenticados comparten el catálogo de la flotilla.
-- ------------------------------------------------------------
alter table public.operadores enable row level security;

revoke all on table public.operadores from anon;
grant select, insert, update, delete on table public.operadores to authenticated;

drop policy if exists operadores_select_authenticated on public.operadores;
create policy operadores_select_authenticated
  on public.operadores
  for select
  to authenticated
  using (true);

drop policy if exists operadores_insert_authenticated on public.operadores;
create policy operadores_insert_authenticated
  on public.operadores
  for insert
  to authenticated
  with check (true);

drop policy if exists operadores_update_authenticated on public.operadores;
create policy operadores_update_authenticated
  on public.operadores
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists operadores_delete_authenticated on public.operadores;
create policy operadores_delete_authenticated
  on public.operadores
  for delete
  to authenticated
  using (true);

comment on table public.operadores is
  'Catálogo de operadores de la flotilla. Borrado lógico mediante activo = false.';
comment on column public.operadores.activo is
  'true = operador vigente; false = dado de baja (no se elimina físicamente).';
