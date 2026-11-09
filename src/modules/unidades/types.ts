export type Unidad = {
  id: string;
  placas: string;
  marca: string;
  modelo: number;
  no_motor: string;
  niv: string;
  creado_en: string;
  actualizado_en: string;
};

export type UnidadInput = {
  placas: string;
  marca: string;
  modelo: number;
  no_motor: string;
  niv: string;
};

export type UnidadFieldErrors = Record<string, string[] | undefined>;

export type UnidadActionResult = {
  status: "success" | "error";
  message: string;
  fieldErrors?: UnidadFieldErrors;
  data?: Unidad;
};

export type EliminarUnidadResult = {
  status: "success" | "error";
  message: string;
  data?: { id: string };
};
