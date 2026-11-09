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
  Select,
  useToast,
} from "@/components/ui";

import {
  actualizarUnidadAction,
  crearUnidadAction,
} from "../actions/unidad.actions";
import {
  unidadSchema,
  type UnidadInput,
  type UnidadValues,
} from "../schemas/unidad.schema";
import type { Unidad, UnidadFieldErrors } from "../types";

const VALORES_VACIOS: UnidadInput = {
  placas: "",
  marca: "",
  modelo: "" as unknown as number,
  no_motor: "",
  niv: "",
};

function aplicarErroresServidor<T extends FieldValues>(
  fieldErrors: UnidadFieldErrors | undefined,
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

type UnidadFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unidad: Unidad | null;
  onSaved: (unidad: Unidad) => void;
};

export function UnidadForm({
  open,
  onOpenChange,
  unidad,
  onSaved,
}: UnidadFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UnidadInput, unknown, UnidadValues>({
    resolver: zodResolver(unidadSchema),
    defaultValues: VALORES_VACIOS,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(
      unidad
        ? {
            placas: unidad.placas,
            marca: unidad.marca,
            modelo: unidad.modelo,
            no_motor: unidad.no_motor,
            niv: unidad.niv,
          }
        : VALORES_VACIOS,
    );
  }, [open, unidad, reset]);

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = unidad
        ? await actualizarUnidadAction({ id: unidad.id, ...values })
        : await crearUnidadAction(values);

      if (result.status === "error") {
        aplicarErroresServidor(result.fieldErrors, setError);
        toast({
          variant: "error",
          title: unidad
            ? "No se pudo actualizar la unidad"
            : "No se pudo registrar la unidad",
          description: result.message,
        });
        return;
      }

      if (result.data) {
        onSaved(result.data);
      }

      toast({
        variant: "success",
        title: unidad ? "Unidad actualizada" : "Unidad registrada",
        description: result.message,
      });

      onOpenChange(false);
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent labelledBy="unidad-form-title">
        <DialogHeader>
          <DialogTitle id="unidad-form-title">
            {unidad ? "Editar unidad" : "Nueva unidad"}
          </DialogTitle>
          <DialogDescription>
            {unidad
              ? "Modifica los datos de la unidad y guarda los cambios."
              : "Captura los datos de identificación de la unidad."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={onSubmit}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="mt-5 flex flex-col gap-4 overflow-y-auto pr-1">
            <Input
              label="Placas"
              placeholder="839de1"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              required
              error={errors.placas?.message}
              {...register("placas")}
            />
            <Select
              label="Marca"
              placeholder="Seleccionar opción"
              required
              error={errors.marca?.message}
              {...register("marca")}
            >
              <option value="freightliner">Freightliner</option>
              <option value="international">International</option>
              <option value="chevrolet">Chevrolet</option>
            </Select>
            <Input
              label="Modelo"
              type="number"
              inputMode="numeric"
              min={1950}
              max={2100}
              placeholder="2021"
              autoComplete="off"
              required
              error={errors.modelo?.message}
              {...register("modelo", { valueAsNumber: true })}
            />
            <Input
              label="No. Motor"
              placeholder="accsscscsc2f323f3"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              required
              error={errors.no_motor?.message}
              {...register("no_motor")}
            />
            <Input
              label="NIV"
              placeholder="vvsssdvsvdsvw43v3"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={17}
              required
              hint="Exactamente 17 caracteres alfanuméricos."
              error={errors.niv?.message}
              {...register("niv")}
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
              loadingText={unidad ? "Guardando…" : "Registrando…"}
            >
              {unidad ? "Guardar" : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
