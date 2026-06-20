import { cn } from "@/lib/utils";

interface AdPlaceholderProps {
  /** Ad slot label shown on the placeholder */
  label?: string;
  /** Size preset that maps to common ad unit aspect ratios */
  size?: "leaderboard" | "billboard" | "rectangle" | "skyscraper" | "mobile-banner" | "responsive";
  className?: string;
  id?: string;
  /** Google AdSense client ID (ca-pub-XXXXXXXXXXXXXXXX) */
  adClient?: string;
  /** Google AdSense ad slot ID */
  adSlot?: string;
  /** Set to true to render the actual AdSense ad unit instead of the placeholder */
  showRealAd?: boolean;
}

const sizeClasses: Record<NonNullable<AdPlaceholderProps["size"]>, string> = {
  leaderboard: "max-w-[728px] aspect-[728/90]",
  billboard: "max-w-[970px] aspect-[970/250]",
  rectangle: "max-w-[300px] aspect-[300/250]",
  skyscraper: "max-w-[300px] aspect-[300/600]",
  "mobile-banner": "max-w-[320px] aspect-[320/100]",
  responsive: "max-w-[970px] min-h-[90px] md:min-h-[250px]",
};

const sizeLabels: Record<NonNullable<AdPlaceholderProps["size"]>, string> = {
  leaderboard: "728x90 Leaderboard",
  billboard: "970x250 Billboard",
  rectangle: "300x250 Medium Rectangle",
  skyscraper: "300x600 Half Page",
  "mobile-banner": "320x100 Large Mobile Banner",
  responsive: "Responsive Ad Unit",
};

/**
 * Google AdSense ad slot placeholder.
 *
 * When `showRealAd` is true and `adClient` + `adSlot` are provided,
 * it renders the actual AdSense `<ins>` tag.
 *
 * Otherwise it shows a styled placeholder that matches the site's playful,
 * kid-friendly aesthetic. Replace with real ad code when your AdSense account
 * is approved.
 *
 * @example
 * <AdPlaceholder
 *   size="leaderboard"
 *   adClient="ca-pub-1234567890123456"
 *   adSlot="1234567890"
 *   showRealAd={true}
 * />
 */
export function AdPlaceholder({
  label = "Advertisement",
  size = "leaderboard",
  className,
  id,
  adClient,
  adSlot,
  showRealAd = false,
}: AdPlaceholderProps) {
  const isResponsive = size === "responsive";

  // Render real AdSense ad unit
  if (showRealAd && adClient && adSlot) {
    return (
      <aside
        id={id}
        aria-label={label}
        role="complementary"
        className={cn("w-full flex justify-center my-6 md:my-10 px-4", className)}
      >
        <div
          className={cn(
            "w-full overflow-hidden",
            isResponsive ? "max-w-[970px]" : "",
            sizeClasses[size]
          )}
        >
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format={isResponsive ? "auto" : undefined}
            data-full-width-responsive={isResponsive ? "true" : undefined}
          />
        </div>
      </aside>
    );
  }

  // Render placeholder
  return (
    <aside
      id={id}
      aria-label={label}
      role="complementary"
      className={cn("w-full flex justify-center my-6 md:my-10 px-4", className)}
    >
      <div
        className={cn(
          "w-full relative rounded-2xl border-2 border-dashed border-primary/25",
          "bg-gradient-to-br from-secondary/50 via-background to-accent/15",
          "shadow-soft flex flex-col items-center justify-center text-center p-4",
          sizeClasses[size]
        )}
      >
        {/* Google-style "Ad" badge */}
        <span className="absolute top-2 left-3 text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/70 bg-background/60 px-1.5 py-0.5 rounded">
          Ad
        </span>

        {/* Size badge */}
        <span className="absolute top-2 right-3 text-[9px] uppercase tracking-wider font-medium text-muted-foreground/50">
          {sizeLabels[size]}
        </span>

        {/* Center content */}
        <span className="font-serif text-sm sm:text-base md:text-lg text-foreground/60">
          {label}
        </span>
        <span className="text-[11px] sm:text-xs text-muted-foreground mt-1">
          Google AdSense — Your ad could be here
        </span>

        {/* Google-style dotted border inside */}
        <div className="absolute inset-3 border border-dashed border-primary/10 rounded-xl pointer-events-none" />
      </div>
    </aside>
  );
}
