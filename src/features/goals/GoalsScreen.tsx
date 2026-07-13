"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Check, Droplets, Flame, Info, Loader2, Scale, Beef } from "lucide-react";
import { toast } from "sonner";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptionField } from "./OptionField";
import { MacrosDonut } from "./MacrosDonut";
import { ACTIVITY_OPTIONS, OBJECTIVE_OPTIONS, SEX_OPTIONS } from "./labels";
import { calculateGoals, type GoalsResult } from "@/utils/nutrition";
import { useProgressStore } from "@/stores";
import { DISCLAIMER } from "@/config/app";
import { formatMl } from "@/utils/format";
import { cn } from "@/lib/utils";

/** Aceita "68" e "68,5": o brasileiro digita com vírgula. */
const toNumber = (value: string): number =>
  Number.parseFloat(value.trim().replace(",", "."));

const isNumeric = (value: string): boolean => Number.isFinite(toNumber(value));

const inRange = (value: string, min: number, max: number): boolean => {
  const parsed = toNumber(value);
  return parsed >= min && parsed <= max;
};

const goalsSchema = z.object({
  weightKg: z
    .string()
    .min(1, "Informe o seu peso.")
    .refine(isNumeric, "Use apenas números, por exemplo 68,5.")
    .refine(
      (value) => inRange(value, 30, 300),
      "O peso deve ficar entre 30 kg e 300 kg.",
    ),
  heightCm: z
    .string()
    .min(1, "Informe a sua altura.")
    .refine(isNumeric, "Use apenas números, por exemplo 165.")
    .refine(
      (value) => inRange(value, 120, 230),
      "A altura deve ficar entre 120 cm e 230 cm.",
    ),
  ageYears: z
    .string()
    .min(1, "Informe a sua idade.")
    .refine(isNumeric, "Use apenas números, por exemplo 31.")
    .refine(
      (value) => inRange(value, 14, 100),
      "A idade deve ficar entre 14 e 100 anos.",
    ),
  sex: z.enum(["feminino", "masculino"]),
  objective: z.enum(["emagrecimento", "manutencao", "hipertrofia"]),
  activityLevel: z.enum([
    "sedentario",
    "leve",
    "moderado",
    "intenso",
    "atleta",
  ]),
});

type GoalsValues = z.infer<typeof goalsSchema>;

