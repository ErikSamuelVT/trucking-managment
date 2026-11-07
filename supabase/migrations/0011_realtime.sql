-- ============================================================
-- 0011_realtime.sql
-- Publicación de las tablas operativas en Supabase Realtime.
--
-- Idempotente y tolerante a fases incompletas: publica únicamente las
-- tablas que ya existan. Al ejecutarse en la Fase 2 solo agrega
-- `operadores`; en fases posteriores puede volver a ejecutarse o
-- extenderse para unidades, destinos, bitácora y estadísticas.
--
-- `cuentas` nunca se publica.
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
    'operadores',
    'unidades',
    'destinos',
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
