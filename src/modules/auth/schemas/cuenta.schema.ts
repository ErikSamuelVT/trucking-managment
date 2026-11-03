import { z } from "zod";

const USUARIO_REGEX = /^[a-z0-9áéíóúüñ]+$/;

export const usuarioSchema = z
  .string({ error: "El usuario es obligatorio." })
  .trim()
  .min(1, { error: "El usuario es obligatorio." })
  .min(6, { error: "El usuario debe tener al menos 6 caracteres." })
  .toLowerCase()
  .regex(USUARIO_REGEX, {
    error:
      "El usuario solo puede contener letras con acentos y números, sin caracteres especiales.",
  });

export const contrasenaSchema = z
  .string({ error: "La contraseña es obligatoria." })
  .trim()
  .min(1, { error: "La contraseña es obligatoria." })
  .min(6, { error: "La contraseña debe tener al menos 6 caracteres." })
  .toLowerCase();

export const loginSchema = z.object({
  usuario: usuarioSchema,
  contrasena: contrasenaSchema,
});

export const registroSchema = z
  .object({
    usuario: usuarioSchema,
    contrasena: contrasenaSchema,
    confirmarContrasena: z
      .string({ error: "Confirma la contraseña." })
      .trim()
      .min(1, { error: "Confirma la contraseña." })
      .toLowerCase(),
  })
  .refine((data) => data.contrasena === data.confirmarContrasena, {
    path: ["confirmarContrasena"],
    error: "Las contraseñas no coinciden.",
  });

export const recuperarUsuarioSchema = z.object({
  usuario: usuarioSchema,
});

export const nuevaContrasenaSchema = z
  .object({
    contrasena: contrasenaSchema,
    confirmarContrasena: z
      .string({ error: "Confirma la contraseña." })
      .trim()
      .min(1, { error: "Confirma la contraseña." })
      .toLowerCase(),
  })
  .refine((data) => data.contrasena === data.confirmarContrasena, {
    path: ["confirmarContrasena"],
    error: "Las contraseñas no coinciden.",
  });

export const restablecerContrasenaSchema = z
  .object({
    usuario: usuarioSchema,
    contrasena: contrasenaSchema,
    confirmarContrasena: z
      .string({ error: "Confirma la contraseña." })
      .trim()
      .min(1, { error: "Confirma la contraseña." })
      .toLowerCase(),
  })
  .refine((data) => data.contrasena === data.confirmarContrasena, {
    path: ["confirmarContrasena"],
    error: "Las contraseñas no coinciden.",
  });

export type LoginInput = z.input<typeof loginSchema>;
export type LoginValues = z.output<typeof loginSchema>;
export type RegistroInput = z.input<typeof registroSchema>;
export type RegistroValues = z.output<typeof registroSchema>;
export type RecuperarUsuarioInput = z.input<typeof recuperarUsuarioSchema>;
export type RecuperarUsuarioValues = z.output<typeof recuperarUsuarioSchema>;
export type NuevaContrasenaInput = z.input<typeof nuevaContrasenaSchema>;
export type NuevaContrasenaValues = z.output<typeof nuevaContrasenaSchema>;
export type RestablecerContrasenaInput = z.input<
  typeof restablecerContrasenaSchema
>;
export type RestablecerContrasenaValues = z.output<
  typeof restablecerContrasenaSchema
>;
