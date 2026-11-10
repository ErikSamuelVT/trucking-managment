"use client";

import { useMemo, useState } from "react";

import { Button, Card, Input, useToast } from "@/components/ui";
import { useRealtimeCollection } from "@/hooks/use-realtime-collection";

import { listarViajesAction } from "../actions/viaje.actions";
import { normalizarTexto } from "../lib/refrigerado";
import type { Viaje } from "../types";
import { DeleteDialog } from "./delete-dialog";
import { ViajeForm } from "./viaje-form";
import { ViajesTable } from "./viajes-table";

const REGISTROS_POR_PAGINA = 5;

type ViajesClientProps = {
  initialData: Viaje[];
  operadores: string[];
  unidades: string[];
  destinos: string[];
};

function compararViajes(a: Viaje, b: Viaje): number {
  return (
    b.fecha.localeCompare(a.fecha) ||
    b.creado_en.localeCompare(a.creado_en)
  );
}

export function ViajesClient({
  initialData,
  operadores,
  unidades,
  destinos,
}: ViajesClientProps) {
  const { toast } = useToast();
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] = useState<Viaje | null>(null);
  const [eliminando, setEliminando] = useState<Viaje | null>(null);

  const { items, setItems } = useRealtimeCollection<Viaje>({
    table: "bitacora_viajes",
    initialData,
    reload: listarViajesAction,
  });

  const viajesFiltrados = useMemo(() => {
    const termino = normalizarTexto(busqueda.trim());

    return items
      .filter((viaje) => {
        if (!termino) {
          return true;
        }

        return normalizarTexto(
          `${viaje.fecha} ${viaje.operador_id} ${viaje.unidad_id} ${viaje.destino_id} ${viaje.numero_tiros ?? ""}`,
        ).includes(termino);
      })
      .sort(compararViajes);
  }, [items, busqueda]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(viajesFiltrados.length / REGISTROS_POR_PAGINA),
  );
  const paginaActual = Math.min(pagina, totalPaginas);
  const viajesPagina = viajesFiltrados.slice(
    (paginaActual - 1) * REGISTROS_POR_PAGINA,
    paginaActual * REGISTROS_POR_PAGINA,
  );

  function guardarViaje(viaje: Viaje) {
    setItems((current) => {
      const index = current.findIndex((item) => item.id === viaje.id);

      if (index === -1) {
        return [...current, viaje];
      }

      const next = current.slice();
      next[index] = viaje;

      return next;
    });
  }

  function quitarViaje(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function abrirNuevo() {
    setEditando(null);
    setFormOpen(true);
  }

  function abrirEdicion(viaje: Viaje) {
    setEditando(viaje);
    setFormOpen(true);
  }

  function viajeEliminado(id: string) {
    quitarViaje(id);
    setEliminando(null);
    toast({
      variant: "success",
      title: "Viaje eliminado",
      description: "El registro se eliminó de la bitácora.",
    });
  }

  const mensajeVacio =
    items.length === 0
      ? "Aún no hay viajes registrados en la bitácora."
      : "No hay viajes que coincidan con la búsqueda.";

  return (
    <>
      <Card>
        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h3 className="hidden text-2xl leading-none font-bold tracking-tight md:block">
              Bitácora
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
              Nuevo Viaje
            </Button>
          </div>

          <Input
            type="search"
            placeholder="Buscar por fecha, operador, unidad o destino..."
            autoComplete="off"
            value={busqueda}
            onChange={(event) => {
              setBusqueda(event.target.value);
              setPagina(1);
            }}
          />

          <ViajesTable
            viajes={viajesPagina}
            total={viajesFiltrados.length}
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

      <ViajeForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);

          if (!open) {
            setEditando(null);
          }
        }}
        viaje={editando}
        operadores={operadores}
        unidades={unidades}
        destinos={destinos}
        onSaved={guardarViaje}
      />

      <DeleteDialog
        open={eliminando !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEliminando(null);
          }
        }}
        viaje={eliminando}
        onConfirmed={viajeEliminado}
      />
    </>
  );
}
