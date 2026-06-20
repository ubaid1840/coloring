import { Palette, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 py-12 md:py-16" role="contentinfo">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8">
          {/* Brand */}
          <div>
            <a
              href="/"
              className="flex items-center gap-2 font-serif text-xl mb-4"
              aria-label="ColoringFunAI Home"
            >
              <Palette className="w-6 h-6 text-primary" aria-hidden="true" />
              <span>ColoringFunAI</span>
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your destination for free, high-quality printable coloring pages.
              Designed for relaxation, creativity, and mindful moments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg mb-4">Quick Links</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                <li>
                  <a
                    href="#gallery"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    Browse Gallery
                  </a>
                </li>
                <li>
                  <a
                    href="#benefits"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    Benefits of Coloring
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </nav>
          </div>

        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} ColoringFunAI. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-accent" aria-label="love" /> for creative souls
          </p>
        </div>
      </div>
    </footer>
  );
}
