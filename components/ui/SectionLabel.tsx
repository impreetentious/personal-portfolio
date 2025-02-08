export function SectionLabel({
  label,
  devLabel,
}: {
  label: string;
  devLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {devLabel && (
        <code className="font-mono font-medium text-[11px] tracking-wide text-metaphor/70 select-none">
          {devLabel}
        </code>
      )}
      <p className="text-sm uppercase tracking-[0.3em] text-accent">{label}</p>
    </div>
  );
}
