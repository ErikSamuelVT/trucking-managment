-- ============================================================
-- 0001_extensions.sql
-- Extensiones requeridas por el esquema de TruckingControl.
-- ============================================================

-- gen_random_uuid() para las llaves primarias UUID.
create extension if not exists pgcrypto;

-- unaccent() se usará en la columna generada requiere_tiros de destinos.
create extension if not exists unaccent;
