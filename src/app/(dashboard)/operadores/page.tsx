import type { Metadata } from "next";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Operadores",
};

export default function OperadoresPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <CardTitle>Operadores</CardTitle>
            <CardDescription>
              El catálogo de operadores se incorpora en la Fase 2.
            </CardDescription>
          </div>
          <Badge variant="brand">Fase 1</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-700">
          Sesión protegida correctamente. Esta ruta ya exige la cookie{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
            tc_session
          </code>{" "}
          y será reemplazada por el CRUD real en la siguiente fase.
        </p>
      </CardContent>
    </Card>
  );
}
