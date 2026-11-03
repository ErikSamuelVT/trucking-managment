"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
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

import { iniciarSesion } from "../actions/sesion.actions";
import {
  loginSchema,
  type LoginInput,
  type LoginValues,
} from "../schemas/cuenta.schema";
import { applyServerFieldErrors } from "./apply-server-field-errors";

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput, unknown, LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usuario: "",
      contrasena: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await iniciarSesion(values);

      if (result.status === "error") {
        applyServerFieldErrors(result.fieldErrors, setError);
        toast({
          variant: "error",
          title: "No se pudo iniciar sesión",
          description: result.message,
        });
        return;
      }

      toast({
        variant: "success",
        title: "Bienvenido",
        description: result.message,
      });

      router.replace("/operadores");
      router.refresh();
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription>
          Ingresa con tu usuario y contraseña para acceder a la flotilla.
        </CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit} noValidate>
        <CardContent className="flex flex-col gap-4">
          <Input
            label="Usuario"
            placeholder="rogelio"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            error={errors.usuario?.message}
            {...register("usuario")}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="Tu contraseña"
            autoComplete="current-password"
            error={errors.contrasena?.message}
            {...register("contrasena")}
          />

          <div className="flex justify-end">
            <Link
              href="/recuperar"
              className="text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-stretch gap-3">
          <Button type="submit" isLoading={isPending} loadingText="Ingresando…">
            Ingresar
          </Button>
          <p className="text-center text-sm text-slate-500">
            ¿No tienes cuenta?{" "}
            <Link
              href="/registro"
              className="font-medium text-brand-700 underline-offset-4 hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
