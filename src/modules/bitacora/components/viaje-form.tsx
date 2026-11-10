"use client";

import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  useWatch,
  type FieldValues,
  type Path,
  type UseFormSetError,
} from "react-hook-form";

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
  actualizarViajeAction,
  crearViajeAction,
} from "../actions/viaje.actions";
import { contieneRefrigerado } from "../lib/refrigerado";
import {
  viajeSchema,
  type ViajeInput,
  type ViajeValues,
} from "../schemas/viaje.schema";
import type { Viaje, ViajeFieldErrors } from "../types";

const VALORES_VACIOS: ViajeInput = {
  fecha: "",
  operador_id: "",
  unidad_id: "",
  destino_id: "",
  numero_tiros: null,
};

function aplicarErroresServidor<T extends FieldValues>(
  fieldErrors: ViajeFieldErrors | undefined,
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

/**
 * Si el snapshot del viaje ya no existe en el catálogo (porque el
 * operador, la unidad o el destino se eliminó), se conserva como opción
 * histórica para no perder el dato al editar.
 */
function opcionesConHistorico(
  opciones: string[],
  valorActual: string | null | undefined,
): string[] {
  if (!valorActual || opciones.includes(valorActual)) {
    return opciones;
  }

  return [...opciones, valorActual];
}

type ViajeFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viaje: Viaje | null;
  operadores: string[];
  unidades: string[];
  destinos: string[];
  onSaved: (viaje: Viaje) => void;
};

export function ViajeForm({
  open,
  onOpenChange,
  viaje,
  operadores,
  unidades,
  destinos,
  onSaved,
}: ViajeFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm<ViajeInput, unknown, ViajeValues>({
    resolver: zodResolver(viajeSchema),
    defaultValues: VALORES_VACIOS,
  });

  const destinoSeleccionado = useWatch({ control, name: "destino_id" });
  const requiereTiros = contieneRefrigerado(destinoSeleccionado ?? "");

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(
      viaje
        ? {
            fecha: viaje.fecha,
            operador_id: viaje.operador_id,
            unidad_id: viaje.unidad_id,
            destino_id: viaje.destino_id,
            numero_tiros: viaje.numero_tiros,
          }
        : VALORES_VACIOS,
    );
  }, [open, viaje, reset]);

  const destinoField = register("destino_id");

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = viaje
        ? await actualizarViajeAction({ id: viaje.id, ...values })
        : await crearViajeAction(values);

      if (result.status === "error") {
        aplicarErroresServidor(result.fieldErrors, setError);
        toast({
          variant: "error",
          title: viaje
            ? "No se pudo actualizar el viaje"
            : "No se pudo registrar el viaje",
          description: result.message,
        });
        return;
      }

      if (result.data) {
        onSaved(result.data);
      }

      toast({
        variant: "success",
        title: viaje ? "Viaje actualizado" : "Viaje registrado",
        description: result.message,
      });

      onOpenChange(false);
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent labelledBy="viaje-form-title">
        <DialogHeader>
          <DialogTitle id="viaje-form-title">
            {viaje ? "Editar viaje" : "Nuevo viaje"}
          </DialogTitle>
          <DialogDescription>
            {viaje
              ? "Modifica los datos del viaje y guarda los cambios."
              : "Captura la fecha, el operador, la unidad y el destino del viaje."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={onSubmit}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="mt-5 flex flex-col gap-4 overflow-y-auto pr-1">
            <Input
              label="Fecha"
              type="date"
              autoComplete="off"
              required
              error={errors.fecha?.message}
              {...register("fecha")}
            />
            <Select
              label="Operador"
              placeholder="Seleccionar opción"
              required
              error={errors.operador_id?.message}
              {...register("operador_id")}
            >
              {opcionesConHistorico(operadores, viaje?.operador_id).map(
                (operador) => (
                  <option key={operador} value={operador}>
                    {operador}
                  </option>
                ),
              )}
            </Select>
            <Select
              label="Unidad"
              placeholder="Seleccionar opción"
              required
              error={errors.unidad_id?.message}
              {...register("unidad_id")}
            >
              {opcionesConHistorico(unidades, viaje?.unidad_id).map(
                (unidad) => (
                  <option key={unidad} value={unidad}>
                    {unidad}
                  </option>
                ),
              )}
            </Select>
            <Select
              label="Destino"
              placeholder="Seleccionar opción"
              required
              error={errors.destino_id?.message}
              {...destinoField}
              onChange={(event) => {
                destinoField.onChange(event);

                if (!contieneRefrigerado(event.target.value)) {
                  setValue("numero_tiros", null, {
                    shouldDirty: false,
                    shouldValidate: false,
                  });
                }
              }}
            >
              {opcionesConHistorico(destinos, viaje?.destino_id).map(
                (destino) => (
                  <option key={destino} value={destino}>
                    {destino}
                  </option>
                ),
              )}
            </Select>
            {requiereTiros ? (
              <Input
                label="Número de tiros"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                placeholder="1"
                autoComplete="off"
                required
                error={errors.numero_tiros?.message}
                {...register("numero_tiros", { valueAsNumber: true })}
              />
            ) : null}
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
              loadingText={viaje ? "Guardando…" : "Registrando…"}
            >
              {viaje ? "Guardar" : "Registrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