export function GoalsScreen() {
  const setGoals = useProgressStore((state) => state.setGoals);

  const [result, setResult] = useState<GoalsResult | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GoalsValues>({
    resolver: zodResolver(goalsSchema),
    defaultValues: {
      weightKg: "68",
      heightCm: "165",
      ageYears: "31",
      sex: "feminino",
      objective: "emagrecimento",
      activityLevel: "moderado",
    },
  });

  const onSubmit = async (values: GoalsValues) => {
    // Pequena espera proposital: dá ao cálculo o mesmo ritmo do resto do app.
    await new Promise((resolve) => setTimeout(resolve, 450));

    setResult(
      calculateGoals({
        weightKg: toNumber(values.weightKg),
        heightCm: toNumber(values.heightCm),
        ageYears: Math.round(toNumber(values.ageYears)),
        sex: values.sex,
        objective: values.objective,
        activityLevel: values.activityLevel,
      }),
    );
    setApplied(false);
  };

  useEffect(() => {
    if (!result) return;
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  const applyGoals = () => {
    if (!result) return;
    setGoals({
      waterGoalMl: result.waterGoalMl,
      proteinGoalGrams: result.proteinGoalGrams,
    });
    setApplied(true);
    toast.success("Metas aplicadas", {
      description: "Água e proteína já aparecem atualizadas na sua Home.",
    });
  };

  return (
    <div className="pb-10">
      <ScreenHeader
        title="Calculadora de metas"
        subtitle="Estimativa educativa, em segundos"
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-5 pt-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="weightKg" className="text-xs font-semibold">
              Peso (kg)
            </Label>
            <Input
              id="weightKg"
              inputMode="decimal"
              autoComplete="off"
              placeholder="68"
              aria-invalid={Boolean(errors.weightKg)}
              className="tabular h-12 rounded-xl bg-card"
              {...register("weightKg")}
            />
            {errors.weightKg ? (
              <p role="alert" className="text-xs font-medium text-destructive">
                {errors.weightKg.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="heightCm" className="text-xs font-semibold">
              Altura (cm)
            </Label>
            <Input
              id="heightCm"
              inputMode="numeric"
              autoComplete="off"
              placeholder="165"
              aria-invalid={Boolean(errors.heightCm)}
              className="tabular h-12 rounded-xl bg-card"
              {...register("heightCm")}
            />
            {errors.heightCm ? (
              <p role="alert" className="text-xs font-medium text-destructive">
                {errors.heightCm.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          <Label htmlFor="ageYears" className="text-xs font-semibold">
            Idade
          </Label>
          <Input
            id="ageYears"
            inputMode="numeric"
            autoComplete="off"
            placeholder="31"
            aria-invalid={Boolean(errors.ageYears)}
            className="tabular h-12 rounded-xl bg-card"
            {...register("ageYears")}
          />
          {errors.ageYears ? (
            <p role="alert" className="text-xs font-medium text-destructive">
              {errors.ageYears.message}
            </p>
          ) : null}
        </div>

        <div className="mt-5">
          <OptionField
            legend="Sexo"
            options={SEX_OPTIONS}
            registration={register("sex")}
            error={errors.sex?.message}
          />
        </div>

        <div className="mt-5">
          <OptionField
            legend="Objetivo"
            options={OBJECTIVE_OPTIONS}
            registration={register("objective")}
            columns={1}
            error={errors.objective?.message}
          />
        </div>

        <div className="mt-5">
          <OptionField
            legend="Nível de atividade"
            options={ACTIVITY_OPTIONS}
            registration={register("activityLevel")}
            columns={1}
            error={errors.activityLevel?.message}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 h-12 w-full rounded-xl text-sm font-bold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Calculando
            </>
          ) : result ? (
            "Recalcular metas"
          ) : (
            "Calcular minhas metas"
          )}
        </Button>
      </form>

      {result ? (
        <motion.section
          ref={resultRef}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="scroll-mt-4 px-5 pt-8"
          aria-label="Resultado estimado"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-extrabold tracking-tight">
              Sua estimativa
            </h2>
            {applied ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--leaf-soft)] px-2.5 py-1 text-[11px] font-bold text-primary">
                <Check className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden />
                Aplicada
              </span>
            ) : null}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <ResultCard
              label="IMC"
              value={result.bmi.toLocaleString("pt-BR", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
              hint={result.bmiLabel}
              icon={Scale}
              tone="leaf"
            />
            <ResultCard
              label="Calorias"
              value={`${result.targetCalories}`}
              unit="kcal"
              hint="Estimativa para o objetivo"
              icon={Flame}
              tone="streak"
            />
            <ResultCard
              label="Água"
              value={formatMl(result.waterGoalMl)}
              hint="Meta diária"
              icon={Droplets}
              tone="water"
            />
            <ResultCard
              label="Proteína"
              value={`${result.proteinGoalGrams}g`}
              hint="Meta diária"
              icon={Beef}
              tone="protein"
            />
          </div>

          <div className="mt-3">
            <MacrosDonut
              proteinGrams={result.proteinGoalGrams}
              carbGrams={result.carbGoalGrams}
              fatGrams={result.fatGoalGrams}
              targetCalories={result.targetCalories}
            />
          </div>

          <div className="mt-3 flex gap-3 rounded-2xl border border-border/70 bg-secondary/40 p-4">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              {DISCLAIMER}
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="mt-4 h-12 w-full rounded-xl text-sm font-bold"
          >
            Aplicar essas metas no meu app
          </Button>
        </motion.section>
      ) : null}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Aplicar as metas estimadas?"
        description={
          result
            ? `Sua meta de água passa para ${formatMl(result.waterGoalMl)} e a de proteína para ${result.proteinGoalGrams}g por dia. Você pode recalcular quando quiser.`
            : ""
        }
        confirmLabel="Aplicar metas"
        cancelLabel="Agora não"
        onConfirm={applyGoals}
      />
    </div>
  );
}

type ResultTone = "water" | "protein" | "streak" | "leaf";

const RESULT_TONE: Record<ResultTone, string> = {
  water: "bg-[var(--water-soft)] text-[var(--water)]",
  protein: "bg-[var(--protein-soft)] text-[var(--protein)]",
  streak: "bg-[var(--streak-soft)] text-[var(--streak)]",
  leaf: "bg-[var(--leaf-soft)] text-[var(--leaf)]",
};

function ResultCard({
  label,
  value,
  unit,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  unit?: string;
  hint: string;
  icon: typeof Droplets;
  tone: ResultTone;
}) {
  return (
    <div className="surface-card p-4">
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          RESULT_TONE[tone],
        )}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden />
      </span>

      <p className="mt-3 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="tabular mt-0.5 text-xl font-extrabold leading-tight tracking-tight">
        {value}
        {unit ? (
          <span className="ml-1 text-sm font-bold text-muted-foreground">
            {unit}
          </span>
        ) : null}
      </p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}
