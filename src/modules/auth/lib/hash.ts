import "server-only";

import bcrypt from "bcryptjs";

/**
 * Costo de bcrypt dentro del rango aprobado por el Plan (10–12).
 * Solo se persiste el hash; la contraseña en claro nunca sale de esta función.
 */
const BCRYPT_COST = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
