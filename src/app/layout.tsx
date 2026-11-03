import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { ToastProvider } from "@/components/ui";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TruckingControl",
    template: "%s | TruckingControl",
  },
  description:
    "Administración de operadores, unidades, destinos, bitácora, nóminas y estadísticas de la flotilla.",
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
