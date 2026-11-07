export type Operador = {
  id: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  creado_en: string;
  actualizado_en: string;
};

export type OperadorInput = {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
};

export type OperadorFieldErrors = Record<string, string[] | undefined>;

export type OperadorActionResult = {
  status: "success" | "error";
  message: string;
  fieldErrors?: OperadorFieldErrors;
  data?: Operador;
};

export type EliminarOperadorResult = {
  status: "success" | "error";
  message: string;
  data?: { id: string };
};
