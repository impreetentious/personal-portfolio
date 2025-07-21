import React from "react";
import { DecryptText } from "./DecryptText";

export function SectionLabel({
  label,
  devLabel,
  titleClassName,
  children,
}: {
  label: string;
  devLabel?: string;
  titleClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="text-left">
      {devLabel && (
        <code className="block font-mono font-medium text-[10px] sm:text-[12px] tracking-wide text-metaphor/70 select-none mb-3 sm:mb-5">
          {devLabel}
        </code>
      )}

      <div className="flex items-center gap-6 w-full justify-between">
        {/* Real <h2> so the document outline is h1 → h2 → h3 (was a <p>, which
            left the page with no level-2 headings for AT/SEO). */}
        <h2
          className={`font-display font-semibold text-[33px] tracking-tight text-white/[0.92] antialiased sm:text-4xl${
            titleClassName ? ` ${titleClassName}` : ""
          }`}
        >
          <DecryptText text={label} />
        </h2>

        {children}
      </div>
    </div>
  );
}
