import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

import { getSupabaseJwtSecret } from "@/lib/supabase/server-config";

export const SESSION_COOKIE_NAME = "tc_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;
const RENEWAL_THRESHOLD_SECONDS = 60 * 60 * 24 * 2;

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
} as const;

export type SessionClaims = {
  sub: string;
  role: "authenticated";
  aud: "authenticated";
  iat: number;
  exp: number;
};

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(getSupabaseJwtSecret());
}

/**
 * Emite el JWT que Supabase acepta como rol `authenticated`.
 * Claims requeridos por el Plan: sub, role, aud y exp.
 */
export async function signSessionToken(cuentaId: string): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000);

  return new SignJWT({ role: "authenticated" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(cuentaId)
    .setAudience("authenticated")
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + SESSION_DURATION_SECONDS)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string | null | undefined,
): Promise<SessionClaims | null> {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
      audience: "authenticated",
    });

    if (
      typeof payload.sub !== "string" ||
      payload.role !== "authenticated" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    return {
      sub: payload.sub,
      role: "authenticated",
      aud: "authenticated",
      iat: typeof payload.iat === "number" ? payload.iat : 0,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

export function shouldRenewSession(claims: SessionClaims): boolean {
  const now = Math.floor(Date.now() / 1000);

  return claims.exp - now < RENEWAL_THRESHOLD_SECONDS;
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    ...SESSION_COOKIE_OPTIONS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function createSession(cuentaId: string): Promise<string> {
  const token = await signSessionToken(cuentaId);

  await setSessionCookie(token);

  return token;
}

/**
 * Lectura memoizada por render pass. En Server Actions y Route Handlers
 * cada llamada se ejecuta de nuevo, tal como documenta Next.js.
 */
export const getSession = cache(async (): Promise<SessionClaims | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  return verifySessionToken(token);
});

export async function getSessionAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const claims = await verifySessionToken(token);

  return claims ? token : null;
}

export async function requireSession(): Promise<SessionClaims> {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
