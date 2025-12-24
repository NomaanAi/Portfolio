import { LabelHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const CommonLabel = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
);
CommonLabel.displayName = "CommonLabel";

export { CommonLabel };
