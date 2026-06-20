import { Download, Heart, Sparkles, Palette, Clock, Users } from "lucide-react";

const benefits = [
  {
    icon: Heart,
    title: "Stress Relief",
    description: "Coloring activates relaxation areas in the brain, reducing anxiety and promoting calmness.",
  },
  {
    icon: Sparkles,
    title: "Boost Creativity",
    description: "Explore color combinations and express yourself freely through art therapy.",
  },
  {
    icon: Palette,
    title: "Mindful Focus",
    description: "Enter a meditative state as you concentrate on patterns and colors.",
  },
  {
    icon: Clock,
    title: "Quality Time",
    description: "Perfect activity to share with family or enjoy peaceful moments alone.",
  },
  {
    icon: Users,
    title: "All Ages Welcome",
    description: "From kids to adults, our designs cater to every skill level and preference.",
  },
  {
    icon: Download,
    title: "Instant Access",
    description: "Download and print immediately—no account or payment required.",
  },
];

export function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="py-20 md:py-28 bg-secondary/50"
      aria-labelledby="benefits-heading"
    >
      <div className="container-custom">
        <div className="text-center mb-16" data-reveal>
          <h2
            id="benefits-heading"
            className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4"
          >
            Why Coloring Is Good for You
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the therapeutic benefits of coloring for your mind and well-being.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <article
              key={benefit.title}
              className="group bg-card rounded-xl p-6 md:p-8 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <benefit.icon
                  className="w-6 h-6 text-primary"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-serif text-xl mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
