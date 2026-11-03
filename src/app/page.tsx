import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getSession } from "@/modules/auth/lib/session";

export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeRedirect />
    </Suspense>
  );
}

async function HomeRedirect() {
  const session = await getSession();

  redirect(session ? "/operadores" : "/login");

  return null;
}

function HomeSkeleton() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-200" />
    </main>
  );
}
