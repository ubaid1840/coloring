import { Sparkles, Heart } from "lucide-react";

const linkGroups = [
  {
    title: "Explore",
    links: [
      { href: "#ai-generator", label: "AI Generator" },
      { href: "#gallery", label: "Gallery" },
      { href: "#benefits", label: "Why Color" },
      { href: "#faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card py-14 md:py-16" role="contentinfo">
      <div className="container-custom">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="/" className="flex items-center gap-2" aria-label="ColorMagic Home">
              <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight">
                Color<span className="text-primary">Magic</span>
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Turn any idea into a free, printable coloring page in seconds. Made for curious kids
              and creative teens.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            {linkGroups.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-foreground/80 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} ColorMagic. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            Made with <Heart className="size-4 text-primary" aria-label="love" /> for creative kids
          </p>
        </div>
      </div>
    </footer>
  );
}
