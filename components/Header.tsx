"use client";

import { useState, useEffect } from "react";
import { Menu, X, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#ai-generator", label: "Create" },
  { href: "#gallery", label: "Gallery" },
  { href: "#benefits", label: "Why Color" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToGenerator = () => {
    setIsMobileMenuOpen(false);
    document.getElementById("ai-generator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled ? "py-2.5" : "py-4",
      )}
    >
      <div className="container-custom">
        <div
          className={cn(
            "flex items-center justify-between rounded-full border transition-all duration-300",
            isScrolled
              ? "border-border bg-background/80 px-4 py-2 shadow-soft backdrop-blur-xl"
              : "border-transparent px-2 py-1",
          )}
        >
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="ColorMagic Home"
          >
            <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight">
              Color<span className="text-primary">Magic</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button variant="hero" size="sm" onClick={scrollToGenerator}>
              <Wand2 aria-hidden="true" />
              Create now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          id="mobile-menu"
          className={cn(
            "overflow-hidden transition-all duration-300 md:hidden",
            isMobileMenuOpen ? "mt-3 max-h-96" : "max-h-0",
          )}
        >
          <div className="rounded-3xl border border-border bg-card p-4 shadow-card">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <Button variant="hero" className="mt-3 w-full" onClick={scrollToGenerator}>
              <Wand2 aria-hidden="true" />
              Create now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
