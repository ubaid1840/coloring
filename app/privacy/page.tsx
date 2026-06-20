"use client"
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { Shield, Lock, Eye, Mail } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy — ColoringFunAI</title>
        <meta name="description" content="How ColoringFunAI handles your data: minimal collection, local-only AI history, no tracking cookies, no account required." />
        <link rel="canonical" href="https://coloringfunai.lovable.app/privacy" />
        <meta property="og:title" content="Privacy Policy — ColoringFunAI" />
        <meta property="og:description" content="How ColoringFunAI handles your data: minimal collection, local-only AI history, no tracking cookies." />
        <meta property="og:url" content="https://coloringfunai.lovable.app/privacy" />
      </Helmet>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-custom max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none">
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl m-0">Information We Collect</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                ColoringFunAI is committed to protecting your privacy. We collect minimal information 
                to provide you with the best experience:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li><strong>Usage Data:</strong> Anonymous statistics about which coloring pages are most popular to help us improve our offerings.</li>
                <li><strong>AI Generation History:</strong> Your generated coloring page prompts and images are stored locally in your browser to provide a history feature. This data never leaves your device.</li>
                <li><strong>Technical Data:</strong> Basic browser and device information to ensure our website functions correctly.</li>
              </ul>
            </section>

            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl m-0">How We Protect Your Data</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We take data security seriously. All data transmission is encrypted using industry-standard 
                SSL/TLS protocols. We do not sell, trade, or rent your personal information to third parties. 
                ColoringFunAI does not require account registration, so we do not store passwords or personal 
                identifiers.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl mb-4">Cookies and Local Storage</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use browser local storage to save your AI generation history and preferences. 
                This allows you to access your previously created coloring pages when you return. 
                You can clear this data at any time through your browser settings. We do not use 
                tracking cookies or third-party analytics that follow you across the web.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl mb-4">Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                ColoringFunAI uses AI services to generate custom coloring pages. When you use our AI generator, 
                your prompts are sent to our secure backend for processing. We do not retain your prompts 
                or generated images on our servers after processing is complete — they are only stored in 
                your local browser history.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                ColoringFunAI is designed to be family-friendly. We do not knowingly collect personal 
                information from children under 13. Since our service requires no registration and stores 
                data only locally, children can safely browse and download coloring pages under parental guidance.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl mb-4">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to access, modify, or delete your data at any time. Since your 
                generation history is stored locally in your browser, you can clear it by clearing your 
                browser's local storage or using the history management features on our site.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl m-0">Contact Us</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or how we handle your data, 
                please contact us at{" "}
                <a href="mailto:hello@coloringfunai.com" className="text-primary hover:underline">
                  hello@coloringfunai.com
                </a>.
              </p>
            </section>
          </div>
          <AdPlaceholder size="leaderboard" label="Advertisement" />
        </div>
      </main>
      <Footer />
    </div>
  );
};


