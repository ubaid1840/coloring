"use client";

import { Button } from "@/components/ui/button";
import { Wand2, Sparkles, Download, Star } from "lucide-react";

const stats = [
  { value: "Instant", label: "AI results" },
  { value: "PDF + PNG", label: "Print-ready" },
  { value: "100% Free", label: "No sign-up" },
];

export function HeroSection() {
  const scrollToGenerator = () => {
    document.getElementById("ai-generator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 md:pt-40 md:pb-24"
      aria-labelledby="hero-heading"
    >
      {/* Decorative floating shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 -right-16 size-80 rounded-full bg-primary/15 blur-2xl animate-float" />
        <div
          className="absolute top-40 -left-24 size-72 rounded-full bg-accent/15 blur-2xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-0 right-1/3 size-64 rounded-full bg-sunny/20 blur-2xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-soft animate-fade-in">
            <span className="flex -space-x-1" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-primary" />
              <span className="size-2.5 rounded-full bg-accent" />
              <span className="size-2.5 rounded-full bg-sunny" />
              <span className="size-2.5 rounded-full bg-grape" />
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              AI coloring pages for kids &amp; teens
            </span>
          </div>

          <h1
            id="hero-heading"
            className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            Imagine it.{" "}
            <span className="relative whitespace-nowrap text-primary">
              Color it.
              <svg
                className="absolute -bottom-2 left-0 w-full text-sunny"
                viewBox="0 0 200 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 9C40 3 160 3 198 9"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            Type any idea, from a skateboarding dinosaur to a magical castle, and our AI
            turns it into a printable coloring page in seconds.
          </p>

          <div
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in"
            style={{ animationDelay: "300ms" }}
          >
            <Button variant="hero" size="xl" onClick={scrollToGenerator}>
              <Wand2 aria-hidden="true" />
              Start creating
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="#gallery">
                <Sparkles aria-hidden="true" />
                Browse gallery
              </a>
            </Button>
          </div>

          <dl
            className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-3 animate-fade-in"
            style={{ animationDelay: "400ms" }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-card px-2 py-4 shadow-soft"
              >
                <dt className="font-display text-lg font-bold text-foreground sm:text-xl">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Floating feature chips */}
        <div className="relative mx-auto mt-14 hidden h-36 max-w-4xl md:block" aria-hidden="true">
          <div className="absolute left-0 top-2 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-card animate-float">
            <Star className="size-4 text-sunny" />
            <span className="text-sm font-medium">Kid-safe prompts</span>
          </div>
          <div
            className="absolute right-0 top-0 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-card animate-float"
            style={{ animationDelay: "1.5s" }}
          >
            <Download className="size-4 text-accent" />
            <span className="text-sm font-medium">One-tap download</span>
          </div>
          <div
            className="absolute left-1/2 top-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-card animate-float"
            style={{ animationDelay: "3s" }}
          >
            <Wand2 className="size-4 text-primary" />
            <span className="text-sm font-medium">Made with AI</span>
          </div>
        </div>
      </div>
    </section>
  );
}
