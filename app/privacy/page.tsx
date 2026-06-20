import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — ColorMagic",
  description:
    "How ColorMagic handles your data: minimal collection, local-only AI history, no tracking cookies, no account required.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-28 pb-16">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-12">
            <div className="mb-6 inline-flex size-16 items-center justify-center rounded-3xl bg-primary/10">
              <Shield className="size-8 text-primary" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Privacy Policy</h1>
            <p className="mt-4 text-muted-foreground">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="mb-10">
              <div className="mb-4 flex items-center gap-3">
                <Eye className="size-5 text-primary" />
                <h2 className="m-0 font-display text-2xl font-semibold">Information We Collect</h2>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                ColorMagic is committed to protecting your privacy. We collect minimal information to
                provide you with the best experience:
              </p>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                <li>
                  <strong>Usage Data:</strong> Anonymous statistics about which coloring pages are most
                  popular to help us improve our offerings.
                </li>
                <li>
                  <strong>AI Generation History:</strong> Your generated coloring page prompts and images
                  are stored locally in your browser to provide a history feature. This data never leaves
                  your device.
                </li>
                <li>
                  <strong>Technical Data:</strong> Basic browser and device information to ensure our
                  website functions correctly.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <div className="mb-4 flex items-center gap-3">
                <Lock className="size-5 text-primary" />
                <h2 className="m-0 font-display text-2xl font-semibold">How We Protect Your Data</h2>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                We take data security seriously. All data transmission is encrypted using industry-standard
                SSL/TLS protocols. We do not sell, trade, or rent your personal information to third parties.
                ColorMagic does not require account registration, so we do not store passwords or personal
                identifiers.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-4 font-display text-2xl font-semibold">Cookies and Local Storage</h2>
              <p className="leading-relaxed text-muted-foreground">
                We use browser local storage to save your AI generation history and preferences. This allows
                you to access your previously created coloring pages when you return. You can clear this data
                at any time through your browser settings. We do not use tracking cookies or third-party
                analytics that follow you across the web.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-4 font-display text-2xl font-semibold">Third-Party Services</h2>
              <p className="leading-relaxed text-muted-foreground">
                ColorMagic uses AI services to generate custom coloring pages. When you use our AI generator,
                your prompts are sent to our secure backend for processing. We do not retain your prompts or
                generated images on our servers after processing is complete — they are only stored in your
                local browser history.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-4 font-display text-2xl font-semibold">Children&apos;s Privacy</h2>
              <p className="leading-relaxed text-muted-foreground">
                ColorMagic is designed to be family-friendly. We do not knowingly collect personal information
                from children under 13. Since our service requires no registration and stores data only
                locally, children can safely browse and download coloring pages under parental guidance.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="mb-4 font-display text-2xl font-semibold">Your Rights</h2>
              <p className="leading-relaxed text-muted-foreground">
                You have the right to access, modify, or delete your data at any time. Since your generation
                history is stored locally in your browser, you can clear it by clearing your browser&apos;s
                local storage or using the history management features on our site.
              </p>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-3">
                <Mail className="size-5 text-primary" />
                <h2 className="m-0 font-display text-2xl font-semibold">Contact Us</h2>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                If you have any questions about this Privacy Policy or how we handle your data, please contact
                us at{" "}
                <a href="mailto:hello@colormagic.app" className="text-primary hover:underline">
                  hello@colormagic.app
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
