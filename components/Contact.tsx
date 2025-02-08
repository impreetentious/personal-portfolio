"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import type { ReactNode } from "react";

// ─── Internal: SectionLabel ───────────────────────────────────────────────────

function SectionLabel({ label, devLabel }: { label: string; devLabel?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {devLabel && (
        <code className="font-mono font-medium text-[11px] tracking-wide text-success/50 select-none">
          {devLabel}
        </code>
      )}
      <p className="text-sm uppercase tracking-[0.3em] text-accent">{label}</p>
    </div>
  );
}

// ─── VS Code Syntax Token Colours ─────────────────────────────────────────────

const TOKEN = {
  identifier : "#9CDCFE",              // light blue  — variables, object keys
  string     : "#CE9178",              // salmon      — string literals
  fn         : "#DCDCAA",              // yellow-gold — function / method names
  punct      : "#6B7280",              // mid-gray    — brackets, commas, colons
  comment    : "#6A9955",              // muted green — // comments
  success    : "#4EC9B0",              // teal        — [SUCCESS] label
  dim        : "rgba(255,255,255,0.20)",
} as const;

// ─── Internal: PanelTab ───────────────────────────────────────────────────────

function PanelTab({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={[
        "px-3.5 h-full flex items-center text-[10.5px] font-mono tracking-widest select-none",
        active
          ? "bg-[#0E0E1C] text-white/70 border-t border-x border-white/[0.08]"
          : "text-white/18 border-t border-x border-transparent",
      ].join(" ")}
    >
      {label}
    </div>
  );
}

// ─── Internal: ConsoleLine ────────────────────────────────────────────────────

interface ConsoleLineProps {
  children   : ReactNode;
  lineNumber?: number;
  timestamp? : string;
  delay?     : number;
  isVisible  : boolean;
}

function ConsoleLine({
  children,
  lineNumber,
  timestamp,
  delay = 0,
  isVisible,
}: ConsoleLineProps) {
  return (
    <motion.div
      className="flex items-start gap-3 min-h-[20px]"
      initial={{ opacity: 0, x: -12 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.38, delay }}
    >
      {/* Gutter — line number */}
      {lineNumber !== undefined && (
        <span
          className="select-none w-5 text-right shrink-0 text-[11px] font-mono leading-5"
          style={{ color: "rgba(255,255,255,0.10)" }}
        >
          {lineNumber}
        </span>
      )}

      {/* Gutter — timestamp */}
      {timestamp && (
        <span
          className="select-none text-[10.5px] font-mono shrink-0 leading-5 tabular-nums"
          style={{ color: TOKEN.dim }}
        >
          {timestamp}
        </span>
      )}

      {/* Content */}
      <div className="font-mono text-[12.5px] leading-5 flex-1">{children}</div>
    </motion.div>
  );
}

// ─── Contact (replace these three constants before shipping) ──────────────────

const EMAIL           = "hello@sidakpreetsingh.com";
const LINKEDIN_HANDLE = "linkedin.com/in/sidakpreetsingh";
const LINKEDIN_URL    = "https://linkedin.com/in/sidakpreetsingh";

