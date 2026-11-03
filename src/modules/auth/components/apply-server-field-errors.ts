import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import type { AuthFieldErrors } from "../types";

export function applyServerFieldErrors<T extends FieldValues>(
  fieldErrors: AuthFieldErrors | undefined,
  setError: UseFormSetError<T>,
): void {
  if (!fieldErrors) {
    return;
  }

  for (const [field, messages] of Object.entries(fieldErrors)) {
    const message = messages?.[0];

    if (message) {
      setError(field as Path<T>, { type: "server", message });
    }
  }
}
