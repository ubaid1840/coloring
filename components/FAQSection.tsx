import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Are all coloring pages really free?",
    answer:
      "Yes! All our coloring pages are 100% free to download and print. No hidden fees, no subscriptions, and no account required. We believe creativity should be accessible to everyone.",
  },
  {
    question: "What format are the downloads in?",
    answer:
      "All coloring pages are available as high-resolution images optimized for printing. They work great on standard letter-size (8.5\" x 11\") or A4 paper for the best coloring experience.",
  },
  {
    question: "Can I use these for commercial purposes?",
    answer:
      "Our coloring pages are for personal use only. This includes printing for yourself, your family, classrooms, or therapy sessions. Please contact us if you're interested in commercial licensing.",
  },
  {
    question: "What age groups are these suitable for?",
    answer:
      "We have designs for all ages! Our collection includes simple patterns perfect for children, medium-complexity designs for teens, and intricate mandalas and geometric patterns that adults love for stress relief.",
  },
  {
    question: "How often do you add new designs?",
    answer:
      "We add new coloring pages regularly—typically 10-15 new designs each week across all categories. Bookmark our site and check back often for fresh creative inspiration!",
  },
  {
    question: "What's the best way to print these pages?",
    answer:
      "For best results, we recommend printing on white cardstock or heavier paper (at least 80-100 lb). This prevents markers from bleeding through and gives colored pencils a better surface. Set your printer to 'high quality' or 'best' mode.",
  },
];

export function FAQSection() {
  return (
    <section
      id="faq"
      className="py-20 md:py-28"
      aria-labelledby="faq-heading"
    >
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-12" data-reveal>
          <h2
            id="faq-heading"
            className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about our free coloring pages.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card rounded-xl px-6 shadow-soft border-none data-[state=open]:shadow-card transition-shadow"
            >
              <AccordionTrigger className="text-left font-serif text-lg hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
