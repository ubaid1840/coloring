import { useState } from "react";
import { Eye, FileText, Printer, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { coloringPages, categories, Category } from "@/data/coloringPagesData";

const INITIAL_ITEMS = 6;
const ITEMS_PER_LOAD = 6;

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_ITEMS);

  const filteredPages =
    activeCategory === "all"
      ? coloringPages
      : coloringPages.filter((page) => page.category === activeCategory);

  const visiblePages = filteredPages.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPages.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_LOAD);
  };

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    setVisibleCount(INITIAL_ITEMS);
  };

  const handleDownloadPDF = async (title: string, imageSrc: string, description: string) => {
    try {
      toast.info("Preparing high-quality PDF for printing...");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
        compress: false,
      });

      // Load the image
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageSrc;
      });

      // Page dimensions
      const pageWidth = 8.5;
      const pageHeight = 11;
      const margin = 0.5;
      const maxWidth = pageWidth - 2 * margin;
      const maxHeight = pageHeight - 2 * margin - 0.5;

      // Calculate dimensions maintaining aspect ratio
      const imgAspect = img.width / img.height;
      let imgWidth = maxWidth;
      let imgHeight = imgWidth / imgAspect;

      if (imgHeight > maxHeight) {
        imgHeight = maxHeight;
        imgWidth = imgHeight * imgAspect;
      }

      const x = (pageWidth - imgWidth) / 2;
      const y = margin + (maxHeight - imgHeight) / 2;

      // Add image at highest quality
      pdf.addImage(imageSrc, "JPEG", x, y, imgWidth, imgHeight, undefined, "FAST");

      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(180, 180, 180);
      pdf.text("ColoringFunAI - 100% Free Printable Coloring Pages | coloringfunai.com", pageWidth / 2, pageHeight - 0.25, {
        align: "center",
      });

      // PDF metadata
      pdf.setProperties({
        title: `ColoringFunAI - ${title}`,
        subject: description,
        creator: "ColoringFunAI",
        keywords: "coloring page, printable, free, relaxation",
      });

      pdf.save(`coloringfunai-${title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
      toast.success("High-quality PDF ready for printing!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to create PDF. Please try again.");
    }
  };

  const handleDownloadPNG = async (title: string, imageSrc: string) => {
    try {
      toast.info("Preparing PNG download...");

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new window.Image();
      img.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageSrc;
      });

      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) throw new Error("Failed to create PNG blob");
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `coloringfunai-${title.toLowerCase().replace(/\s+/g, "-")}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("PNG downloaded successfully!");
      }, "image/png");
    } catch (error) {
      console.error("PNG download error:", error);
      toast.error("Failed to download PNG. Please try again.");
    }
  };

  const handlePrint = (title: string, imageSrc: string) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>ColoringFunAI - ${title}</title>
            <style>
              @page { size: letter; margin: 0.5in; }
              body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
              img { max-width: 100%; max-height: 100%; object-fit: contain; }
              @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
            </style>
          </head>
          <body>
            <img src="${imageSrc}" alt="${title} coloring page" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <section
      id="gallery"
      className="py-20 md:py-28"
      aria-labelledby="gallery-heading"
    >
      <div className="container-custom">
        <div className="text-center mb-12" data-reveal>
          <h2
            id="gallery-heading"
            className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4"
          >
            Explore Our Collection
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse through hundreds of free coloring pages. Click to preview and download instantly.
          </p>
        </div>

        {/* Category Filter */}
        <nav
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12"
          role="tablist"
          aria-label="Filter coloring pages by category"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              role="tab"
              aria-selected={activeCategory === category.id}
              aria-controls="gallery-grid"
              className={cn(
                "px-4 py-2 md:px-6 md:py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-card"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {category.label}
            </button>
          ))}
        </nav>

        {/* Gallery Grid */}
        <div
          id="gallery-grid"
          role="tabpanel"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {visiblePages.map((page, index) => (
            <article
              key={page.id}
              className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={page.image}
                  alt={`${page.title} - ${page.description}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                
                {/* Difficulty Badge */}
                <span
                  className={cn(
                    "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium",
                    page.difficulty === "Easy" && "bg-primary/90 text-primary-foreground",
                    page.difficulty === "Medium" && "bg-accent/90 text-accent-foreground",
                    page.difficulty === "Hard" && "bg-secondary text-secondary-foreground"
                  )}
                >
                  {page.difficulty}
                </span>
              </div>

              <div className="p-5 md:p-6">
                <h3 className="font-serif text-xl mb-2">{page.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {page.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 min-w-[70px]"
                    onClick={() => window.open(page.image, "_blank")}
                    aria-label={`Preview ${page.title}`}
                  >
                    <Eye className="w-4 h-4" aria-hidden="true" />
                    <span>View</span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 min-w-[70px]"
                    onClick={() => handleDownloadPDF(page.title, page.image, page.description)}
                    aria-label={`Download ${page.title} as PDF`}
                  >
                    <FileText className="w-4 h-4" aria-hidden="true" />
                    <span>PDF</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 min-w-[70px]"
                    onClick={() => handleDownloadPNG(page.title, page.image)}
                    aria-label={`Download ${page.title} as PNG`}
                  >
                    <Image className="w-4 h-4" aria-hidden="true" />
                    <span>PNG</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 min-w-[70px]"
                    onClick={() => handlePrint(page.title, page.image)}
                    aria-label={`Print ${page.title}`}
                  >
                    <Printer className="w-4 h-4" aria-hidden="true" />
                    <span>Print</span>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" onClick={handleLoadMore}>
              Load More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
