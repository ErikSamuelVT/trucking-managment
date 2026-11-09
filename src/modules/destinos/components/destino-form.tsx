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
  actualizarDestinoAction,
  crearDestinoAction,
} from "../actions/destino.actions";
import {
  destinoSchema,
  type DestinoInput,
  type DestinoValues,
} from "../schemas/destino.schema";
import type { Destino, DestinoFieldErrors } from "../types";

const VALORES_VACIOS: DestinoInput = {
  destino: "",
  km: "" as unknown as number,
};

function aplicarErroresServidor<T extends FieldValues>(
  fieldErrors: DestinoFieldErrors | undefined,
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

type DestinoFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destino: Destino | null;
  onSaved: (destino: Destino) => void;
};

export function DestinoForm({
  open,
  onOpenChange,
  destino,
  onSaved,
}: DestinoFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<DestinoInput, unknown, DestinoValues>({
    resolver: zodResolver(destinoSchema),
    defaultValues: VALORES_VACIOS,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(
      destino
        ? {
            destino: destino.destino,
            km: destino.km,
          }
        : VALORES_VACIOS,
    );
  }, [open, destino, reset]);

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = destino
        ? await actualizarDestinoAction({ id: destino.id, ...values })
        : await crearDestinoAction(values);

      if (result.status === "error") {
        aplicarErroresServidor(result.fieldErrors, setError);
        toast({
          variant: "error",
          title: destino
            ? "No se pudo actualizar el destino"
            : "No se pudo registrar el destino",
          description: result.message,
        });
        return;
      }

      if (result.data) {
        onSaved(result.data);
      }

      toast({
        variant: "success",
        title: destino ? "Destino actualizado" : "Destino registrado",
        description: result.message,
      });

      onOpenChange(false);
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent labelledBy="destino-form-title">
        <DialogHeader>
          <DialogTitle id="destino-form-title">
            {destino ? "Editar destino" : "Nuevo destino"}
          </DialogTitle>
          <DialogDescription>
            {destino
              ? "Modifica los datos del destino y guarda los cambios."
              : "Captura el nombre y la distancia del destino."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={onSubmit}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="mt-5 flex flex-col gap-4 overflow-y-auto pr-1">
            <Input
              label="Destino"
              placeholder="seco"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              required
              error={errors.destino?.message}
              {...register("destino")}
            />
            <Input
              label="Km"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              placeholder="100"
              autoComplete="off"
              required
              error={errors.km?.message}
              {...register("km", { valueAsNumber: true })}
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
              loadingText={destino ? "Guardando…" : "Registrando…"}
            >
              {destino ? "Guardar" : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
