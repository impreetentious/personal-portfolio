export function SectionLabel({
  label,
  devLabel,
  titleClassName,
  align,
}: {
  label: string;
  devLabel?: string;
  titleClassName?: string;
  align?: 'left' | 'right';
}) {
  const isRight = align === 'right';

  return (
    <div
      className={`flex flex-col gap-[18px]${
        isRight ? ' items-end text-right' : ' items-start text-left'
      }`}
    >
      {devLabel && (
        <code className="font-mono font-medium text-[11px] tracking-wide text-metaphor/70 select-none">
          {devLabel}
        </code>
      )}
      <p
        className={`font-sans font-bold text-3xl uppercase tracking-tight leading-none text-accent antialiased subpixel-antialiased sm:text-4xl${
          titleClassName ? ` ${titleClassName}` : ''
        }`}
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        {label}
      </p>
    </div>
  );
}