
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
        <Card key={index} className="border border-border/50 overflow-hidden">
          <div
            className="flex items-center justify-between cursor-pointer p-6"
            onClick={() => toggleItem(index)}
          >
            <h3 className="text-lg font-semibold text-foreground">
              {item.question}
            </h3>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-primary" />
            </motion.div>
          </div>
          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.section
                key="content"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-0 border-t border-border/50">
                    <p className="text-muted-foreground pt-4">
                    {item.answer}
                    </p>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </Card>
      ))}
    </div>
  );
}
