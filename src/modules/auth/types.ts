export type AuthFieldErrors = Record<string, string[] | undefined>;

export type AuthActionResult = {
  status: "success" | "error";
  message: string;
  fieldErrors?: AuthFieldErrors;
  data?: {
    usuario?: string;
    existe?: boolean;
  };
};
