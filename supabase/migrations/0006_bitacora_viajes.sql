-- ============================================================
-- 0006_bitacora_viajes.sql
-- Registro histórico de viajes de la flotilla.
--
-- La bitácora NO usa llaves foráneas hacia los catálogos. Guarda
-- snapshots de texto del operador, las placas de la unidad y el
-- destino, de modo que el borrado físico en los catálogos nunca
-- altera los viajes históricos.
--
-- `numero_tiros` se valida contra el snapshot del destino: si el
-- nombre contiene "refrigerado" (sin distinguir mayúsculas ni
-- acentos) es obligatorio y mayor que cero; si no, debe ser NULL.
-- ============================================================

create table public.bitacora_viajes (
  id uuid primary key default gen_random_uuid(),
  fecha date not null,
  operador_id text not null,
  unidad_id text not null,
  destino_id text not null,
  numero_tiros integer,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),

  -- RN-5.2: ningún snapshot de texto puede quedar vacío.
  constraint bitacora_operador_obligatorio
    check (char_length(btrim(operador_id)) > 0),
  constraint bitacora_unidad_obligatoria
    check (char_length(btrim(unidad_id)) > 0),
  constraint bitacora_destino_obligatorio
    check (char_length(btrim(destino_id)) > 0),

  -- RN-5.3: tiros obligatorios solo cuando el destino contiene
  -- "refrigerado"; en cualquier otro caso debe ser NULL.
  constraint bitacora_tiros_condicional
    check (
      (
        translate(
          lower(destino_id),
          'áàäâãéèëêíìïîóòöôõúùüûñ',
          'aaaaaeeeeiiiiooooouuuun'
        ) like '%refrigerado%'
        and numero_tiros is not null
        and numero_tiros > 0
      )
      or (
        translate(
          lower(destino_id),
          'áàäâãéèëêíìïîóòöôõúùüûñ',
          'aaaaaeeeeiiiiooooouuuun'
        ) not like '%refrigerado%'
        and numero_tiros is null
      )
    )
);

-- ------------------------------------------------------------
-- Normalización de los snapshots: trim + minúsculas, para que
-- coincidan con los valores normalizados de los catálogos.
-- ------------------------------------------------------------
create or replace function public.fn_normalizar_bitacora()
returns trigger
language plpgsql
as $$
begin
  new.operador_id := lower(btrim(new.operador_id));
  new.unidad_id := lower(btrim(new.unidad_id));
  new.destino_id := lower(btrim(new.destino_id));
  return new;
end;
$$;

drop trigger if exists bitacora_normalizar on public.bitacora_viajes;
create trigger bitacora_normalizar
  before insert or update of operador_id, unidad_id, destino_id
  on public.bitacora_viajes
  for each row
  execute function public.fn_normalizar_bitacora();

-- ------------------------------------------------------------
-- Trigger compartido definido en 0002_cuentas.sql.
-- ------------------------------------------------------------
drop trigger if exists bitacora_set_actualizado_en on public.bitacora_viajes;
create trigger bitacora_set_actualizado_en
  before update on public.bitacora_viajes
  for each row
  execute function public.set_actualizado_en();

-- ------------------------------------------------------------
-- Índices para consultas históricas, nóminas y estadísticas.
-- ------------------------------------------------------------
create index bitacora_viajes_fecha_idx
  on public.bitacora_viajes (fecha);

create index bitacora_viajes_operador_idx
  on public.bitacora_viajes (operador_id);

create index bitacora_viajes_unidad_idx
  on public.bitacora_viajes (unidad_id);

create index bitacora_viajes_destino_idx
  on public.bitacora_viajes (destino_id);

create index bitacora_viajes_fecha_operador_idx
  on public.bitacora_viajes (fecha, operador_id);

-- ------------------------------------------------------------
-- RLS: solo el rol authenticated (JWT de la sesión propia).
-- ------------------------------------------------------------
alter table public.bitacora_viajes enable row level security;

revoke all on table public.bitacora_viajes from anon;
grant select, insert, update, delete on table public.bitacora_viajes to authenticated;

drop policy if exists bitacora_select_authenticated on public.bitacora_viajes;
create policy bitacora_select_authenticated
  on public.bitacora_viajes
  for select
  to authenticated
  using (true);

drop policy if exists bitacora_insert_authenticated on public.bitacora_viajes;
create policy bitacora_insert_authenticated
  on public.bitacora_viajes
  for insert
  to authenticated
  with check (true);

drop policy if exists bitacora_update_authenticated on public.bitacora_viajes;
create policy bitacora_update_authenticated
  on public.bitacora_viajes
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists bitacora_delete_authenticated on public.bitacora_viajes;
create policy bitacora_delete_authenticated
  on public.bitacora_viajes
  for delete
  to authenticated
  using (true);

comment on table public.bitacora_viajes is
  'Registro histórico de viajes. Guarda snapshots de texto de operador, unidad y destino; no depende de los catálogos.';
comment on column public.bitacora_viajes.numero_tiros is
  'Obligatorio y > 0 cuando el destino contiene "refrigerado"; NULL en cualquier otro caso.';
