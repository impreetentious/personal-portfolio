type SectionLabelProps = {
  devLabel: string
  label: string
  heading: string
}

export function SectionLabel({devLabel, label, heading}: SectionLabelProps) {
  return (
    <div>
      <p className="mb-2 font-mono text-xs text-accent/45">{devLabel}</p>
      <p className="text-sm uppercase tracking-[0.3em] text-accent">{label}</p>
      <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">{heading}</h2>
    </div>
  )
}