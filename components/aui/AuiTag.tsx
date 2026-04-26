'use client'

interface AuiTagProps {
  onExplain?: () => void
}

export function AuiTag({ onExplain }: AuiTagProps) {
  return (
    <span
      className="font-mono text-[9px] uppercase tracking-[0.08em]
        text-[var(--aui-fire)] opacity-70 cursor-pointer
        hover:opacity-100 transition-opacity duration-150"
      onClick={onExplain}
    >
      AI
    </span>
  )
}
