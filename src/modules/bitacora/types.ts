export type Viaje = {
  id: string;
  fecha: string;
  operador_id: string;
  unidad_id: string;
  destino_id: string;
  numero_tiros: number | null;
  creado_en: string;
  actualizado_en: string;
};

export type ViajePayload = {
  fecha: string;
  operador_id: string;
  unidad_id: string;
  destino_id: string;
  numero_tiros: number | null;
};

export type ActualizarViajePayload = ViajePayload & {
  id: string;
};

export type ViajeFieldErrors = Record<string, string[] | undefined>;

export type ViajeActionResult = {
  status: "success" | "error";
  message: string;
  fieldErrors?: ViajeFieldErrors;
  data?: Viaje;
};

export type EliminarViajeResult = {
  status: "success" | "error";
  message: string;
  data?: { id: string };
};
