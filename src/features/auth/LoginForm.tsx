"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand/Logo";
import { useAuthStore } from "@/stores";
import { DEMO_CREDENTIALS } from "@/mocks/user";
import { ServiceError } from "@/services";
import { NUTRITIONIST } from "@/config/app";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Informe o seu e-mail.")
    .email("Digite um e-mail válido."),
  password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres."),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setFormError(null);
    try {
      await login(values);
      router.replace("/home");
    } catch (cause) {
      setFormError(
        cause instanceof ServiceError
          ? cause.message
          : "Não conseguimos entrar agora. Tente novamente.",
      );
    }
  };

  return (
    <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-6 pb-10 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Logo size="lg" />
        <h1 className="mt-9 text-[28px] font-extrabold leading-tight tracking-tight">
          Bem-vinda de volta
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Entre para continuar a sua evolução com {NUTRITIONIST.shortName}.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45, ease: "easeOut" }}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold">
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="seu@email.com"
            aria-invalid={Boolean(errors.email)}
            className="h-12 rounded-xl bg-card"
            {...register("email")}
          />
          {errors.email ? (
            <p role="alert" className="text-xs font-medium text-destructive">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold">
            Senha
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Sua senha"
              aria-invalid={Boolean(errors.password)}
              className="h-12 rounded-xl bg-card pr-12"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" aria-hidden />
              ) : (
                <Eye className="h-4.5 w-4.5" aria-hidden />
              )}
            </button>
          </div>
          {errors.password ? (
            <p role="alert" className="text-xs font-medium text-destructive">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        {formError ? (
          <p
            role="alert"
            className="rounded-xl bg-destructive/10 px-3.5 py-2.5 text-xs font-medium text-destructive"
          >
            {formError}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl text-sm font-bold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Entrando
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </motion.form>

      <div className="mt-auto pt-10">
        <div className="rounded-xl border border-dashed border-border bg-secondary/40 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Acesso de demonstração
          </p>
          <p className="tabular mt-1 text-xs text-foreground">
            {DEMO_CREDENTIALS.email} · {DEMO_CREDENTIALS.password}
          </p>
        </div>
      </div>
    </div>
  );
}
