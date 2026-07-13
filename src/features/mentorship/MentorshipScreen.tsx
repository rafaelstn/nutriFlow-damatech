"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  MessageCircle,
  Quote,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Monogram } from "@/components/common/Monogram";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NUTRITIONIST, whatsappUrl } from "@/config/app";

const BENEFITS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ClipboardList,
    title: "Plano personalizado",
    description:
      "Construído a partir da sua rotina, do seu histórico e do que você realmente gosta de comer.",
  },
  {
    icon: UserRoundCheck,
    title: "Acompanhamento próximo",
    description:
      "Alguém olhando o seu processo de perto, semana a semana, sem você se sentir sozinha.",
  },
  {
    icon: RefreshCw,
    title: "Ajustes durante a evolução",
    description:
      "O plano muda quando o seu corpo e a sua agenda mudam. Nada fica engessado.",
  },
  {
    icon: MessageCircle,
    title: "Contato direto",
    description:
      "Dúvida na hora do mercado ou do restaurante? Você fala com a profissional, não com um robô.",
  },
];

/** Depoimentos ilustrativos: esta é uma demonstração, não há paciente real. */
const TESTIMONIALS: { name: string; initials: string; quote: string }[] = [
  {
    name: "Camila R.",
    initials: "CR",
    quote:
      "Parei de improvisar o almoço. Ter um plano pensado para a minha rotina tirou o peso da decisão todo dia.",
  },
  {
    name: "Juliana M.",
    initials: "JM",
    quote:
      "O que mudou foi o acompanhamento. Quando eu travava, tinha para quem perguntar no mesmo dia.",
  },
];

export function MentorshipScreen() {
  return (
    <div className="pb-10">
      <ScreenHeader title="Atendimento personalizado" />

      <section
        className="relative overflow-hidden px-5 pb-8 pt-8"
        aria-label="Acompanhamento individual"
      >
        {/* Respiro de marca no topo: cor da folha, sem gradiente berrante. */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-[var(--leaf-soft)] to-background"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-card px-3 py-1.5 text-[11px] font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
            Vagas com acompanhamento individual
          </span>

          <h1 className="mt-4 text-[26px] font-extrabold leading-[1.15] tracking-tight">
            Quer um plano feito exclusivamente para você?
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            Tenha acompanhamento individual, estratégias personalizadas e contato
            direto durante sua evolução.
          </p>

          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants(),
              "mt-6 h-auto min-h-[52px] w-full rounded-2xl text-sm font-bold shadow-[var(--shadow-float)]",
            )}
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.4} aria-hidden />
            Falar com a Nutri no WhatsApp
          </a>

          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            Conversa sem compromisso, direto com a profissional.
          </p>
        </motion.div>
      </section>

      <section className="px-5 pt-2" aria-label="O que está incluído">
        <h2 className="text-base font-extrabold tracking-tight">
          O que muda no acompanhamento
        </h2>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {BENEFITS.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.08 * index,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="surface-card p-4"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--leaf-soft)] text-primary">
                  <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>
                <p className="mt-3 text-sm font-bold leading-tight">
                  {benefit.title}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="px-5 pt-6" aria-label="Quem conduz o acompanhamento">
        <div className="surface-card flex items-start gap-4 p-5">
          <Monogram
            initials={NUTRITIONIST.initials}
            className="h-14 w-14 bg-primary text-base text-primary-foreground ring-2 ring-primary/20"
          />
          <div className="min-w-0">
            <p className="text-sm font-extrabold leading-tight">
              {NUTRITIONIST.name}
            </p>
            <p className="tabular mt-0.5 text-xs text-muted-foreground">
              {NUTRITIONIST.role}
              <span aria-hidden> · </span>
              {NUTRITIONIST.council}
            </p>
            <p className="mt-2.5 text-xs leading-relaxed text-foreground/80">
              Atendimento clínico e esportivo, com foco em rotina real: o plano
              precisa caber na sua semana para virar resultado.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pt-6" aria-label="Depoimentos">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-base font-extrabold tracking-tight">
            Quem já é acompanhada
          </h2>
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Ilustrativo
          </span>
        </div>

        <div className="mt-3 space-y-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="rounded-2xl border border-border/70 bg-secondary/40 p-4"
            >
              <Quote
                className="h-4 w-4 text-primary/50"
                strokeWidth={2.4}
                aria-hidden
              />
              <blockquote className="mt-2 text-sm leading-relaxed text-foreground/90">
                {testimonial.quote}
              </blockquote>
              <figcaption className="mt-3 flex items-center gap-2.5">
                <Monogram
                  initials={testimonial.initials}
                  className="h-8 w-8 text-xs"
                />
                <span className="text-xs font-bold">{testimonial.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          Depoimentos ilustrativos, criados para esta demonstração. Nenhum
          resultado individual é garantido.
        </p>
      </section>

      <section className="px-5 pt-7">
        <div className="rounded-2xl border border-primary/15 bg-[var(--leaf-soft)] p-5 text-center">
          <p className="text-base font-extrabold leading-tight tracking-tight">
            Vamos montar o seu plano?
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-foreground/75">
            Conte a sua rotina em poucas linhas. {NUTRITIONIST.shortName}{" "}
            responde pessoalmente.
          </p>

          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants(),
              "mt-4 h-12 w-full rounded-xl text-sm font-bold",
            )}
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.4} aria-hidden />
            Falar com a Nutri no WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
