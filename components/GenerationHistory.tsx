import { useState } from "react";
import { Download, Trash2, Clock, FileText, ChevronDown, ChevronUp, Printer, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenerationHistoryItem } from "@/hooks/use-generation-history";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

interface GenerationHistoryProps {
  history: GenerationHistoryItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function GenerationHistory({ history, onRemove, onClear }: GenerationHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (history.length === 0) return null;

  const handleDownloadPDF = async (item: GenerationHistoryItem) => {
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
        img.src = item.imageUrl;
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

      pdf.addImage(item.imageUrl, "PNG", x, y, imgWidth, imgHeight, undefined, "FAST");

      pdf.setFontSize(8);
      pdf.setTextColor(180, 180, 180);
      pdf.text("ColorMagic — Free Printable Coloring Pages", pageWidth / 2, pageHeight - 0.25, {
        align: "center",
      });

      pdf.setProperties({
        title: `ColorMagic - ${item.categoryLabel} Coloring Page`,
        subject: "Free Printable Coloring Page",
        creator: "ColorMagic",
        keywords: "coloring page, printable, free, kids, teens",
      });

      pdf.save(`colormagic-${item.categoryLabel.toLowerCase().replace(/\s+/g, "-")}-coloring-page.pdf`);

      toast.success("High-quality PDF ready for printing!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to create PDF. Please try again.");
    }
  };

  const handleDownloadPNG = async (item: GenerationHistoryItem) => {
    try {
      toast.info("Preparing PNG download...");

      const img = new window.Image();
      img.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = item.imageUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) throw new Error("Failed to create PNG blob");
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `colormagic-${item.categoryLabel.toLowerCase().replace(/\s+/g, "-")}-coloring-page.png`;
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

  const handlePrint = (item: GenerationHistoryItem) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>ColorMagic - ${item.categoryLabel} Coloring Page</title>
            <style>
              @page { size: letter; margin: 0.5in; }
              body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
              img { max-width: 100%; max-height: 100%; object-fit: contain; }
              @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
            </style>
          </head>
          <body>
            <img src="${item.imageUrl}" alt="${item.categoryLabel} coloring page" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const displayedHistory = isExpanded ? history : history.slice(0, 3);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" aria-hidden="true" />
          <h3 className="font-display text-xl font-semibold">Your recent creations</h3>
          <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
            {history.length}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline ml-1">Clear All</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedHistory.map((item) => (
          <div
            key={item.id}
            className="group relative bg-secondary/30 rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors"
          >
            <div className="aspect-square bg-white">
              <img
                src={item.imageUrl}
                alt={`${item.categoryLabel} coloring page`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium truncate">{item.categoryLabel}</span>
                <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
              </div>
              {item.customPrompt && (
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2">"{item.customPrompt}"</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Button variant="default" size="sm" className="flex-1 min-w-0" onClick={() => handleDownloadPDF(item)}>
                  <FileText className="w-3 h-3" aria-hidden="true" />
                  <span className="text-xs">PDF</span>
                </Button>
                <Button variant="secondary" size="sm" className="flex-1 min-w-0" onClick={() => handleDownloadPNG(item)}>
                  <Image className="w-3 h-3" aria-hidden="true" />
                  <span className="text-xs">PNG</span>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 min-w-0" onClick={() => handlePrint(item)}>
                  <Printer className="w-3 h-3" aria-hidden="true" />
                  <span className="text-xs">Print</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => onRemove(item.id)}
                >
                  <Trash2 className="w-3 h-3" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {history.length > 3 && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-4"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
              Show {history.length - 3} More
            </>
          )}
        </Button>
      )}
    </div>
  );
}
