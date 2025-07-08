// Single source of truth for the "current time in IST" readout shared by the
// terminal UIs (WindowsTerminal status bar + TerminalPrompt `time`/`date`).
// The formatter is created once at module scope rather than per call.
const IST_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour:     '2-digit',
  minute:   '2-digit',
  second:   '2-digit',
  hour12:   false,
})

// Returns the current India Standard Time as `HH:MM:SS` (no zone suffix — callers
// append " IST" where they want it).
export function getISTTime(): string {
  const parts = IST_FORMATTER.formatToParts(new Date())
  const h = parts.find((p) => p.type === 'hour')?.value   ?? '00'
  const m = parts.find((p) => p.type === 'minute')?.value ?? '00'
  const s = parts.find((p) => p.type === 'second')?.value ?? '00'
  return `${h}:${m}:${s}`
}
