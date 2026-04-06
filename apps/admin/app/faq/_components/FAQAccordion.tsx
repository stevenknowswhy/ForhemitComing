import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <Accordion type="single" collapsible className="faq-accordion">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={index.toString()}
          className="faq-accordion-item"
        >
          <AccordionTrigger className="faq-accordion-question">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="faq-accordion-answer">
            <p>{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
