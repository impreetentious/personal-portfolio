'use client'

import { useRef, useState } from 'react'
import { usePalette } from '@/components/PaletteContext'

type Tone = 'plain' | 'ok' | 'err' | 'accent' | 'dim' | 'warn'

type Line = { text: string; tone: Tone }

type HistoryEntry = { id: number; cmd: string; output: Line[] }

type TerminalPromptProps = {
  name: string
  tagline: string
}

const TONE_CLASS: Record<Tone, string> = {
  plain:  'text-foreground/70',
  ok:     'text-green-400/90',
  err:    'text-[#f48771]',
  accent: 'text-accent',
  dim:    'text-foreground/40',
  warn:   'text-amber-300/90',
}

const MAX_ENTRIES = 8

function getISTTime(): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())
}

export function TerminalPrompt({ name, tagline }: TerminalPromptProps) {
  const { openPalette } = usePalette()

  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [value, setValue]     = useState('')
  const [cmdCursor, setCmdCursor] = useState(-1)

  const inputRef  = useRef<HTMLInputElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const idRef     = useRef(0)
  const pastCmds  = useRef<string[]>([])

  const scrollPanelToBottom = () => {
    requestAnimationFrame(() => {
      const scroller = wrapRef.current?.closest('.js-terminal-scroll')
      if (scroller) scroller.scrollTop = scroller.scrollHeight
    })
  }

  const run = (raw: string): Line[] | 'clear' => {
    const cmd = raw.trim().split(/\s+/)[0] ?? ''

    switch (cmd.toLowerCase()) {
      case '':
        return []

      // help / --help / -h → hand off to the command palette (the real menu)
      case 'help':
      case '--help':
      case '-h':
        openPalette('help')
        return [{ text: 'launching command palette....', tone: 'dim' }]

      // ver — Windows version banner, repurposed as an identity line
      case 'ver':
        return [
          { text: `${name} — Portfolio [PowerShell Edition]`, tone: 'accent' },
          { text: `(c) ${new Date().getFullYear()} ${name}. All rights reserved.`, tone: 'dim' },
        ]

      // tree — draw the tagline as a directory tree
      case 'tree': {
        const parts = tagline.split(/[·•|,/]/).map((s) => s.trim()).filter(Boolean)
        const lines: Line[] = [{ text: 'C:\\Portfolio', tone: 'accent' }]
        parts.forEach((part, i) => {
          const branch = i === parts.length - 1 ? '└──' : '├──'
          lines.push({ text: `${branch} ${part}`, tone: 'plain' })
        })
        return lines
      }

      case 'time':
      case 'date':
        return [{ text: `${getISTTime()} IST — Delhi NCR, India`, tone: 'plain' }]

      case 'cls':
      case 'clear':
        return 'clear'

      default:
        return [
          {
            text: `${cmd} : The term '${cmd}' is not recognized as the name of a cmdlet.`,
            tone: 'err',
          },
          { text: `Type 'help' to open the command palette.`, tone: 'dim' },
        ]
    }
  }

  const submit = () => {
    const cmd = value
    if (cmd.trim()) pastCmds.current = [...pastCmds.current.slice(-19), cmd]
    setCmdCursor(-1)
    setValue('')

    const result = run(cmd)
    if (result === 'clear') {
      setHistory([])
      return
    }

    idRef.current += 1
    setHistory((prev) => [...prev.slice(-(MAX_ENTRIES - 1)), { id: idRef.current, cmd, output: result }])
    scrollPanelToBottom()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const cmds = pastCmds.current
      if (!cmds.length) return
      const next = cmdCursor === -1 ? cmds.length - 1 : Math.max(0, cmdCursor - 1)
      setCmdCursor(next)
      setValue(cmds[next])
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const cmds = pastCmds.current
      if (cmdCursor === -1) return
      const next = cmdCursor + 1
      if (next >= cmds.length) {
        setCmdCursor(-1)
        setValue('')
      } else {
        setCmdCursor(next)
        setValue(cmds[next])
      }
    }
  }

  return (
    <div ref={wrapRef} className="mt-5 sm:mt-4 cursor-text" onClick={() => inputRef.current?.focus()}>
      {/* Executed commands + output */}
      <div role="log" aria-live="polite" className="space-y-1">
        {history.map((entry) => (
          <div key={entry.id} className="font-mono text-xs sm:text-sm leading-relaxed">
            <p className="whitespace-nowrap overflow-x-auto">
              <span className="text-accent select-none">PS </span>
              <span className="text-accent">
                <span className="sm:hidden">C:\Users</span>
                <span className="hidden sm:inline">C:\Users\SidakpreetSingh</span>
              </span>
              <span className="text-white/40 mx-0.5">{'>'}</span>
              <span className="text-[#ce9178]"> {entry.cmd}</span>
            </p>
            {entry.output.map((line, i) => (
              <p key={i} className={`${TONE_CLASS[line.tone]} whitespace-pre-wrap break-words`}>
                {line.text}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* Live prompt */}
      <label className="flex items-baseline font-mono text-xs sm:text-sm leading-relaxed">
        <span className="whitespace-nowrap shrink-0">
          <span className="text-accent select-none">PS </span>
          <span className="text-accent">
            <span className="sm:hidden">C:\Users</span>
            <span className="hidden sm:inline">C:\Users\SidakpreetSingh</span>
          </span>
          <span className="text-white/40 mx-0.5">{'>'}</span>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Terminal input — type 'help' for available commands"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
          placeholder="type 'help'"
          className="ml-1.5 min-w-0 flex-1 bg-transparent font-mono text-[#ce9178] placeholder:text-foreground/25 caret-accent outline-none border-none p-0"
        />
      </label>
    </div>
  )
}
