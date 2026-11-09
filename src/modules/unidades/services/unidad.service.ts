import "server-only";

import { createSupabaseSessionClient } from "@/lib/supabase/server";

import type {
  ActualizarUnidadValues,
  EliminarUnidadValues,
  UnidadValues,
} from "../schemas/unidad.schema";
import type { Unidad } from "../types";

const COLUMNAS_UNIDAD =
  "id, placas, marca, modelo, no_motor, niv, creado_en, actualizado_en";

/**
 * Consultas del catálogo con el JWT de la sesión propia: PostgREST y RLS
 * aplican el rol `authenticated` definido en 0004_unidades.sql.
 */
export async function listarUnidades(): Promise<Unidad[]> {
  const supabase = await createSupabaseSessionClient();

  const { data, error } = await supabase
    .from("unidades")
    .select(COLUMNAS_UNIDAD)
    .order("placas", { ascending: true });

  if (error) {
    throw new Error(`No fue posible listar las unidades: ${error.message}`);
  }

  return (data ?? []) as Unidad[];
}

/**
 * RN-3.4: comprobación previa de placas duplicadas para devolver un error
 * de campo claro. El índice único de la tabla sigue siendo la garantía
 * definitiva ante condiciones de carrera.
 */
export async function existePlaca(
  placas: string,
  excluirId?: string,
): Promise<boolean> {
  const supabase = await createSupabaseSessionClient();

  let consulta = supabase
    .from("unidades")
    .select("id", { count: "exact", head: true })
    .eq("placas", placas);

  if (excluirId) {
    consulta = consulta.neq("id", excluirId);
  }

  const { count, error } = await consulta;

  if (error) {
    throw new Error(`No fue posible verificar las placas: ${error.message}`);
  }

  return (count ?? 0) > 0;
}

export async function crearUnidad(input: UnidadValues): Promise<Unidad> {
  const supabase = await createSupabaseSessionClient();

  const { data, error } = await supabase
    .from("unidades")
    .insert(input)
    .select(COLUMNAS_UNIDAD)
    .single();

  if (error) {
    throw new Error(`No fue posible registrar la unidad: ${error.message}`);
  }

  return data as Unidad;
}

export async function actualizarUnidad(
  input: ActualizarUnidadValues,
): Promise<Unidad> {
  const supabase = await createSupabaseSessionClient();
  const { id, ...campos } = input;

  const { data, error } = await supabase
    .from("unidades")
    .update(campos)
    .eq("id", id)
    .select(COLUMNAS_UNIDAD)
    .single();

  if (error) {
    throw new Error(`No fue posible actualizar la unidad: ${error.message}`);
  }

  return data as Unidad;
}

/**
 * Borrado físico: la futura bitácora guardará su propio snapshot de la
 * unidad (placas) sin llave foránea, por lo que los viajes históricos no
 * dependen de esta fila.
 */
export async function eliminarUnidad(
  input: EliminarUnidadValues,
): Promise<{ id: string }> {
  const supabase = await createSupabaseSessionClient();

  const { data, error } = await supabase
    .from("unidades")
    .delete()
    .eq("id", input.id)
    .select("id")
    .single();

  if (error) {
    throw new Error(`No fue posible eliminar la unidad: ${error.message}`);
  }

  return data as { id: string };
}
