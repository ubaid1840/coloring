import { Button } from "@/components/ui/button";
import { ArrowDown, Palette } from "lucide-react";

export function HeroSection() {
  const scrollToGenerator = () => {
    document.getElementById("ai-generator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 animate-float" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-accent/5 animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-secondary animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <div className="container-custom relative z-10 text-center pt-24 pb-10 sm:pt-28 md:pt-32 md:pb-16">
        <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-6 opacity-0 animate-fade-in">
          <Palette className="w-4 h-4 text-primary" aria-hidden="true" />
          <span className="text-sm font-medium text-secondary-foreground">
            100% Free • No Sign-up Required
          </span>
        </div>

        <h1
          id="hero-heading"
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight text-balance opacity-0 animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          Free Printable{" "}
          <span className="text-primary">Coloring Pages</span>{" "}
          for Everyone
        </h1>

        <p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          Discover a vast collection of beautiful designs—from intricate mandalas to geometric patterns.
          Download, print, and start coloring today for relaxation and creative expression.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          <Button variant="hero" size="xl" onClick={scrollToGenerator}>
            Create with AI
            <ArrowDown className="w-5 h-5 ml-1" aria-hidden="true" />
          </Button>
          <Button variant="outline" size="xl" asChild>
            <a href="#benefits">Learn the Benefits</a>
          </Button>
        </div>

        <div
          className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground opacity-0 animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif text-foreground">Instant</span>
            <span>Download</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif text-foreground">PDF</span>
            <span>High Quality</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif text-foreground">All</span>
            <span>Ages Welcome</span>
          </div>
        </div>
      </div>
    </section>
  );
}
