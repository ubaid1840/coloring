"use client"
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AIGeneratorSection } from "@/components/AIGeneratorSection";
import { GallerySection } from "@/components/GallerySection";
import { EducationalResourcesSection } from "@/components/EducationalResourcesSection";
import { BenefitsSection } from "@/components/BenefitsSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const Index = () => {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free Printable Coloring Pages — ColoringFunAI</title>
        <meta name="description" content="Download 100% free printable coloring pages for kids and adults. Animals, Disney, superheroes, mandalas & more. PDF & PNG — no signup." />
        <link rel="canonical" href="https://coloringfunai.lovable.app/" />
        <meta property="og:title" content="Free Printable Coloring Pages — ColoringFunAI" />
        <meta property="og:description" content="Free printable coloring pages for kids and adults — instant PDF & PNG, no signup." />
        <meta property="og:url" content="https://coloringfunai.lovable.app/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "Are all coloring pages really free?", acceptedAnswer: { "@type": "Answer", text: "Yes! All our coloring pages are 100% free to download and print. No hidden fees, no subscriptions, and no account required." } },
            { "@type": "Question", name: "What format are the downloads in?", acceptedAnswer: { "@type": "Answer", text: "All coloring pages are available as high-resolution images optimized for printing on standard letter-size (8.5\" x 11\") or A4 paper." } },
            { "@type": "Question", name: "Can I use these for commercial purposes?", acceptedAnswer: { "@type": "Answer", text: "Our coloring pages are for personal use only, including printing for yourself, your family, classrooms, or therapy sessions. Contact us for commercial licensing." } },
            { "@type": "Question", name: "What age groups are these suitable for?", acceptedAnswer: { "@type": "Answer", text: "We have designs for all ages — simple patterns for children, medium-complexity designs for teens, and intricate mandalas for adults." } },
            { "@type": "Question", name: "How often do you add new designs?", acceptedAnswer: { "@type": "Answer", text: "We add 10-15 new coloring pages each week across all categories." } },
            { "@type": "Question", name: "What's the best way to print these pages?", acceptedAnswer: { "@type": "Answer", text: "For best results, print on white cardstock or heavier paper (80-100 lb) and set your printer to 'high quality' or 'best' mode." } }
          ]
        })}</script>
      </Helmet>
      <Header />
      <main id="main-content">
        <HeroSection />

        {/* Top leaderboard — desktop */}
        <div className="hidden md:block">
          <AdPlaceholder size="leaderboard" label="Sponsored" id="ad-top-desktop" />
        </div>
        {/* Top mobile banner — mobile only */}
        <div className="md:hidden">
          <AdPlaceholder size="mobile-banner" label="Sponsored" id="ad-top-mobile" />
        </div>

        <AIGeneratorSection />

        {/* Mid-page responsive */}
        <AdPlaceholder size="responsive" label="Advertisement" id="ad-mid-responsive" />

        <EducationalResourcesSection />

        {/* Medium rectangle — good fit beside content on desktop, centered on mobile */}
        <AdPlaceholder size="rectangle" label="Sponsored Content" id="ad-mid-rectangle" />

        <GallerySection />

        {/* Second leaderboard — desktop */}
        <div className="hidden md:block">
          <AdPlaceholder size="leaderboard" label="Advertisement" id="ad-bottom-desktop" />
        </div>
        <div className="md:hidden">
          <AdPlaceholder size="mobile-banner" label="Advertisement" id="ad-bottom-mobile" />
        </div>

        <BenefitsSection />
        <FAQSection />

        {/* Final mobile banner */}
        <AdPlaceholder size="mobile-banner" label="Sponsored" id="ad-final" />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
