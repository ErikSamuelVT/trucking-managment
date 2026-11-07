import "server-only";

import { createSupabaseSessionClient } from "@/lib/supabase/server";

import type {
  ActualizarOperadorValues,
  EliminarOperadorValues,
  OperadorValues,
} from "../schemas/operador.schema";
import type { Operador } from "../types";

const COLUMNAS_OPERADOR =
  "id, nombre, apellido_paterno, apellido_materno, creado_en, actualizado_en";

/**
 * Consultas del catálogo con el JWT de la sesión propia: PostgREST y RLS
 * aplican el rol `authenticated` definido en 0003_operadores.sql.
 */
export async function listarOperadores(): Promise<Operador[]> {
  const supabase = await createSupabaseSessionClient();

  const { data, error } = await supabase
    .from("operadores")
    .select(COLUMNAS_OPERADOR)
    .order("apellido_paterno", { ascending: true })
    .order("apellido_materno", { ascending: true })
    .order("nombre", { ascending: true });

  if (error) {
    throw new Error(`No fue posible listar los operadores: ${error.message}`);
  }

  return (data ?? []) as Operador[];
}

export async function crearOperador(
  input: OperadorValues,
): Promise<Operador> {
  const supabase = await createSupabaseSessionClient();

  const { data, error } = await supabase
    .from("operadores")
    .insert(input)
    .select(COLUMNAS_OPERADOR)
    .single();

  if (error) {
    throw new Error(`No fue posible registrar el operador: ${error.message}`);
  }

  return data as Operador;
}

export async function actualizarOperador(
  input: ActualizarOperadorValues,
): Promise<Operador> {
  const supabase = await createSupabaseSessionClient();
  const { id, ...campos } = input;

  const { data, error } = await supabase
    .from("operadores")
    .update(campos)
    .eq("id", id)
    .select(COLUMNAS_OPERADOR)
    .single();

  if (error) {
    throw new Error(
      `No fue posible actualizar el operador: ${error.message}`,
    );
  }

  return data as Operador;
}

/**
 * Borrado físico: la bitácora guarda su propio snapshot del operador, por lo
 * que los viajes históricos no dependen de esta fila.
 */
export async function eliminarOperador(
  input: EliminarOperadorValues,
): Promise<{ id: string }> {
  const supabase = await createSupabaseSessionClient();

  const { data, error } = await supabase
    .from("operadores")
    .delete()
    .eq("id", input.id)
    .select("id")
    .single();

  if (error) {
    throw new Error(`No fue posible eliminar el operador: ${error.message}`);
  }

  return data as { id: string };
}
