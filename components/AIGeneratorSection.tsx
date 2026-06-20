"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Wand2,
  Download,
  Loader2,
  RefreshCw,
  FileText,
  Sparkles,
  PawPrint,
  Crown,
  Shield,
  Gamepad2,
  Clapperboard,
  Car,
  Bird,
  BookOpen,
  Leaf,
  Library,
  Castle,
  ToyBrick,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { useGenerationHistory } from "@/hooks/use-generation-history";
import { GenerationHistory } from "@/components/GenerationHistory";

const categories = [
  { id: "animals", label: "Animals", icon: PawPrint },
  { id: "disney", label: "Disney", icon: Castle },
  { id: "superheroes", label: "Super Heroes", icon: Shield },
  { id: "videogames", label: "Video Games", icon: Gamepad2 },
  { id: "movies", label: "Movies / TV", icon: Clapperboard },
  { id: "vehicles", label: "Vehicles", icon: Car },
  { id: "dinosaurs", label: "Dinosaurs", icon: Bird },
  { id: "educational", label: "Educational", icon: Library },
  { id: "nature", label: "Nature", icon: Leaf },
  { id: "books", label: "Books", icon: BookOpen },
  { id: "princesses", label: "Princesses", icon: Crown },
  { id: "toys", label: "Toys", icon: ToyBrick },
];

const ageGroups = [
  { id: "kids", label: "Kids (3-8)", description: "Big, simple shapes" },
  { id: "adults", label: "Teens & Adults", description: "Intricate details" },
];

const promptIdeas = [
  "A skateboarding dinosaur",
  "A unicorn eating ice cream",
  "A robot playing soccer",
  "A castle in the clouds",
];