// ─── Contact Section ──────────────────────────────────────────────────────────

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView   = useInView(sectionRef, { once: true, amount: 0.15 });

  const [emailCopied, setEmailCopied] = useState(false);

  const handleEmailCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2600);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Contact"
      className="w-full bg-[#07070F] border-t border-white/[0.06] flex flex-col min-h-[480px]"
    >
      {/* Cursor blink keyframe — scoped to this section */}
      <style>{`@keyframes vscode-cursor-blink{0%,100%{opacity:1}49%{opacity:1}50%,99%{opacity:0}}`}</style>

      {/* ── Panel Title Bar ──────────────────────────────────────────────── */}
      <div className="flex items-end justify-between px-5 border-b border-white/[0.06] h-[38px] shrink-0">
        <div className="flex h-full items-end gap-0">
          <PanelTab label="OUTPUT"        active />
          <PanelTab label="TERMINAL"              />
          <PanelTab label="PROBLEMS"              />
          <PanelTab label="DEBUG CONSOLE"         />
        </div>

        {/* SectionLabel sits flush with the tab bar bottom edge */}
        <div className="pb-2 pr-1">
          <SectionLabel devLabel="npm run connect" label="Contact" />
        </div>
      </div>

      {/* ── Channel Bar ─────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2.5 px-5 py-[5px] border-b border-white/[0.04] shrink-0"
        style={{ backgroundColor: "#07070F" }}
      >
        <span className="text-[10px] font-mono" style={{ color: TOKEN.dim }}>
          Channel:
        </span>
        <span className="text-[10px] font-mono text-white/35">
          Contact API v1.0
        </span>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[10px] font-mono text-white/[0.13]">UTF-8</span>
          <span className="text-white/[0.09] text-[10px]">·</span>
          <span className="text-[10px] font-mono text-white/[0.13]">LF</span>
          <span className="text-white/[0.09] text-[10px]">·</span>
          <span className="text-[10px] font-mono text-white/[0.13]">TypeScript</span>
        </div>
      </div>

      {/* ── Console Output Body ──────────────────────────────────────────── */}
      <div className="flex-1 px-5 py-5 space-y-1.5">

        {/* — Preamble log lines — */}
        <ConsoleLine lineNumber={1} timestamp="09:41:03" delay={0.00} isVisible={isInView}>
          <span style={{ color: TOKEN.comment }}>
            {`// Initializing contact module...`}
          </span>
        </ConsoleLine>

        <ConsoleLine lineNumber={2} timestamp="09:41:03" delay={0.11} isVisible={isInView}>
          <span style={{ color: TOKEN.comment }}>
            {`// Loading endpoint configuration...`}
          </span>
        </ConsoleLine>

        <ConsoleLine lineNumber={3} timestamp="09:41:04" delay={0.22} isVisible={isInView}>
          <span style={{ color: TOKEN.comment }}>
            {`// All systems nominal. Ready to receive.`}
          </span>
        </ConsoleLine>

        <div className="h-3" aria-hidden="true" />

        {/* — contact.send() call — */}
        <ConsoleLine lineNumber={5} delay={0.36} isVisible={isInView}>
          <span style={{ color: TOKEN.dim }}>
            {">"}&nbsp;
          </span>
          <span style={{ color: TOKEN.identifier }}>contact</span>
          <span style={{ color: TOKEN.punct }}>.</span>
          <span style={{ color: TOKEN.fn }}>send</span>
          <span style={{ color: TOKEN.punct }}>{"({"}</span>
        </ConsoleLine>

        {/* — email property — */}
        <ConsoleLine lineNumber={6} delay={0.46} isVisible={isInView}>
          <span className="pl-5 flex items-center flex-wrap gap-0">
            <span style={{ color: TOKEN.identifier }}>email</span>
            <span style={{ color: TOKEN.punct }}>:&nbsp;</span>

            <button
              type="button"
              onClick={handleEmailCopy}
              className="group/email focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/40 rounded-[2px]"
              aria-label={`Copy email address: ${EMAIL}`}
              title="Click to copy email address"
            >
              <span
                className="transition-opacity duration-150 group-hover/email:opacity-50"
                style={{ color: TOKEN.string }}
              >
                &apos;{EMAIL}&apos;
              </span>
            </button>

            <span style={{ color: TOKEN.punct }}>,</span>

            <motion.span
              className="ml-4 text-[10.5px] font-mono"
              initial={{ opacity: 0 }}
              animate={
                isInView
                  ? { opacity: emailCopied ? 1 : 0.35 }
                  : { opacity: 0 }
              }
              transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
              style={{ color: emailCopied ? TOKEN.success : TOKEN.dim }}
            >
              {emailCopied ? "// ✓ copied to clipboard" : "// click to copy"}
            </motion.span>
          </span>
        </ConsoleLine>

        {/* — linkedin property — */}
        <ConsoleLine lineNumber={7} delay={0.56} isVisible={isInView}>
          <span className="pl-5 flex items-center flex-wrap gap-0">
            <span style={{ color: TOKEN.identifier }}>linkedin</span>
            <span style={{ color: TOKEN.punct }}>:&nbsp;</span>

            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group/li focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/40 rounded-[2px]"
              aria-label={`Open LinkedIn profile: ${LINKEDIN_HANDLE}`}
              title="Open LinkedIn profile in a new tab"
            >
              <span
                className="transition-opacity duration-150 group-hover/li:opacity-50"
                style={{ color: TOKEN.string }}
              >
                &apos;{LINKEDIN_HANDLE}&apos;
              </span>
            </a>

            <span style={{ color: TOKEN.punct }}>,</span>

            <span
              className="ml-4 text-[10.5px] font-mono"
              style={{ color: TOKEN.dim }}
            >
              {"// ↗ opens in new tab"}
            </span>
          </span>
        </ConsoleLine>

        {/* — closing bracket — */}
        <ConsoleLine lineNumber={8} delay={0.66} isVisible={isInView}>
          <span style={{ color: TOKEN.punct }}>{"})"}</span>
        </ConsoleLine>

        <div className="h-3" aria-hidden="true" />

        {/* — Success response — */}
        <ConsoleLine lineNumber={10} timestamp="09:41:05" delay={0.80} isVisible={isInView}>
          <span style={{ color: TOKEN.success }}>[SUCCESS]&nbsp;</span>
          <span style={{ color: "rgba(255,255,255,0.35)" }}>
            Message endpoint initialised. Awaiting your signal.
          </span>
        </ConsoleLine>

        {/* — Live cursor — */}
        <ConsoleLine lineNumber={11} delay={0.92} isVisible={isInView}>
          <span style={{ color: TOKEN.dim }}>{">"}&nbsp;</span>
          <span
            className="inline-block w-[7px] h-[13px] translate-y-[2px] bg-accent/75"
            style={{ animation: "vscode-cursor-blink 1.15s step-end infinite" }}
            aria-hidden="true"
          />
        </ConsoleLine>
      </div>

      {/* ── VS Code Status Bar ───────────────────────────────────────────── */}
      <div
        className="h-[22px] border-t border-white/[0.04] px-4 flex items-center gap-3 shrink-0"
        style={{ backgroundColor: "#09091A" }}
      >
        {/* Ready indicator */}
        <span
          className="text-[10px] font-mono flex items-center gap-1.5"
          style={{ color: TOKEN.success }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full bg-current"
            aria-hidden="true"
          />
          READY
        </span>

        <span className="text-white/[0.07] text-[10px]" aria-hidden="true">|</span>

        <span className="text-[10px] font-mono text-white/[0.22]">contact.ts</span>

        <span className="ml-auto text-[10px] font-mono text-white/[0.10]">
          Ln 11, Col 3
        </span>
        <span className="text-white/[0.07] text-[10px]" aria-hidden="true">·</span>
        <span className="text-[10px] font-mono text-white/[0.18]">TypeScript JSX</span>
      </div>
    </section>
  );
}
