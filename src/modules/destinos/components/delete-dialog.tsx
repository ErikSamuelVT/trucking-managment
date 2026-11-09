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

import { eliminarDestinoAction } from "../actions/destino.actions";
import type { Destino } from "../types";

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destino: Destino | null;
  onConfirmed: (id: string) => void;
};

export function DeleteDialog({
  open,
  onOpenChange,
  destino,
  onConfirmed,
}: DeleteDialogProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function confirmar() {
    if (!destino) {
      return;
    }

    startTransition(async () => {
      const result = await eliminarDestinoAction({ id: destino.id });

      if (result.status === "error" || !result.data) {
        toast({
          variant: "error",
          title: "No se pudo eliminar el destino",
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
      <DialogContent labelledBy="destino-delete-title">
        <DialogHeader>
          <DialogTitle id="destino-delete-title">
            Eliminar destino
          </DialogTitle>
          <DialogDescription>
            ¿Confirmas que deseas eliminar el destino{" "}
            <span className="font-semibold text-slate-700">
              {destino?.destino}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          El destino se eliminará permanentemente del catálogo. Los viajes
          históricos de la bitácora se conservan con el snapshot del destino y
          los tiros capturados, y no dependen de este registro.
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
