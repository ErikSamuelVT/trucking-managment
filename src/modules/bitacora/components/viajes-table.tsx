"use client";

import type { ReactNode } from "react";

import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";

import type { Viaje } from "../types";

const ALTURA_FILA = 44;
const FORMATEADOR_FECHA = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatearFecha(fecha: string): string {
  const [anio, mes, dia] = fecha.split("-").map(Number);

  if (!anio || !mes || !dia) {
    return fecha;
  }

  return FORMATEADOR_FECHA.format(new Date(anio, mes - 1, dia));
}

type ViajesTableProps = {
  viajes: Viaje[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  emptyMessage: string;
  onPageChange: (page: number) => void;
  onEdit: (viaje: Viaje) => void;
  onDelete: (viaje: Viaje) => void;
};

function Tooltip({ children, label }: { children: ReactNode; label: string }) {
  return (
    <span className="group/tooltip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute top-1/2 right-full z-20 mr-2 -translate-y-1/2 rounded-md bg-slate-900 px-2 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

function AccionesViaje({
  viaje,
  onEdit,
  onDelete,
}: {
  viaje: Viaje;
  onEdit: (viaje: Viaje) => void;
  onDelete: (viaje: Viaje) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Tooltip label="Editar">
        <Button
          type="button"
          variant="edit"
          size="iconSm"
          onClick={() => onEdit(viaje)}
          aria-label={`Editar el viaje del ${viaje.fecha}`}
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.862 4.487Zm0 0L19.5 7.125"
            />
          </svg>
        </Button>
      </Tooltip>
      <Tooltip label="Eliminar">
        <Button
          type="button"
          variant="delete"
          size="iconSm"
          onClick={() => onDelete(viaje)}
          aria-label={`Eliminar el viaje del ${viaje.fecha}`}
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </Button>
      </Tooltip>
    </div>
  );
}

function IconoBitacora() {
  return (
    <svg
      className="size-12 text-slate-300"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4.5h6M9 7.5h6M6.75 3.75h10.5a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5V5.25a1.5 1.5 0 0 1 1.5-1.5Z"
      />
    </svg>
  );
}

function EstadoVacio({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <IconoBitacora />
      <p className="text-sm font-semibold text-slate-700">
        No se encontraron viajes
      </p>
      <p className="max-w-sm text-sm text-slate-500">{mensaje}</p>
    </div>
  );
}

function PieDeTabla({
  mostrados,
  total,
  page,
  totalPages,
  onPageChange,
}: {
  mostrados: number;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500" aria-live="polite">
        {`Mostrando ${mostrados} de ${total} ${
          total === 1 ? "viaje" : "viajes"
        }`}
      </p>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        alwaysShow
      />
    </div>
  );
}

export function ViajesTable({
  viajes,
  total,
  page,
  pageSize,
  totalPages,
  emptyMessage,
  onPageChange,
  onEdit,
  onDelete,
}: ViajesTableProps) {
  const vacio = viajes.length === 0;
  const offset = (page - 1) * pageSize;
  const filasFaltantes = Math.max(pageSize - viajes.length, 0);

  return (
    <>
      <div className="overflow-x-auto">
        <Table className="min-w-[980px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">N°</TableHead>
              <TableHead className="whitespace-nowrap">Fecha</TableHead>
              <TableHead className="whitespace-nowrap">Operador</TableHead>
              <TableHead className="whitespace-nowrap">Unidad</TableHead>
              <TableHead className="whitespace-nowrap">Destino</TableHead>
              <TableHead className="w-24 whitespace-nowrap">Tiros</TableHead>
              <TableHead className="w-28 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="min-h-[220px]">
            {vacio ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={7}
                  className="px-4 py-8"
                  style={{ height: pageSize * ALTURA_FILA }}
                >
                  <EstadoVacio mensaje={emptyMessage} />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {viajes.map((viaje, index) => (
                  <TableRow key={viaje.id}>
                    <TableCell className="text-slate-500 tabular-nums">
                      {offset + index + 1}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-slate-700">
                      {formatearFecha(viaje.fecha)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap capitalize text-slate-900">
                      {viaje.operador_id}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-slate-700 uppercase">
                      {viaje.unidad_id}
                    </TableCell>
                    <TableCell className="whitespace-nowrap capitalize text-slate-700">
                      {viaje.destino_id}
                    </TableCell>
                    <TableCell className="text-slate-700 tabular-nums">
                      {viaje.numero_tiros ?? "—"}
                    </TableCell>
                    <TableCell>
                      <AccionesViaje
                        viaje={viaje}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {filasFaltantes > 0 ? (
                  <TableRow
                    className="hover:bg-transparent"
                    aria-hidden="true"
                  >
                    <TableCell
                      colSpan={7}
                      style={{ height: filasFaltantes * ALTURA_FILA }}
                    />
                  </TableRow>
                ) : null}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      <PieDeTabla
        mostrados={viajes.length}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
