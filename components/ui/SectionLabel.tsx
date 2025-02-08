export function SectionLabel({
  label,
  devLabel,
  titleClassName,
  align,
}: {
  label: string;
  devLabel?: string;
  titleClassName?: string;
  align?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {devLabel && (
        <code className="font-mono font-medium text-[11px] tracking-wide text-metaphor/70 select-none">
          {devLabel}
        </code>
      )}
      <p
        className={`font-inter font-sans font-bold text-3xl uppercase tracking-tight leading-none text-accent sm:text-4xl${titleClassName ? ` ${titleClassName}` : ''}`}
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        {label}
      </p>
    </div>
  );
}