export function AIGeneratorSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("animals");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>("kids");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const { history, addToHistory, removeFromHistory, clearHistory } = useGenerationHistory();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-coloring-page", {
        body: {
          category: selectedCategory,
          customPrompt: customPrompt || undefined,
          ageGroup: selectedAgeGroup,
        },
      });

      if (error) {
        console.error("Function error:", error);
        throw new Error(error.message || "Failed to generate coloring page");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);

        const categoryLabel =
          categories.find((c) => c.id === selectedCategory)?.label || selectedCategory;
        addToHistory({
          imageUrl: data.imageUrl,
          category: selectedCategory,
          categoryLabel,
          ageGroup: selectedAgeGroup,
          customPrompt: customPrompt || undefined,
        });

        toast.success("Your coloring page is ready!");
      } else {
        throw new Error("No image received");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!generatedImage) return;

    try {
      toast.info("Preparing high-quality PDF for printing...");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
        compress: false,
      });

      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = generatedImage;
      });

      const pageWidth = 8.5;
      const pageHeight = 11;
      const margin = 0.5;
      const maxWidth = pageWidth - 2 * margin;
      const maxHeight = pageHeight - 2 * margin - 0.5;

      const imgAspect = img.width / img.height;
      let imgWidth = maxWidth;
      let imgHeight = imgWidth / imgAspect;

      if (imgHeight > maxHeight) {
        imgHeight = maxHeight;
        imgWidth = imgHeight * imgAspect;
      }

      const x = (pageWidth - imgWidth) / 2;
      const y = margin + (maxHeight - imgHeight) / 2;

      pdf.addImage(generatedImage, "PNG", x, y, imgWidth, imgHeight, undefined, "FAST");

      pdf.setFontSize(8);
      pdf.setTextColor(180, 180, 180);
      pdf.text("ColorMagic — Free Printable Coloring Pages", pageWidth / 2, pageHeight - 0.25, {
        align: "center",
      });

      pdf.setProperties({
        title: `ColorMagic - ${categories.find((c) => c.id === selectedCategory)?.label} Coloring Page`,
        subject: "Free Printable Coloring Page",
        creator: "ColorMagic",
        keywords: "coloring page, printable, free, kids, teens",
      });

      const categoryLabel =
        categories.find((c) => c.id === selectedCategory)?.label || selectedCategory;
      pdf.save(`colormagic-${categoryLabel.toLowerCase().replace(/\s+/g, "-")}-coloring-page.pdf`);

      toast.success("High-quality PDF ready for printing!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to create PDF. Please try again.");
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `colormagic-${selectedCategory}-coloring-page.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  return (
    <section
      id="ai-generator"
      className="scroll-mt-24 py-16 md:py-24"
      aria-labelledby="ai-generator-heading"
    >
      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
            <Sparkles className="size-4" aria-hidden="true" />
            <span className="text-sm font-semibold">AI Magic Studio</span>
          </div>
          <h2
            id="ai-generator-heading"
            className="font-display text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl"
          >
            Create your own coloring page
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground text-pretty">
            Pick who it&apos;s for, choose a theme, add your idea, and let the AI do the magic.
          </p>
        </div>

        <div
          className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-card"
          data-reveal
        >
          <div className="grid gap-0 lg:grid-cols-5">
            {/* Controls */}
            <div className="space-y-8 p-6 sm:p-8 lg:col-span-3">
              {/* Age group */}
              <div>
                <h3 className="mb-3 font-display text-lg font-semibold">1. Who is this for?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {ageGroups.map((age) => (
                    <button
                      key={age.id}
                      onClick={() => setSelectedAgeGroup(age.id)}
                      aria-pressed={selectedAgeGroup === age.id}
                      className={cn(
                        "rounded-2xl border-2 p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        selectedAgeGroup === age.id
                          ? "border-primary bg-primary/5 shadow-soft"
                          : "border-border bg-background hover:border-primary/40",
                      )}
                    >
                      <span className="block font-semibold">{age.label}</span>
                      <span className="text-sm text-muted-foreground">{age.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <h3 className="mb-3 font-display text-lg font-semibold">2. Choose a theme</h3>
                <div
                  className="flex flex-wrap gap-2"
                  role="radiogroup"
                  aria-label="Coloring page categories"
                >
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        role="radio"
                        aria-checked={selectedCategory === category.id}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          selectedCategory === category.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background hover:border-primary/40",
                        )}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                        {category.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom prompt */}
              <div>
                <label htmlFor="custom-prompt" className="mb-3 block font-display text-lg font-semibold">
                  3. Add your idea{" "}
                  <span className="font-sans text-sm font-normal text-muted-foreground">
                    (optional)
                  </span>
                </label>
                <input
                  id="custom-prompt"
                  type="text"
                  placeholder="e.g., a friendly dragon baking cupcakes..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full rounded-2xl border-2 border-border bg-background p-4 text-base placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {promptIdeas.map((idea) => (
                    <button
                      key={idea}
                      onClick={() => setCustomPrompt(idea)}
                      className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/70"
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="hero"
                size="xl"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    Creating your page...
                  </>
                ) : (
                  <>
                    <Wand2 aria-hidden="true" />
                    Generate coloring page
                  </>
                )}
              </Button>
            </div>

            {/* Preview */}
            <div className="flex flex-col border-t border-border bg-secondary/40 p-6 sm:p-8 lg:col-span-2 lg:border-l lg:border-t-0">
              <h3 className="mb-4 font-display text-lg font-semibold">Preview</h3>
              <div className="flex flex-1 flex-col">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-dashed border-border bg-card">
                  {isGenerating ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                      <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
                      <p className="text-sm font-medium">Drawing your masterpiece...</p>
                    </div>
                  ) : generatedImage ? (
                    <img
                      src={generatedImage || "/placeholder.svg"}
                      alt="AI-generated coloring page"
                      className="size-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-muted-foreground">
                      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Wand2 className="size-7" aria-hidden="true" />
                      </span>
                      <p className="text-sm">
                        Your coloring page will appear here once you hit generate.
                      </p>
                    </div>
                  )}
                </div>

                {generatedImage && !isGenerating && (
                  <div className="mt-4 flex flex-col gap-2 animate-fade-in">
                    <Button variant="default" onClick={handleDownloadPDF}>
                      <FileText aria-hidden="true" />
                      Download PDF
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={handleDownloadImage}>
                        <Download aria-hidden="true" />
                        PNG
                      </Button>
                      <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                      >
                        <RefreshCw aria-hidden="true" />
                        Again
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-5xl">
          <GenerationHistory history={history} onRemove={removeFromHistory} onClear={clearHistory} />
        </div>
      </div>
    </section>
  );
}
