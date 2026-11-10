import "server-only";

import { createSupabaseSessionClient } from "@/lib/supabase/server";

import type { EliminarViajeValues } from "../schemas/viaje.schema";
import type {
  ActualizarViajePayload,
  Viaje,
  ViajePayload,
} from "../types";

const COLUMNAS_VIAJE =
  "id, fecha, operador_id, unidad_id, destino_id, numero_tiros, creado_en, actualizado_en";

export async function listarViajes(): Promise<Viaje[]> {
  const supabase = await createSupabaseSessionClient();

  const { data, error } = await supabase
    .from("bitacora_viajes")
    .select(COLUMNAS_VIAJE)
    .order("fecha", { ascending: false })
    .order("creado_en", { ascending: false });

  if (error) {
    throw new Error(`No fue posible listar los viajes: ${error.message}`);
  }

  return (data ?? []) as Viaje[];
}

export async function crearViaje(input: ViajePayload): Promise<Viaje> {
  const supabase = await createSupabaseSessionClient();

  const { data, error } = await supabase
    .from("bitacora_viajes")
    .insert(input)
    .select(COLUMNAS_VIAJE)
    .single();

  if (error) {
    throw new Error(`No fue posible registrar el viaje: ${error.message}`);
  }

  return data as Viaje;
}

export async function actualizarViaje(
  input: ActualizarViajePayload,
): Promise<Viaje> {
  const supabase = await createSupabaseSessionClient();
  const { id, ...campos } = input;

  const { data, error } = await supabase
    .from("bitacora_viajes")
    .update(campos)
    .eq("id", id)
    .select(COLUMNAS_VIAJE)
    .single();

  if (error) {
    throw new Error(`No fue posible actualizar el viaje: ${error.message}`);
  }

  return data as Viaje;
}

export async function eliminarViaje(
  input: EliminarViajeValues,
): Promise<{ id: string }> {
  const supabase = await createSupabaseSessionClient();

  const { data, error } = await supabase
    .from("bitacora_viajes")
    .delete()
    .eq("id", input.id)
    .select("id")
    .single();

  if (error) {
    throw new Error(`No fue posible eliminar el viaje: ${error.message}`);
  }

  return data as { id: string };
}
