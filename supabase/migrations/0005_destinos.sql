-- ============================================================
-- 0005_destinos.sql
-- Catálogo de destinos de la flotilla.
--
-- Autocontenida: crea la tabla, normaliza el nombre (trim + lower),
-- calcula `requiere_tiros`, reutiliza set_actualizado_en() de 0002 y
-- habilita RLS para que solo el rol authenticated opere el catálogo.
--
-- El borrado es FÍSICO (DELETE). La bitácora de viajes guardará un
-- snapshot de texto del destino y el número de tiros ya capturado,
-- sin llave foránea hacia esta tabla; los viajes históricos
-- permanecen intactos al eliminar un destino.
-- ============================================================

create table public.destinos (
  id uuid primary key default gen_random_uuid(),
  destino text not null,
  km numeric(10, 2) not null,

  -- `translate` es inmutable, por lo que puede usarse en una columna
  -- generada. Normaliza acentos para detectar "refrigerado" sin
  -- depender de la volatilidad de `unaccent`.
  requiere_tiros boolean generated always as (
    translate(
      lower(destino),
      'áàäâãéèëêíìïîóòöôõúùüûñ',
      'aaaaaeeeeiiiiooooouuuun'
    ) like '%refrigerado%'
  ) stored,

  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),

  -- RN-4.1/RN-4.3: solo letras con acentos y espacios simples entre
  -- palabras, sin números ni caracteres especiales. Se evalúa después
  -- del trigger de normalización.
  constraint destinos_nombre_formato
    check (destino ~ '^[a-záéíóúüñ]+( [a-záéíóúüñ]+)*$'),

  -- Plan 4.5: la distancia debe ser mayor que cero.
  constraint destinos_km_positivo
    check (km > 0)
);

-- ------------------------------------------------------------
-- RN-4.4: destinos únicos. Al no existir baja lógica, la unicidad
-- es global. El índice sobre lower(destino) es defensivo: el trigger
-- ya guarda el valor en minúsculas.
-- ------------------------------------------------------------
create unique index destinos_nombre_unique
  on public.destinos (lower(destino));

-- ------------------------------------------------------------
-- RN-4.5: trim + minúsculas antes de validar y guardar.
-- ------------------------------------------------------------
create or replace function public.fn_normalizar_destino()
returns trigger
language plpgsql
as $$
begin
  new.destino := lower(btrim(new.destino));
  return new;
end;
$$;

drop trigger if exists destinos_normalizar on public.destinos;
create trigger destinos_normalizar
  before insert or update of destino
  on public.destinos
  for each row
  execute function public.fn_normalizar_destino();

-- ------------------------------------------------------------
-- Trigger compartido definido en 0002_cuentas.sql.
-- ------------------------------------------------------------
drop trigger if exists destinos_set_actualizado_en on public.destinos;
create trigger destinos_set_actualizado_en
  before update on public.destinos
  for each row
  execute function public.set_actualizado_en();

-- ------------------------------------------------------------
-- RLS: solo el rol authenticated (JWT de la sesión propia).
-- Sin acceso anónimo y sin roles por fila.
-- ------------------------------------------------------------
alter table public.destinos enable row level security;

revoke all on table public.destinos from anon;
grant select, insert, update, delete on table public.destinos to authenticated;

drop policy if exists destinos_select_authenticated on public.destinos;
create policy destinos_select_authenticated
  on public.destinos
  for select
  to authenticated
  using (true);

drop policy if exists destinos_insert_authenticated on public.destinos;
create policy destinos_insert_authenticated
  on public.destinos
  for insert
  to authenticated
  with check (true);

drop policy if exists destinos_update_authenticated on public.destinos;
create policy destinos_update_authenticated
  on public.destinos
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists destinos_delete_authenticated on public.destinos;
create policy destinos_delete_authenticated
  on public.destinos
  for delete
  to authenticated
  using (true);

comment on table public.destinos is
  'Catálogo de destinos de la flotilla. El borrado es físico (DELETE); la bitácora conserva su propio snapshot del destino y los tiros capturados.';
