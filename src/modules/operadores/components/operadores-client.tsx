"use client";

import { useMemo, useState } from "react";

import { Button, Card, Input, useToast } from "@/components/ui";
import { useRealtimeCollection } from "@/hooks/use-realtime-collection";

import { listarOperadoresAction } from "../actions/operador.actions";
import type { Operador } from "../types";
import { DeleteDialog } from "./delete-dialog";
import { OperadorForm } from "./operador-form";
import { OperadoresTable } from "./operadores-table";

const REGISTROS_POR_PAGINA = 5;

type OperadoresClientProps = {
  initialData: Operador[];
};

function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function compararOperadores(a: Operador, b: Operador): number {
  return (
    a.apellido_paterno.localeCompare(b.apellido_paterno, "es") ||
    a.apellido_materno.localeCompare(b.apellido_materno, "es") ||
    a.nombre.localeCompare(b.nombre, "es")
  );
}

export function OperadoresClient({ initialData }: OperadoresClientProps) {
  const { toast } = useToast();
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] = useState<Operador | null>(null);
  const [eliminando, setEliminando] = useState<Operador | null>(null);

  const { items, setItems } = useRealtimeCollection<Operador>({
    table: "operadores",
    initialData,
    reload: listarOperadoresAction,
  });

  const operadoresFiltrados = useMemo(() => {
    const termino = normalizarTexto(busqueda.trim());

    return items
      .filter((operador) => {
        if (!termino) {
          return true;
        }

        return normalizarTexto(
          `${operador.nombre} ${operador.apellido_paterno} ${operador.apellido_materno}`,
        ).includes(termino);
      })
      .sort(compararOperadores);
  }, [items, busqueda]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(operadoresFiltrados.length / REGISTROS_POR_PAGINA),
  );
  const paginaActual = Math.min(pagina, totalPaginas);
  const operadoresPagina = operadoresFiltrados.slice(
    (paginaActual - 1) * REGISTROS_POR_PAGINA,
    paginaActual * REGISTROS_POR_PAGINA,
  );

  function guardarOperador(operador: Operador) {
    setItems((current) => {
      const index = current.findIndex((item) => item.id === operador.id);

      if (index === -1) {
        return [...current, operador];
      }

      const next = current.slice();
      next[index] = operador;

      return next;
    });
  }

  function quitarOperador(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function abrirNuevo() {
    setEditando(null);
    setFormOpen(true);
  }

  function abrirEdicion(operador: Operador) {
    setEditando(operador);
    setFormOpen(true);
  }

  function operadorEliminado(id: string) {
    quitarOperador(id);
    setEliminando(null);
    toast({
      variant: "success",
      title: "Operador eliminado",
      description: "El registro se eliminó del catálogo.",
    });
  }

  const mensajeVacio =
    items.length === 0
      ? "Aún no hay operadores registrados en el sistema."
      : "No hay operadores que coincidan con la búsqueda.";

  return (
    <>
      <Card>
        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h3 className="hidden text-2xl leading-none font-bold tracking-tight md:block">
              Operadores
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
              Nuevo Operador
            </Button>
          </div>

          <Input
            type="search"
            placeholder="Buscar por nombres, apellido paterno o materno..."
            autoComplete="off"
            value={busqueda}
            onChange={(event) => {
              setBusqueda(event.target.value);
              setPagina(1);
            }}
          />

          <OperadoresTable
            operadores={operadoresPagina}
            total={operadoresFiltrados.length}
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

      <OperadorForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);

          if (!open) {
            setEditando(null);
          }
        }}
        operador={editando}
        onSaved={guardarOperador}
      />

      <DeleteDialog
        open={eliminando !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEliminando(null);
          }
        }}
        operador={eliminando}
        onConfirmed={operadorEliminado}
      />
    </>
  );
}
