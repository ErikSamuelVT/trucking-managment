import type { Metadata } from "next";
import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
} from "@/components/ui";
import { requireSession } from "@/modules/auth/lib/session";
import { ViajesClient } from "@/modules/bitacora/components/viajes-client";
import { listarViajes } from "@/modules/bitacora/services/viaje.service";
import { listarDestinos } from "@/modules/destinos/services/destino.service";
import { listarOperadores } from "@/modules/operadores/services/operador.service";
import { listarUnidades } from "@/modules/unidades/services/unidad.service";

export const metadata: Metadata = {
  title: "Bitácora",
};

export default function BitacoraPage() {
  return (
    <Suspense fallback={<BitacoraSkeleton />}>
      <BitacoraContent />
    </Suspense>
  );
}

async function BitacoraContent() {
  await requireSession();

  const [viajes, operadores, unidades, destinos] = await Promise.all([
    listarViajes(),
    listarOperadores(),
    listarUnidades(),
    listarDestinos(),
  ]);

  const opcionesOperadores = Array.from(
    new Set(
      operadores.map(
        (operador) => `${operador.nombre} ${operador.apellido_paterno}`,
      ),
    ),
  ).sort((a, b) => a.localeCompare(b, "es"));

  const opcionesUnidades = Array.from(
    new Set(unidades.map((unidad) => unidad.placas)),
  ).sort((a, b) => a.localeCompare(b, "es"));

  const opcionesDestinos = Array.from(
    new Set(destinos.map((destino) => destino.destino)),
  ).sort((a, b) => a.localeCompare(b, "es"));

  return (
    <ViajesClient
      initialData={viajes}
      operadores={opcionesOperadores}
      unidades={opcionesUnidades}
      destinos={opcionesDestinos}
    />
  );
}

function BitacoraSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-56 w-full" />
      </CardContent>
    </Card>
  );
}
