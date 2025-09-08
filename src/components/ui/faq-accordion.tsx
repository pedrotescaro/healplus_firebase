"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Primeira pergunta aberta por padrão

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <Card key={index} className="border border-border/50">
          <CardContent className="p-6">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleItem(index)}
            >
              <h3 className="text-lg font-semibold text-foreground">
                {item.question}
              </h3>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </div>
            {openIndex === index && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
