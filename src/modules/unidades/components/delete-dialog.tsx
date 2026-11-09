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

import { eliminarUnidadAction } from "../actions/unidad.actions";
import type { Unidad } from "../types";

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unidad: Unidad | null;
  onConfirmed: (id: string) => void;
};

export function DeleteDialog({
  open,
  onOpenChange,
  unidad,
  onConfirmed,
}: DeleteDialogProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function confirmar() {
    if (!unidad) {
      return;
    }

    startTransition(async () => {
      const result = await eliminarUnidadAction({ id: unidad.id });

      if (result.status === "error" || !result.data) {
        toast({
          variant: "error",
          title: "No se pudo eliminar la unidad",
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
      <DialogContent labelledBy="unidad-delete-title">
        <DialogHeader>
          <DialogTitle id="unidad-delete-title">
            Eliminar unidad
          </DialogTitle>
          <DialogDescription>
            ¿Confirmas que deseas eliminar la unidad con placas{" "}
            <span className="font-semibold text-slate-700">
              {unidad?.placas}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          La unidad se eliminará permanentemente del catálogo. Los viajes
          históricos de la bitácora se conservan con el snapshot de sus placas
          y no dependen de este registro.
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
