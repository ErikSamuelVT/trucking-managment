"use client";

import { useMemo, useState } from "react";

import { Button, Card, Input, useToast } from "@/components/ui";
import { useRealtimeCollection } from "@/hooks/use-realtime-collection";

import { listarUnidadesAction } from "../actions/unidad.actions";
import type { Unidad } from "../types";
import { DeleteDialog } from "./delete-dialog";
import { UnidadForm } from "./unidad-form";
import { UnidadesTable } from "./unidades-table";

const REGISTROS_POR_PAGINA = 5;

type UnidadesClientProps = {
  initialData: Unidad[];
};

function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function compararUnidades(a: Unidad, b: Unidad): number {
  return a.placas.localeCompare(b.placas, "es");
}

export function UnidadesClient({ initialData }: UnidadesClientProps) {
  const { toast } = useToast();
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] = useState<Unidad | null>(null);
  const [eliminando, setEliminando] = useState<Unidad | null>(null);

  const { items, setItems } = useRealtimeCollection<Unidad>({
    table: "unidades",
    initialData,
    reload: listarUnidadesAction,
  });

  const unidadesFiltradas = useMemo(() => {
    const termino = normalizarTexto(busqueda.trim());

    return items
      .filter((unidad) => {
        if (!termino) {
          return true;
        }

        return normalizarTexto(
          `${unidad.placas} ${unidad.marca} ${unidad.modelo} ${unidad.no_motor} ${unidad.niv}`,
        ).includes(termino);
      })
      .sort(compararUnidades);
  }, [items, busqueda]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(unidadesFiltradas.length / REGISTROS_POR_PAGINA),
  );
  const paginaActual = Math.min(pagina, totalPaginas);
  const unidadesPagina = unidadesFiltradas.slice(
    (paginaActual - 1) * REGISTROS_POR_PAGINA,
    paginaActual * REGISTROS_POR_PAGINA,
  );

  function guardarUnidad(unidad: Unidad) {
    setItems((current) => {
      const index = current.findIndex((item) => item.id === unidad.id);

      if (index === -1) {
        return [...current, unidad];
      }

      const next = current.slice();
      next[index] = unidad;

      return next;
    });
  }

  function quitarUnidad(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function abrirNuevo() {
    setEditando(null);
    setFormOpen(true);
  }

  function abrirEdicion(unidad: Unidad) {
    setEditando(unidad);
    setFormOpen(true);
  }

  function unidadEliminada(id: string) {
    quitarUnidad(id);
    setEliminando(null);
    toast({
      variant: "success",
      title: "Unidad eliminada",
      description: "El registro se eliminó del catálogo.",
    });
  }

  const mensajeVacio =
    items.length === 0
      ? "Aún no hay unidades registradas en el sistema."
      : "No hay unidades que coincidan con la búsqueda.";

  return (
    <>
      <Card>
        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h3 className="hidden text-2xl leading-none font-bold tracking-tight md:block">
              Unidades
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
              Nueva Unidad
            </Button>
          </div>

          <Input
            type="search"
            placeholder="Buscar por placas, marca, modelo, no. motor o NIV..."
            autoComplete="off"
            value={busqueda}
            onChange={(event) => {
              setBusqueda(event.target.value);
              setPagina(1);
            }}
          />

          <UnidadesTable
            unidades={unidadesPagina}
            total={unidadesFiltradas.length}
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

      <UnidadForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);

          if (!open) {
            setEditando(null);
          }
        }}
        unidad={editando}
        onSaved={guardarUnidad}
      />

      <DeleteDialog
        open={eliminando !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEliminando(null);
          }
        }}
        unidad={eliminando}
        onConfirmed={unidadEliminada}
      />
    </>
  );
}
