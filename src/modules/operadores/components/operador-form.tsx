"use client";

import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldValues, type Path, type UseFormSetError } from "react-hook-form";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  useToast,
} from "@/components/ui";

import {
  actualizarOperadorAction,
  crearOperadorAction,
} from "../actions/operador.actions";
import {
  operadorSchema,
  type OperadorInput,
  type OperadorValues,
} from "../schemas/operador.schema";
import type { Operador, OperadorFieldErrors } from "../types";

const VALORES_VACIOS: OperadorInput = {
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
};

function aplicarErroresServidor<T extends FieldValues>(
  fieldErrors: OperadorFieldErrors | undefined,
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

type OperadorFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operador: Operador | null;
  onSaved: (operador: Operador) => void;
};

export function OperadorForm({
  open,
  onOpenChange,
  operador,
  onSaved,
}: OperadorFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<OperadorInput, unknown, OperadorValues>({
    resolver: zodResolver(operadorSchema),
    defaultValues: VALORES_VACIOS,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(
      operador
        ? {
            nombre: operador.nombre,
            apellido_paterno: operador.apellido_paterno,
            apellido_materno: operador.apellido_materno,
          }
        : VALORES_VACIOS,
    );
  }, [open, operador, reset]);

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = operador
        ? await actualizarOperadorAction({ id: operador.id, ...values })
        : await crearOperadorAction(values);

      if (result.status === "error") {
        aplicarErroresServidor(result.fieldErrors, setError);
        toast({
          variant: "error",
          title: operador
            ? "No se pudo actualizar el operador"
            : "No se pudo registrar el operador",
          description: result.message,
        });
        return;
      }

      if (result.data) {
        onSaved(result.data);
      }

      toast({
        variant: "success",
        title: operador ? "Operador actualizado" : "Operador registrado",
        description: result.message,
      });

      onOpenChange(false);
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent labelledBy="operador-form-title">
        <DialogHeader>
          <DialogTitle id="operador-form-title">
            {operador ? "Editar operador" : "Nuevo operador"}
          </DialogTitle>
          <DialogDescription>
            {operador
              ? "Modifica los datos del operador y guarda los cambios."
              : "Captura el nombre y los apellidos del operador."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={onSubmit}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="mt-5 flex flex-col gap-4 overflow-y-auto pr-1">
            <Input
              label="Nombre(s)"
              placeholder="rogelio"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              required
              error={errors.nombre?.message}
              {...register("nombre")}
            />
            <Input
              label="Apellido paterno"
              placeholder="chavez"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              required
              error={errors.apellido_paterno?.message}
              {...register("apellido_paterno")}
            />
            <Input
              label="Apellido materno"
              placeholder="lopez"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              required
              error={errors.apellido_materno?.message}
              {...register("apellido_materno")}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isPending}
              loadingText={operador ? "Guardando…" : "Registrando…"}
            >
              {operador ? "Guardar" : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
