export type Destino = {
  id: string;
  destino: string;
  km: number;
  requiere_tiros: boolean;
  creado_en: string;
  actualizado_en: string;
};

export type DestinoInput = {
  destino: string;
  km: number;
};

export type DestinoFieldErrors = Record<string, string[] | undefined>;

export type DestinoActionResult = {
  status: "success" | "error";
  message: string;
  fieldErrors?: DestinoFieldErrors;
  data?: Destino;
};

export type EliminarDestinoResult = {
  status: "success" | "error";
  message: string;
  data?: { id: string };
};
