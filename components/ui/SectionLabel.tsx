import React from "react";
import { DecryptText } from "./DecryptText";

export function SectionLabel({
  label,
  devLabel,
  titleClassName,
  align,
  children,
}: {
  label: string;
  devLabel?: string;
  titleClassName?: string;
  align?: "left" | "right";
  children?: React.ReactNode;
}) {
  const isRight = align === "right";

  return (
    <div className={isRight ? "text-right" : "text-left"}>
      {devLabel && (
        <code className="block font-mono font-medium text-[10px] sm:text-[12px] tracking-wide text-metaphor/70 select-none mb-3 sm:mb-5">
          {devLabel}
        </code>
      )}
      
      <div
        className={`flex items-center gap-6 w-full ${
          isRight ? "justify-end" : "justify-between"
        }`}
      >
        <p
          className={`font-display font-semibold text-[33px] tracking-tight text-white/[0.92] antialiased sm:text-4xl${
            titleClassName ? ` ${titleClassName}` : ""
          }`}
        >
          <DecryptText text={label} />
        </p>
        
        {children}
      </div>
    </div>
  );
}