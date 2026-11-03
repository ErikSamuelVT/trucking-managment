"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  useToast,
} from "@/components/ui";

import {
  restablecerContrasena,
  verificarUsuario,
} from "../actions/recuperar.actions";
import {
  nuevaContrasenaSchema,
  recuperarUsuarioSchema,
  type NuevaContrasenaInput,
  type NuevaContrasenaValues,
  type RecuperarUsuarioInput,
  type RecuperarUsuarioValues,
} from "../schemas/cuenta.schema";
import { applyServerFieldErrors } from "./apply-server-field-errors";

export function RecuperarForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [usuarioVerificado, setUsuarioVerificado] = useState<string | null>(
    null,
  );
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const {
    register: registrarUsuario,
    handleSubmit: enviarUsuario,
    setError: marcarErrorUsuario,
    formState: { errors: erroresUsuario },
  } = useForm<RecuperarUsuarioInput, unknown, RecuperarUsuarioValues>({
    resolver: zodResolver(recuperarUsuarioSchema),
    defaultValues: { usuario: "" },
  });

  const {
    register: registrarContrasena,
    handleSubmit: enviarContrasena,
    setError: marcarErrorContrasena,
    formState: { errors: erroresContrasena },
  } = useForm<NuevaContrasenaInput, unknown, NuevaContrasenaValues>({
    resolver: zodResolver(nuevaContrasenaSchema),
    defaultValues: {
      contrasena: "",
      confirmarContrasena: "",
    },
  });

  const onVerificarUsuario = enviarUsuario((values) => {
    startTransition(async () => {
      const result = await verificarUsuario(values);

      if (result.status === "error") {
        applyServerFieldErrors(result.fieldErrors, marcarErrorUsuario);
        toast({
          variant: "error",
          title: "No se pudo verificar el usuario",
          description: result.message,
        });
        return;
      }

      const usuarioNormalizado = result.data?.usuario ?? values.usuario;

      setUsuarioVerificado(usuarioNormalizado);
      toast({
        variant: "success",
        title: "Usuario verificado",
        description: result.message,
      });
    });
  });

  const onRestablecerContrasena = enviarContrasena((values) => {
    if (!usuarioVerificado) {
      return;
    }

    startTransition(async () => {
      const result = await restablecerContrasena({
        usuario: usuarioVerificado,
        ...values,
      });

      if (result.status === "error") {
        applyServerFieldErrors(result.fieldErrors, marcarErrorContrasena);
        toast({
          variant: "error",
          title: "No se pudo actualizar la contraseña",
          description: result.message,
        });
        return;
      }

      toast({
        variant: "success",
        title: "Contraseña actualizada",
        description: result.message,
      });

      router.replace("/login");
    });
  });

  function cambiarUsuario() {
    setUsuarioVerificado(null);
    setMostrarContrasena(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recuperar contraseña</CardTitle>
        <CardDescription>
          {usuarioVerificado
            ? "Establece tu nueva contraseña."
            : "Ingresa tu nombre de usuario para continuar."}
        </CardDescription>
      </CardHeader>

      {usuarioVerificado ? (
        <form onSubmit={onRestablecerContrasena} noValidate>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-sm text-slate-700">
                Usuario:{" "}
                <span className="font-semibold">{usuarioVerificado}</span>
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={cambiarUsuario}
              >
                Cambiar
              </Button>
            </div>

            <Input
              label="Nueva contraseña"
              type={mostrarContrasena ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              error={erroresContrasena.contrasena?.message}
              {...registrarContrasena("contrasena")}
            />

            <Input
              label="Confirmar nueva contraseña"
              type={mostrarContrasena ? "text" : "password"}
              placeholder="Repite la nueva contraseña"
              autoComplete="new-password"
              error={erroresContrasena.confirmarContrasena?.message}
              {...registrarContrasena("confirmarContrasena")}
            />

            <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                checked={mostrarContrasena}
                onChange={(event) =>
                  setMostrarContrasena(event.target.checked)
                }
              />
              Mostrar contraseña
            </label>
          </CardContent>

          <CardFooter className="flex flex-col items-stretch gap-3">
            <Button
              type="submit"
              isLoading={isPending}
              loadingText="Actualizando…"
            >
              Actualizar contraseña
            </Button>
            <p className="text-center text-sm text-slate-500">
              <Link
                href="/login"
                className="font-medium text-brand-700 underline-offset-4 hover:underline"
              >
                Volver a iniciar sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      ) : (
        <form onSubmit={onVerificarUsuario} noValidate>
          <CardContent className="flex flex-col gap-4">
            <Input
              label="Usuario"
              placeholder="rogelio"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              error={erroresUsuario.usuario?.message}
              {...registrarUsuario("usuario")}
            />
          </CardContent>

          <CardFooter className="flex flex-col items-stretch gap-3">
            <Button
              type="submit"
              isLoading={isPending}
              loadingText="Verificando…"
            >
              Continuar
            </Button>
            <p className="text-center text-sm text-slate-500">
              <Link
                href="/login"
                className="font-medium text-brand-700 underline-offset-4 hover:underline"
              >
                Volver a iniciar sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
