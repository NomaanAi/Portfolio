"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface CommonAccordionItemProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function CommonAccordionItem({
  title,
  children,
  defaultOpen = false,
  className,
}: CommonAccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("border-b", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 w-full text-left"
        data-state={isOpen ? "open" : "closed"}
      >
        {title}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </button>
      <div
        className={cn(
          "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down mb-4",
          !isOpen && "hidden"
        )}
      >
        <div className="pb-4 pt-0">{children}</div>
      </div>
    </div>
  );
}
