import "server-only";

import { createSupabaseSessionClient } from "@/lib/supabase/server";

import type {
  ActualizarDestinoValues,
  DestinoValues,
  EliminarDestinoValues,
} from "../schemas/destino.schema";
import type { Destino } from "../types";

const COLUMNAS_DESTINO =
  "id, destino, km, requiere_tiros, creado_en, actualizado_en";

/**
 * Consultas del catálogo con el JWT de la sesión propia: PostgREST y RLS
 * aplican el rol `authenticated` definido en 0005_destinos.sql.
 */
export async function listarDestinos(): Promise<Destino[]> {
  const supabase = await createSupabaseSessionClient();

  const { data, error } = await supabase
    .from("destinos")
    .select(COLUMNAS_DESTINO)
    .order("destino", { ascending: true });

  if (error) {
    throw new Error(`No fue posible listar los destinos: ${error.message}`);
  }

  return (data ?? []) as Destino[];
}

/**
 * RN-4.4: comprobación previa de destinos duplicados para devolver un
 * error de campo claro. El índice único de la tabla sigue siendo la
 * garantía definitiva ante condiciones de carrera.
 */
export async function existeDestino(
  destino: string,
  excluirId?: string,
): Promise<boolean> {
  const supabase = await createSupabaseSessionClient();

  let consulta = supabase
    .from("destinos")
    .select("id", { count: "exact", head: true })
    .eq("destino", destino);

  if (excluirId) {
    consulta = consulta.neq("id", excluirId);
  }

  const { count, error } = await consulta;

  if (error) {
    throw new Error(`No fue posible verificar el destino: ${error.message}`);
  }

  return (count ?? 0) > 0;
}

export async function crearDestino(input: DestinoValues): Promise<Destino> {
  const supabase = await createSupabaseSessionClient();

  const { data, error } = await supabase
    .from("destinos")
    .insert(input)
    .select(COLUMNAS_DESTINO)
    .single();

  if (error) {
    throw new Error(`No fue posible registrar el destino: ${error.message}`);
  }

  return data as Destino;
}

export async function actualizarDestino(
  input: ActualizarDestinoValues,
): Promise<Destino> {
  const supabase = await createSupabaseSessionClient();
  const { id, ...campos } = input;

  const { data, error } = await supabase
    .from("destinos")
    .update(campos)
    .eq("id", id)
    .select(COLUMNAS_DESTINO)
    .single();

  if (error) {
    throw new Error(`No fue posible actualizar el destino: ${error.message}`);
  }

  return data as Destino;
}

/**
 * Borrado físico: la futura bitácora guardará su propio snapshot del
 * destino y los tiros capturados, sin llave foránea hacia esta tabla.
 */
export async function eliminarDestino(
  input: EliminarDestinoValues,
): Promise<{ id: string }> {
  const supabase = await createSupabaseSessionClient();

  const { data, error } = await supabase
    .from("destinos")
    .delete()
    .eq("id", input.id)
    .select("id")
    .single();

  if (error) {
    throw new Error(`No fue posible eliminar el destino: ${error.message}`);
  }

  return data as { id: string };
}
