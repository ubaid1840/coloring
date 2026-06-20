import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is ColorMagic really free?",
    answer:
      "Yes! Generating, downloading, and printing coloring pages is 100% free. No hidden fees, no subscriptions, and no account required.",
  },
  {
    question: "What format are the downloads in?",
    answer:
      "Every page is available as a high-resolution PNG image and a print-ready PDF, optimized for standard letter-size (8.5\" x 11\") or A4 paper.",
  },
  {
    question: "Is it safe for kids?",
    answer:
      "Absolutely. Our AI is tuned to create wholesome, kid-friendly black-and-white line art that's perfect for coloring at home or in the classroom.",
  },
  {
    question: "What age groups are these for?",
    answer:
      "Everyone! Choose 'Kids' for big, simple shapes that are easy to color, or 'Teens & Adults' for more intricate, detailed designs.",
  },
  {
    question: "Can I use these for my classroom?",
    answer:
      "Yes, our pages are great for personal, family, and classroom use. Print as many as you need for your students.",
  },
  {
    question: "What's the best way to print these pages?",
    answer:
      "For best results, print on white cardstock or heavier paper (80-100 lb) and set your printer to 'high quality' or 'best' mode to keep lines crisp.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-24 bg-secondary/40 py-16 md:py-24" aria-labelledby="faq-heading">
      <div className="container-custom max-w-3xl">
        <div className="text-center" data-reveal>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Good to know
          </span>
          <h2
            id="faq-heading"
            className="font-display text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl"
          >
            Frequently asked questions
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground text-pretty">
            Everything you need to know about creating and printing your coloring pages.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-2xl border border-border bg-card px-6 shadow-soft transition-shadow data-[state=open]:shadow-card"
            >
              <AccordionTrigger className="py-5 text-left font-display text-lg font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
