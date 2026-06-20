import { Download, Heart, Sparkles, Palette, Clock, Users } from "lucide-react";

const benefits = [
  {
    icon: Heart,
    title: "Stress Relief",
    description: "Coloring calms the mind, easing anxiety and helping kids and teens unwind.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Sparkles,
    title: "Boost Creativity",
    description: "Mixing colors and ideas sparks imagination and free self-expression.",
    color: "text-accent",
    bg: "bg-accent/15",
  },
  {
    icon: Palette,
    title: "Mindful Focus",
    description: "Concentrating on patterns builds patience and a calm, focused mindset.",
    color: "text-grape",
    bg: "bg-grape/10",
  },
  {
    icon: Clock,
    title: "Quality Time",
    description: "A perfect screen-free activity to share with family or enjoy solo.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Users,
    title: "All Ages Welcome",
    description: "From toddlers to teens, every design adapts to any skill level.",
    color: "text-accent",
    bg: "bg-accent/15",
  },
  {
    icon: Download,
    title: "Instant Access",
    description: "Download and print right away. No account, no payment, ever.",
    color: "text-grape",
    bg: "bg-grape/10",
  },
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="scroll-mt-24 py-16 md:py-24" aria-labelledby="benefits-heading">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-sunny/25 px-4 py-2 text-sm font-semibold text-sunny-foreground">
            Good for body &amp; brain
          </span>
          <h2
            id="benefits-heading"
            className="font-display text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl"
          >
            Why coloring is so good for you
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground text-pretty">
            It&apos;s more than fun, coloring supports focus, calm, and creativity for every age.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <article
              key={benefit.title}
              className="group rounded-3xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card animate-fade-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div
                className={`mb-4 flex size-12 items-center justify-center rounded-2xl ${benefit.bg} ${benefit.color} transition-transform duration-300 group-hover:scale-110`}
              >
                <benefit.icon className="size-6" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-semibold">{benefit.title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
