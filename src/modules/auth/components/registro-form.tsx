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

import { registrarCuenta } from "../actions/cuenta.actions";
import {
  registroSchema,
  type RegistroInput,
  type RegistroValues,
} from "../schemas/cuenta.schema";
import { applyServerFieldErrors } from "./apply-server-field-errors";

export function RegistroForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegistroInput, unknown, RegistroValues>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      usuario: "",
      contrasena: "",
      confirmarContrasena: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await registrarCuenta(values);

      if (result.status === "error") {
        applyServerFieldErrors(result.fieldErrors, setError);
        toast({
          variant: "error",
          title: "No se pudo registrar la cuenta",
          description: result.message,
        });
        return;
      }

      toast({
        variant: "success",
        title: "Registro exitoso",
        description: result.message,
      });

      router.replace("/login");
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription>
          Elige un usuario y una contraseña para crear tu cuenta.
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
            hint="Mínimo 6 caracteres. Solo letras con acentos y números."
            error={errors.usuario?.message}
            {...register("usuario")}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            hint="Se guarda únicamente como hash."
            error={errors.contrasena?.message}
            {...register("contrasena")}
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="Repite la contraseña"
            autoComplete="new-password"
            error={errors.confirmarContrasena?.message}
            {...register("confirmarContrasena")}
          />
        </CardContent>

        <CardFooter className="flex flex-col items-stretch gap-3">
          <Button
            type="submit"
            isLoading={isPending}
            loadingText="Registrando…"
          >
            Registrar
          </Button>
          <p className="text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="font-medium text-brand-700 underline-offset-4 hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
