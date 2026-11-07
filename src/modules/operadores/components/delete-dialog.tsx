"use client";

import { useTransition } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from "@/components/ui";

import { eliminarOperadorAction } from "../actions/operador.actions";
import type { Operador } from "../types";

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operador: Operador | null;
  onConfirmed: (id: string) => void;
};

export function DeleteDialog({
  open,
  onOpenChange,
  operador,
  onConfirmed,
}: DeleteDialogProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const nombreCompleto = operador
    ? `${operador.nombre} ${operador.apellido_paterno} ${operador.apellido_materno}`
    : "";

  function confirmar() {
    if (!operador) {
      return;
    }

    startTransition(async () => {
      const result = await eliminarOperadorAction({ id: operador.id });

      if (result.status === "error" || !result.data) {
        toast({
          variant: "error",
          title: "No se pudo eliminar el operador",
          description: result.message,
        });
        return;
      }

      onConfirmed(result.data.id);
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent labelledBy="operador-delete-title">
        <DialogHeader>
          <DialogTitle id="operador-delete-title">
            Eliminar operador
          </DialogTitle>
          <DialogDescription>
            ¿Confirmas que deseas eliminar a{" "}
            <span className="font-semibold text-slate-700">
              {nombreCompleto}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          El operador se eliminará permanentemente del catálogo. Los viajes
          históricos de la bitácora se conservan y no dependen de este
          registro.
        </p>

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
            type="button"
            variant="danger"
            isLoading={isPending}
            loadingText="Eliminando…"
            onClick={confirmar}
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
