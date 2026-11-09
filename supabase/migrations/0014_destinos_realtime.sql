-- ============================================================
-- 0014_destinos_realtime.sql
-- Publica el catálogo de destinos en Supabase Realtime.
--
-- Necesario después de crear `destinos`, porque 0011/0013 solo
-- publican las tablas que ya existían al ejecutarse. Idempotente y
-- tolerante a tablas ausentes. No publica `cuentas`.
-- ============================================================

do $$
declare
  tabla text;
begin
  if not exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    create publication supabase_realtime;
  end if;

  foreach tabla in array array[
    'destinos',
    'unidades',
    'operadores',
    'bitacora_viajes',
    'estadisticas_snapshot'
  ]
  loop
    if to_regclass(format('public.%I', tabla)) is not null then
      -- Enviar la fila completa también en UPDATE/DELETE.
      execute format(
        'alter table public.%I replica identity full',
        tabla
      );

      if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = tabla
      ) then
        execute format(
          'alter publication supabase_realtime add table public.%I',
          tabla
        );
      end if;
    end if;
  end loop;
end;
$$;
