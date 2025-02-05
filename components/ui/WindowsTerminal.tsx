type WindowsTerminalProps = {
  name: string
  tagline: string
  bio: string
}

const metadataRows = [
  {key: 'assignee', value: 'Sidakpreet Singh'},
  {key: 'status',   value: 'Open to Opportunities'},
  {key: 'role',     value: 'Strategy · GTM · Product'},
  {key: 'location', value: 'Delhi NCR, India'},
]

export function WindowsTerminal({name, tagline, bio}: WindowsTerminalProps) {
  const bioLines = bio.split('\n')

  return (
    <div className="surface rounded-xl overflow-hidden shadow-panel w-full">
      <div className="flex items-center justify-between h-9 bg-[#0c0d14] border-b border-white/[0.05]">
        <div className="flex items-center gap-2 pl-3">
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <polyline
              points="1.5,4 5.5,6.5 1.5,9"
              stroke="#61AFEF"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="7"
              y1="9"
              x2="11.5"
              y2="9"
              stroke="#61AFEF"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-mono text-[10px] text-foreground/28 tracking-tight select-none">
            Windows PowerShell
          </span>
        </div>

        <div className="flex items-stretch h-9">
          <div
            aria-hidden="true"
            className="flex items-center justify-center w-11 cursor-default select-none
              text-foreground/20 hover:text-foreground/45 hover:bg-white/[0.05]
              transition-colors duration-100"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <rect x="0" y="7" width="10" height="1" fill="currentColor" />
            </svg>
          </div>

          <div
            aria-hidden="true"
            className="flex items-center justify-center w-11 cursor-default select-none
              text-foreground/20 hover:text-foreground/45 hover:bg-white/[0.05]
              transition-colors duration-100"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <rect
                x="0.5"
                y="0.5"
                width="9"
                height="9"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          </div>

          <div
            aria-hidden="true"
            className="flex items-center justify-center w-11 cursor-default select-none
              text-foreground/20 hover:text-white hover:bg-[#c42b1c]
              transition-colors duration-100"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <line
                x1="0.5"
                y1="0.5"
                x2="9.5"
                y2="9.5"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="square"
              />
              <line
                x1="9.5"
                y1="0.5"
                x2="0.5"
                y2="9.5"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="square"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex items-end bg-[#0c0d14] px-2 border-b border-white/[0.06]">
        {/* border-b-0 and -mb-px overlaps the strip's border for a seamless active tab state */}
        <div
          className="relative flex items-center gap-[7px] bg-[#13161c] px-3.5 py-[7px]
            border border-b-0 border-white/[0.08] rounded-t-[3px] -mb-px z-10 select-none"
        >
          <span className="font-mono text-[9px] font-bold text-accent leading-none">
            PS
          </span>
          <span className="font-mono text-[10.5px] text-foreground/55 whitespace-nowrap tracking-tight">
            C:\Users\SidakpreetSingh
          </span>
          <span
            className="ml-0.5 font-mono text-xs leading-none cursor-default
              text-foreground/18 hover:text-foreground/42 transition-colors duration-100"
          >
            ×
          </span>
        </div>

        <div
          className="flex items-center justify-center w-8 h-7 mb-px text-base leading-none
            cursor-default select-none text-foreground/18 hover:text-foreground/42
            transition-colors duration-100"
        >
          +
        </div>
      </div>

      <div className="surface-2">
        <div className="px-6 pt-6 pb-6 border-b border-white/[0.04]">
          <p className="font-mono text-[10.5px] text-foreground/22 mb-4 tracking-tight select-none">
            {'/** @profile – Sidakpreet Singh · 2025 */'}
          </p>

          <p
            className="font-sans font-bold text-white leading-tight"
            style={{
              fontSize: 'clamp(1.3rem, 2.6vw, 1.8rem)',
              letterSpacing: '-0.022em',
            }}
          >
            {name}
          </p>

          <p className="font-sans text-foreground/78 text-[0.93rem] leading-relaxed mt-1.5">
            {tagline}
          </p>

          <div className="mt-5 flex items-start">
            <div
              className="flex flex-col items-end shrink-0 pr-3.5 select-none"
              aria-hidden="true"
            >
              {bioLines.map((_, i) => (
                <span
                  key={i}
                  className="font-mono text-[11px] text-foreground/18"
                  style={{lineHeight: '1.65rem'}}
                >
                  {i + 1}
                </span>
              ))}
            </div>

            <div
              className="w-px self-stretch bg-white/[0.05] shrink-0 mr-4"
              aria-hidden="true"
            />

            <div className="flex-1 min-w-0">
              {bioLines.map((line, i) => (
                <p
                  key={i}
                  className="font-mono text-[12.5px] text-foreground/70 break-words"
                  style={{lineHeight: '1.65rem'}}
                >
                  <span className="text-foreground/20 mr-2 select-none">{'>'}</span>
                  {line}
                  {i === bioLines.length - 1 && (
                    <span className="animate-cursor-blink text-orange-500 ml-px">▍</span>
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="font-mono text-[10px] text-foreground/18 mb-3 select-none uppercase tracking-[0.2em]">
            {'// properties'}
          </p>

          <div className="space-y-[7px]">
            {metadataRows.map(({key, value}) => (
              <div key={key} className="flex items-baseline font-mono text-[12px]">
                {/* #9cdcfe = VS Code variable blue, #ce9178 = VS Code string orange */}
                <span className="text-[#9cdcfe] shrink-0 w-24">{key}</span>
                <span className="text-foreground/24 shrink-0">:</span>
                <span className="ml-2 text-[#ce9178]">
                  <span className="text-foreground/18">"</span>
                  {value}
                  <span className="text-foreground/18">"</span>
                </span>
                <span className="ml-0.5 text-foreground/14">;</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between h-[22px] bg-[#007acc] px-3 select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-[5px]">
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="2.5"
                cy="2"
                r="1.3"
                stroke="white"
                strokeWidth="0.85"
                strokeOpacity="0.80"
              />
              <circle
                cx="8.5"
                cy="9"
                r="1.3"
                stroke="white"
                strokeWidth="0.85"
                strokeOpacity="0.80"
              />
              <circle
                cx="8.5"
                cy="2"
                r="1.3"
                stroke="white"
                strokeWidth="0.85"
                strokeOpacity="0.80"
              />
              <path
                d="M2.5 3.3V7a1.5 1.5 0 0 0 1.5 1.5h3"
                stroke="white"
                strokeWidth="0.85"
                strokeOpacity="0.80"
                strokeLinecap="round"
              />
              <line
                x1="8.5"
                y1="3.3"
                x2="8.5"
                y2="7.7"
                stroke="white"
                strokeWidth="0.85"
                strokeOpacity="0.80"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-mono text-[10px] text-white/85 leading-none">main</span>
          </div>
          <span className="font-mono text-[10px] text-white/70 leading-none">
            ✓ 0 errors
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-white/70 leading-none">UTF-8</span>
          <span className="font-mono text-[10px] text-white/70 leading-none">TypeScript</span>
          <span className="font-mono text-[10px] text-white/70 leading-none">Ln 1, Col 1</span>
        </div>
      </div>
    </div>
  )
}