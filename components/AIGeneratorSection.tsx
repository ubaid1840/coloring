import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2, Download, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { useGenerationHistory } from "@/hooks/use-generation-history";
import { GenerationHistory } from "@/components/GenerationHistory";

const categories = [
  { id: "animals", label: "Animals", emoji: "🐾" },
  { id: "disney", label: "Disney Characters", emoji: "✨" },
  { id: "superheroes", label: "Super Heroes", emoji: "🦸" },
  { id: "videogames", label: "Video Games", emoji: "🎮" },
  { id: "movies", label: "Movies/TV Shows", emoji: "🎬" },
  { id: "vehicles", label: "Vehicles", emoji: "🚗" },
  { id: "dinosaurs", label: "Dinosaurs", emoji: "🦕" },
  { id: "educational", label: "Educational", emoji: "📚" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "books", label: "Books", emoji: "📖" },
  { id: "princesses", label: "Princesses", emoji: "👑" },
  { id: "toys", label: "Toys", emoji: "🧸" },
];

const ageGroups = [
  { id: "kids", label: "Kids (3-8)", description: "Simple designs with large areas" },
  { id: "adults", label: "Teens & Adults", description: "Intricate patterns and details" },
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
        
        // Add to history
        const categoryLabel = categories.find((c) => c.id === selectedCategory)?.label || selectedCategory;
        addToHistory({
          imageUrl: data.imageUrl,
          category: selectedCategory,
          categoryLabel,
          ageGroup: selectedAgeGroup,
          customPrompt: customPrompt || undefined,
        });

        toast.success("Coloring page generated successfully!");
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

      // Create a high-quality PDF (letter size, 300 DPI equivalent)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
        compress: false, // Disable compression for higher quality
      });

      // Load the image at full resolution
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = generatedImage;
      });

      // Letter size dimensions
      const pageWidth = 8.5;
      const pageHeight = 11;
      const margin = 0.5;
      const maxWidth = pageWidth - 2 * margin;
      const maxHeight = pageHeight - 2 * margin - 0.5; // Extra space for footer

      // Calculate dimensions maintaining aspect ratio
      const imgAspect = img.width / img.height;
      let imgWidth = maxWidth;
      let imgHeight = imgWidth / imgAspect;

      if (imgHeight > maxHeight) {
        imgHeight = maxHeight;
        imgWidth = imgHeight * imgAspect;
      }

      // Center the image on the page
      const x = (pageWidth - imgWidth) / 2;
      const y = margin + (maxHeight - imgHeight) / 2;

      // Add image at highest quality
      pdf.addImage(generatedImage, "PNG", x, y, imgWidth, imgHeight, undefined, "FAST");

      // Add subtle print-friendly footer
      pdf.setFontSize(8);
      pdf.setTextColor(180, 180, 180);
      pdf.text("ColoringFunAI - 100% Free Printable Coloring Pages | coloringfunai.com", pageWidth / 2, pageHeight - 0.25, {
        align: "center",
      });

      // Add print optimization metadata
      pdf.setProperties({
        title: `ColoringFunAI - ${categories.find((c) => c.id === selectedCategory)?.label} Coloring Page`,
        subject: "Free Printable Coloring Page",
        creator: "ColoringFunAI",
        keywords: "coloring page, printable, free, kids, adults",
      });

      // Download the PDF
      const categoryLabel = categories.find((c) => c.id === selectedCategory)?.label || selectedCategory;
      pdf.save(`coloringfunai-${categoryLabel.toLowerCase().replace(/\s+/g, "-")}-coloring-page.pdf`);

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
    link.download = `colorjoy-${selectedCategory}-coloring-page.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  return (
    <section
      id="ai-generator"
      className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/30"
      aria-labelledby="ai-generator-heading"
    >
      <div className="container-custom">
        <div className="text-center mb-12" data-reveal>
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
            <Wand2 className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm font-medium">AI-Powered</span>
          </div>
          <h2
            id="ai-generator-heading"
            className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4"
          >
            Create Your Own Coloring Page
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Use AI to instantly generate unique, printable coloring pages. Choose a category,
            select difficulty, and download your custom creation as a high-quality PDF.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Age Group Selection */}
          <div className="mb-8">
            <h3 className="font-serif text-xl mb-4 text-center">Who is this for?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {ageGroups.map((age) => (
                <button
                  key={age.id}
                  onClick={() => setSelectedAgeGroup(age.id)}
                  className={cn(
                    "flex-1 max-w-xs p-4 rounded-xl border-2 transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selectedAgeGroup === age.id
                      ? "border-primary bg-primary/5 shadow-card"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <span className="font-medium block">{age.label}</span>
                  <span className="text-sm text-muted-foreground">{age.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div className="mb-8">
            <h3 className="font-serif text-xl mb-4 text-center">Choose a Category</h3>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
              role="radiogroup"
              aria-label="Coloring page categories"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  role="radio"
                  aria-checked={selectedCategory === category.id}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all duration-200 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selectedCategory === category.id
                      ? "border-primary bg-primary/5 shadow-card"
                      : "border-border bg-card hover:border-primary/50 hover:shadow-soft"
                  )}
                >
                  <span className="text-2xl block mb-1" aria-hidden="true">
                    {category.emoji}
                  </span>
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prompt (Optional) */}
          <div className="mb-8">
            <label htmlFor="custom-prompt" className="font-serif text-xl mb-4 block text-center">
              Custom Description <span className="text-muted-foreground font-sans text-base">(Optional)</span>
            </label>
            <input
              id="custom-prompt"
              type="text"
              placeholder="e.g., A cute dragon playing with butterflies..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full p-4 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Generate Button */}
          <div className="text-center mb-8">
            <Button
              variant="hero"
              size="xl"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="min-w-[200px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" aria-hidden="true" />
                  Generate Coloring Page
                </>
              )}
            </Button>
          </div>

          {/* Generated Image Preview */}
          {generatedImage && (
            <div className="bg-card rounded-2xl p-6 shadow-card opacity-0 animate-fade-in">
              <h3 className="font-serif text-xl mb-4 text-center">Your Coloring Page is Ready!</h3>
              <div className="aspect-square max-w-md mx-auto mb-6 rounded-xl overflow-hidden border border-border bg-white">
                <img
                  src={generatedImage}
                  alt="AI-generated coloring page"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="default" size="lg" onClick={handleDownloadPDF}>
                  <Download className="w-5 h-5" aria-hidden="true" />
                  Download PDF
                </Button>
                <Button variant="outline" size="lg" onClick={handleDownloadImage}>
                  <Download className="w-5 h-5" aria-hidden="true" />
                  Download Image
                </Button>
                <Button variant="secondary" size="lg" onClick={handleGenerate} disabled={isGenerating}>
                  <RefreshCw className={cn("w-5 h-5", isGenerating && "animate-spin")} aria-hidden="true" />
                  Generate Another
                </Button>
              </div>
            </div>
          )}

          {/* Generation History */}
          <GenerationHistory
            history={history}
            onRemove={removeFromHistory}
            onClear={clearHistory}
          />
        </div>
      </div>
    </section>
  );
}
