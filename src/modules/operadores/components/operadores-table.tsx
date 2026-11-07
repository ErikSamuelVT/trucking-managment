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

import type { Operador } from "../types";

const ALTURA_FILA = 44;

type OperadoresTableProps = {
  operadores: Operador[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  emptyMessage: string;
  onPageChange: (page: number) => void;
  onEdit: (operador: Operador) => void;
  onDelete: (operador: Operador) => void;
};

function nombreCompleto(operador: Operador): string {
  return `${operador.nombre} ${operador.apellido_paterno} ${operador.apellido_materno}`;
}

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

function AccionesOperador({
  operador,
  onEdit,
  onDelete,
}: {
  operador: Operador;
  onEdit: (operador: Operador) => void;
  onDelete: (operador: Operador) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Tooltip label="Editar">
        <Button
          type="button"
          variant="edit"
          size="iconSm"
          onClick={() => onEdit(operador)}
          aria-label={`Editar a ${nombreCompleto(operador)}`}
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
          onClick={() => onDelete(operador)}
          aria-label={`Eliminar a ${nombreCompleto(operador)}`}
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

function IconoOperadores() {
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
        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
      />
    </svg>
  );
}

function EstadoVacio({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <IconoOperadores />
      <p className="text-sm font-semibold text-slate-700">
        No se encontraron operadores
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
          total === 1 ? "operador" : "operadores"
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

export function OperadoresTable({
  operadores,
  total,
  page,
  pageSize,
  totalPages,
  emptyMessage,
  onPageChange,
  onEdit,
  onDelete,
}: OperadoresTableProps) {
  const vacio = operadores.length === 0;
  const offset = (page - 1) * pageSize;
  const filasFaltantes = Math.max(pageSize - operadores.length, 0);

  return (
    <>
      <div className="overflow-x-auto">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">N°</TableHead>
              <TableHead>Nombre(s)</TableHead>
              <TableHead>Apellido Paterno</TableHead>
              <TableHead>Apellido Materno</TableHead>
              <TableHead className="w-28 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="min-h-[220px]">
            {vacio ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={5}
                  className="px-4 py-8"
                  style={{ height: pageSize * ALTURA_FILA }}
                >
                  <EstadoVacio mensaje={emptyMessage} />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {operadores.map((operador, index) => (
                  <TableRow key={operador.id}>
                    <TableCell className="text-slate-500 tabular-nums">
                      {offset + index + 1}
                    </TableCell>
                    <TableCell className="font-medium capitalize text-slate-900">
                      {operador.nombre}
                    </TableCell>
                    <TableCell className="capitalize text-slate-700">
                      {operador.apellido_paterno}
                    </TableCell>
                    <TableCell className="capitalize text-slate-700">
                      {operador.apellido_materno}
                    </TableCell>
                    <TableCell>
                      <AccionesOperador
                        operador={operador}
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
                      colSpan={5}
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
        mostrados={operadores.length}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
