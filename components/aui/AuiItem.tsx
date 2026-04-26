'use client'

import { AuiTag } from './AuiTag'

interface AuiItemProps {
  children: React.ReactNode
  onDismiss?: () => void
  onExplain?: () => void
  confirmed?: boolean
}

export function AuiItem({ children, onDismiss, onExplain, confirmed = false }: AuiItemProps) {
  return (
    <div className={`
      flex items-center gap-3 py-3
      border-b border-[var(--aui-stroke)]
      transition-all duration-150
      ${confirmed ? 'opacity-100' : ''}
    `}>
      {!confirmed && (
        <div className="
          w-1.5 h-1.5 rounded-full flex-shrink-0
          bg-[var(--aui-fire)]
          animate-[dotBreath_2.8s_ease-in-out_infinite]
        " />
      )}

      <div className={`
        flex-1 text-[14px] leading-relaxed tracking-[-0.01em]
        ${confirmed
          ? 'font-normal text-[var(--aui-mist)]'
          : 'font-light text-[var(--aui-mist-70)]'
        }
      `}>
        {children}
      </div>

      {!confirmed && (
        <>
          <AuiTag onExplain={onExplain} />
          <button
            onClick={onDismiss}
            className="
              w-6 h-6 rounded-full flex-shrink-0
              flex items-center justify-center
              text-[var(--aui-mist-30)] bg-transparent border-none
              hover:bg-[var(--aui-mist-08)] hover:text-[var(--aui-mist-50)]
              transition-all duration-150
              active:scale-90
            "
            aria-label="Dismiss"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </>
      )}

      {confirmed && (
        <div className="
          w-5 h-5 rounded-full flex-shrink-0
          bg-[var(--aui-fire-dim)] border border-[var(--aui-fire-glow)]
          flex items-center justify-center
          animate-[checkPop_0.3s_cubic-bezier(0.34,1.56,0.64,1)_both]
        ">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="var(--aui-fire)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  )
}
