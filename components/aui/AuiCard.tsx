'use client'

interface AuiCardProps {
  children: React.ReactNode
  className?: string
}

export function AuiCard({ children, className = '' }: AuiCardProps) {
  return (
    <div className={`
      bg-[var(--aui-eerie)] border border-[var(--aui-mist-15)]
      rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]
      p-5
      ${className}
    `}>
      {children}
    </div>
  )
}
