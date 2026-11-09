"use client";

import { useMemo, useState } from "react";

import { Button, Card, Input, useToast } from "@/components/ui";
import { useRealtimeCollection } from "@/hooks/use-realtime-collection";

import { listarDestinosAction } from "../actions/destino.actions";
import type { Destino } from "../types";
import { DeleteDialog } from "./delete-dialog";
import { DestinoForm } from "./destino-form";
import { DestinosTable } from "./destinos-table";

const REGISTROS_POR_PAGINA = 5;

type DestinosClientProps = {
  initialData: Destino[];
};

function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function compararDestinos(a: Destino, b: Destino): number {
  return a.destino.localeCompare(b.destino, "es");
}

export function DestinosClient({ initialData }: DestinosClientProps) {
  const { toast } = useToast();
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] = useState<Destino | null>(null);
  const [eliminando, setEliminando] = useState<Destino | null>(null);

  const { items, setItems } = useRealtimeCollection<Destino>({
    table: "destinos",
    initialData,
    reload: listarDestinosAction,
  });

  const destinosFiltrados = useMemo(() => {
    const termino = normalizarTexto(busqueda.trim());

    return items
      .filter((destino) => {
        if (!termino) {
          return true;
        }

        return normalizarTexto(
          `${destino.destino} ${destino.km}`,
        ).includes(termino);
      })
      .sort(compararDestinos);
  }, [items, busqueda]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(destinosFiltrados.length / REGISTROS_POR_PAGINA),
  );
  const paginaActual = Math.min(pagina, totalPaginas);
  const destinosPagina = destinosFiltrados.slice(
    (paginaActual - 1) * REGISTROS_POR_PAGINA,
    paginaActual * REGISTROS_POR_PAGINA,
  );

  function guardarDestino(destino: Destino) {
    setItems((current) => {
      const index = current.findIndex((item) => item.id === destino.id);

      if (index === -1) {
        return [...current, destino];
      }

      const next = current.slice();
      next[index] = destino;

      return next;
    });
  }

  function quitarDestino(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function abrirNuevo() {
    setEditando(null);
    setFormOpen(true);
  }

  function abrirEdicion(destino: Destino) {
    setEditando(destino);
    setFormOpen(true);
  }

  function destinoEliminado(id: string) {
    quitarDestino(id);
    setEliminando(null);
    toast({
      variant: "success",
      title: "Destino eliminado",
      description: "El registro se eliminó del catálogo.",
    });
  }

  const mensajeVacio =
    items.length === 0
      ? "Aún no hay destinos registrados en el sistema."
      : "No hay destinos que coincidan con la búsqueda.";

  return (
    <>
      <Card>
        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h3 className="hidden text-2xl leading-none font-bold tracking-tight md:block">
              Destinos
            </h3>
            <Button
              type="button"
              onClick={abrirNuevo}
              className="w-full md:w-auto"
            >
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Nuevo Destino
            </Button>
          </div>

          <Input
            type="search"
            placeholder="Buscar por destino o kilómetros..."
            autoComplete="off"
            value={busqueda}
            onChange={(event) => {
              setBusqueda(event.target.value);
              setPagina(1);
            }}
          />

          <DestinosTable
            destinos={destinosPagina}
            total={destinosFiltrados.length}
            page={paginaActual}
            pageSize={REGISTROS_POR_PAGINA}
            totalPages={totalPaginas}
            emptyMessage={mensajeVacio}
            onPageChange={setPagina}
            onEdit={abrirEdicion}
            onDelete={setEliminando}
          />
        </div>
      </Card>

      <DestinoForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);

          if (!open) {
            setEditando(null);
          }
        }}
        destino={editando}
        onSaved={guardarDestino}
      />

      <DeleteDialog
        open={eliminando !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEliminando(null);
          }
        }}
        destino={eliminando}
        onConfirmed={destinoEliminado}
      />
    </>
  );
}
