-- ============================================================
-- 0004_unidades.sql
-- Catálogo de unidades de la flotilla.
--
-- Autocontenida: crea la tabla, normaliza los textos (trim + lower),
-- reutiliza set_actualizado_en() de 0002 y habilita RLS para que solo
-- el rol authenticated pueda operar el catálogo.
--
-- El borrado es FÍSICO (DELETE), igual que en operadores. La bitácora
-- de viajes guardará un snapshot de texto de la unidad (placas) y no
-- tendrá llave foránea hacia esta tabla, por lo que los viajes
-- históricos permanecen intactos al eliminar una unidad.
-- ============================================================

create table public.unidades (
  id uuid primary key default gen_random_uuid(),
  placas text not null,
  marca text not null,
  modelo smallint not null,
  no_motor text not null,
  niv char(17) not null,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),

  -- RN-3.1 / RN-3.3: placas y número de motor alfanuméricos, sin vacíos.
  constraint unidades_placas_formato
    check (placas ~ '^[a-z0-9]+$'),
  constraint unidades_no_motor_formato
    check (no_motor ~ '^[a-z0-9]+$'),

  -- RN-3.2: el NIV debe tener exactamente 17 caracteres alfanuméricos.
  constraint unidades_niv_formato
    check (niv ~ '^[a-z0-9]{17}$'),

  -- Plan 4.5: marca restringida y modelo en el rango de años válido.
  constraint unidades_marca_valida
    check (marca in ('freightliner', 'international', 'chevrolet')),
  constraint unidades_modelo_rango
    check (modelo between 1950 and 2100)
);

-- ------------------------------------------------------------
-- RN-3.4: placas únicas. Al no existir baja lógica, la unicidad
-- es global. El índice sobre lower(placas) es defensivo: el trigger
-- ya guarda el valor en minúsculas.
-- ------------------------------------------------------------
create unique index unidades_placas_unique
  on public.unidades (lower(placas));

-- ------------------------------------------------------------
-- RN-3.5: trim + minúsculas antes de validar y guardar.
-- ------------------------------------------------------------
create or replace function public.fn_normalizar_unidad()
returns trigger
language plpgsql
as $$
begin
  new.placas := lower(btrim(new.placas));
  new.marca := lower(btrim(new.marca));
  new.no_motor := lower(btrim(new.no_motor));
  new.niv := lower(btrim(new.niv));
  return new;
end;
$$;

drop trigger if exists unidades_normalizar on public.unidades;
create trigger unidades_normalizar
  before insert or update of placas, marca, no_motor, niv
  on public.unidades
  for each row
  execute function public.fn_normalizar_unidad();

-- ------------------------------------------------------------
-- Trigger compartido definido en 0002_cuentas.sql.
-- ------------------------------------------------------------
drop trigger if exists unidades_set_actualizado_en on public.unidades;
create trigger unidades_set_actualizado_en
  before update on public.unidades
  for each row
  execute function public.set_actualizado_en();

-- ------------------------------------------------------------
-- RLS: solo el rol authenticated (JWT de la sesión propia).
-- Sin acceso anónimo y sin roles por fila: todos los usuarios
-- autenticados comparten el catálogo de la flotilla.
-- ------------------------------------------------------------
alter table public.unidades enable row level security;

revoke all on table public.unidades from anon;
grant select, insert, update, delete on table public.unidades to authenticated;

drop policy if exists unidades_select_authenticated on public.unidades;
create policy unidades_select_authenticated
  on public.unidades
  for select
  to authenticated
  using (true);

drop policy if exists unidades_insert_authenticated on public.unidades;
create policy unidades_insert_authenticated
  on public.unidades
  for insert
  to authenticated
  with check (true);

drop policy if exists unidades_update_authenticated on public.unidades;
create policy unidades_update_authenticated
  on public.unidades
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists unidades_delete_authenticated on public.unidades;
create policy unidades_delete_authenticated
  on public.unidades
  for delete
  to authenticated
  using (true);

comment on table public.unidades is
  'Catálogo de unidades de la flotilla. El borrado es físico (DELETE); la bitácora conserva su propio snapshot de la unidad (placas).';
