import type { Metadata } from "next";

import { RecuperarForm } from "@/modules/auth/components/recuperar-form";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
};

export default function RecuperarPage() {
  return <RecuperarForm />;
}
