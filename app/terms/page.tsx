"use client"
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { FileText, Palette, Users, AlertTriangle } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Terms of Service — ColoringFunAI</title>
        <meta name="description" content="Terms governing your use of ColoringFunAI — free coloring pages and AI generator for personal, educational, non-commercial use." />
        <link rel="canonical" href="https://coloringfunai.lovable.app/terms" />
        <meta property="og:title" content="Terms of Service — ColoringFunAI" />
        <meta property="og:description" content="Terms governing use of ColoringFunAI — free coloring pages for personal and educational use." />
        <meta property="og:url" content="https://coloringfunai.lovable.app/terms" />
      </Helmet>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-custom max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none">
            <section className="mb-10">
              <p className="text-muted-foreground leading-relaxed">
                Welcome to ColoringFunAI! By accessing or using our website, you agree to be bound by these 
                Terms of Service. If you do not agree with any part of these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Palette className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl m-0">Our Services</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                ColoringFunAI provides free printable coloring pages and AI-powered coloring page generation. 
                All services are offered at no cost and require no registration. We reserve the right to 
                modify, suspend, or discontinue any part of our services at any time.
              </p>
            </section>

            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl m-0">Acceptable Use</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                You agree to use ColoringFunAI only for lawful purposes. When using our AI generator, you agree not to:
              </p>
              <ul className="text-muted-foreground space-y-2 mt-4">
                <li>Generate content that is illegal, harmful, threatening, abusive, or discriminatory.</li>
                <li>Create coloring pages depicting violence, explicit content, or adult themes.</li>
                <li>Attempt to overload, damage, or interfere with our servers or networks.</li>
                <li>Use automated scripts or bots to access our services without permission.</li>
                <li>Resell or commercially redistribute our free coloring page designs as digital products.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Our Content:</strong> The coloring page designs, website branding, and original content 
                on ColoringFunAI are protected by copyright. You may download and print our coloring pages for 
                personal, educational, and non-commercial use. You may not claim ownership of our designs or 
                sell unmodified coloring pages as your own products.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong>AI-Generated Content:</strong> Coloring pages you create using our AI generator are 
                provided for your personal use. You may print, color, and share your creations. We grant you 
                a personal, non-exclusive license to use AI-generated content from our service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl mb-4">Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                ColoringFunAI is provided "as is" and "as available" without warranties of any kind. While we 
                strive for high-quality outputs, AI-generated coloring pages may occasionally contain unexpected 
                results. We do not guarantee that our services will be uninterrupted, timely, secure, or error-free.
              </p>
            </section>

            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl m-0">Limitation of Liability</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, ColoringFunAI and its operators shall not be liable 
                for any indirect, incidental, special, consequential, or punitive damages arising from your 
                use of our services. Our total liability shall not exceed the amount you paid for our services 
                (which is zero, as ColoringFunAI is completely free).
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-2xl mb-4">Changes to These Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these Terms of Service from time to time. We will notify users of significant 
                changes by updating the "Last updated" date at the top of this page. Your continued use of 
                ColoringFunAI after changes constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at{" "}
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

