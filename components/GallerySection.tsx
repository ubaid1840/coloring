"use client";

import { useState } from "react";
import { Eye, FileText, Printer, Image as ImageIcon } from "lucide-react";
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

  const handleLoadMore = () => setVisibleCount((prev) => prev + ITEMS_PER_LOAD);

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

      const img = new window.Image();
      img.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageSrc;
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

      pdf.addImage(imageSrc, "JPEG", x, y, imgWidth, imgHeight, undefined, "FAST");

      pdf.setFontSize(8);
      pdf.setTextColor(180, 180, 180);
      pdf.text("ColorMagic — Free Printable Coloring Pages", pageWidth / 2, pageHeight - 0.25, {
        align: "center",
      });

      pdf.setProperties({
        title: `ColorMagic - ${title}`,
        subject: description,
        creator: "ColorMagic",
        keywords: "coloring page, printable, free",
      });

      pdf.save(`colormagic-${title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
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
        a.download = `colormagic-${title.toLowerCase().replace(/\s+/g, "-")}.png`;
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
            <title>ColorMagic - ${title}</title>
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
    <section id="gallery" className="scroll-mt-24 bg-secondary/40 py-16 md:py-24" aria-labelledby="gallery-heading">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-2 text-sm font-semibold text-accent">
            Ready-to-print designs
          </span>
          <h2
            id="gallery-heading"
            className="font-display text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl"
          >
            Explore the collection
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground text-pretty">
            Browse hand-picked coloring pages. Preview, print, or download instantly, no sign-up needed.
          </p>
        </div>

        {/* Category Filter */}
        <nav
          className="mt-10 flex flex-wrap justify-center gap-2 md:gap-3"
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
                "rounded-full border-2 px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeCategory === category.id
                  ? "border-primary bg-primary text-primary-foreground shadow-soft"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
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
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visiblePages.map((page, index) => (
            <article
              key={page.id}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card animate-fade-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <img
                  src={page.image || "/placeholder.svg"}
                  alt={`${page.title} - ${page.description}`}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span
                  className={cn(
                    "absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold",
                    page.difficulty === "Easy" && "bg-accent text-accent-foreground",
                    page.difficulty === "Medium" && "bg-sunny text-sunny-foreground",
                    page.difficulty === "Hard" && "bg-grape text-grape-foreground",
                  )}
                >
                  {page.difficulty}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-display text-lg font-semibold">{page.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{page.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(page.image, "_blank")}
                    aria-label={`Preview ${page.title}`}
                  >
                    <Eye aria-hidden="true" />
                    View
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleDownloadPDF(page.title, page.image, page.description)}
                    aria-label={`Download ${page.title} as PDF`}
                  >
                    <FileText aria-hidden="true" />
                    PDF
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownloadPNG(page.title, page.image)}
                    aria-label={`Download ${page.title} as PNG`}
                  >
                    <ImageIcon aria-hidden="true" />
                    PNG
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePrint(page.title, page.image)}
                    aria-label={`Print ${page.title}`}
                  >
                    <Printer aria-hidden="true" />
                    Print
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {hasMore && (
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" onClick={handleLoadMore}>
              Load more designs
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
