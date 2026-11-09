import type { Metadata } from "next";
import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
} from "@/components/ui";
import { requireSession } from "@/modules/auth/lib/session";
import { DestinosClient } from "@/modules/destinos/components/destinos-client";
import { listarDestinos } from "@/modules/destinos/services/destino.service";

export const metadata: Metadata = {
  title: "Destinos",
};

export default function DestinosPage() {
  return (
    <Suspense fallback={<DestinosSkeleton />}>
      <DestinosContent />
    </Suspense>
  );
}

async function DestinosContent() {
  await requireSession();

  const destinos = await listarDestinos();

  return <DestinosClient initialData={destinos} />;
}

function DestinosSkeleton() {
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
