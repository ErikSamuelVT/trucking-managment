-- ============================================================
-- 0012_operadores_delete_real.sql
-- Cambia el catálogo de operadores a borrado físico (DELETE).
--
-- Cambios:
--   1. Elimina la columna `activo` y su comentario.
--   2. Reafirma RLS y el permiso DELETE para el rol authenticated.
--   3. Actualiza la documentación de la tabla.
--
-- La bitácora de viajes no se ve afectada: guarda un snapshot de texto
-- del operador (`operador_id text`) y no tiene llave foránea hacia esta
-- tabla. Al eliminar un operador, los viajes históricos permanecen.
--
-- Idempotente: puede ejecutarse más de una vez sin errores.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Retirar el estatus: los operadores ya no tienen baja lógica.
-- ------------------------------------------------------------
alter table public.operadores
  drop column if exists activo;

-- ------------------------------------------------------------
-- 2. RLS y permisos: lectura/escritura solo para authenticated,
--    incluido el DELETE físico que ahora usa la aplicación.
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

-- ------------------------------------------------------------
-- 3. Documentación del modelo.
-- ------------------------------------------------------------
comment on table public.operadores is
  'Catálogo de operadores de la flotilla. El borrado es físico (DELETE); la bitácora conserva su propio snapshot del operador.';

-- Si la columna aún existiera por una ejecución parcial, eliminar su
-- comentario explícitamente no es necesario: drop column lo hace.
