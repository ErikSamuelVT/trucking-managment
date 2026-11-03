import { NextResponse, type NextRequest } from "next/server";

import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  shouldRenewSession,
  signSessionToken,
  verifySessionToken,
} from "@/modules/auth/lib/session";

const DASHBOARD_PREFIXES = [
  "/operadores",
  "/unidades",
  "/destinos",
  "/bitacora",
  "/nominas",
  "/estadisticas",
];

const AUTH_ROUTES = ["/login", "/registro", "/recuperar"];

function isDashboardRoute(pathname: string): boolean {
  return DASHBOARD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (isDashboardRoute(pathname) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (AUTH_ROUTES.includes(pathname) && session) {
    return NextResponse.redirect(new URL("/operadores", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(session ? "/operadores" : "/login", request.url),
    );
  }

  const response = NextResponse.next();

  // Renovación deslizante: si quedan menos de 2 días, se emite un token nuevo.
  if (session && shouldRenewSession(session)) {
    const renewedToken = await signSessionToken(session.sub);

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: renewedToken,
      ...SESSION_COOKIE_OPTIONS,
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
