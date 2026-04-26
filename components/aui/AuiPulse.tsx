'use client'

import { Microphone, Sparkle, Check } from '@phosphor-icons/react'

type PulseState = 'idle' | 'listening' | 'thinking' | 'done'

interface AuiPulseProps {
  state: PulseState
  size?: 'sm' | 'md' | 'lg'
}

export function AuiPulse({ state, size = 'md' }: AuiPulseProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  }

  const iconSizes = {
    sm: 12,
    md: 18,
    lg: 24,
  }

  if (state === 'idle') {
    return (
      <div
        className={`
          ${sizeClasses[size]} rounded-full
          bg-[var(--aui-fire-dim)]
          border-[1.5px] border-[var(--aui-fire-glow)]
          flex items-center justify-center
          animate-[aiPulse_1.8s_ease-in-out_infinite]
        `}
      >
        <Sparkle
          size={iconSizes[size]}
          weight="fill"
          className="text-[var(--aui-fire)]"
        />
      </div>
    )
  }

  if (state === 'listening') {
    return (
      <div className="relative">
        <div
          className={`
            ${sizeClasses[size]} rounded-full
            bg-[var(--aui-fire-dim)]
            border-[1.5px] border-[var(--aui-fire-glow)]
            flex items-center justify-center
          `}
        >
          <Microphone
            size={iconSizes[size]}
            weight="fill"
            className="text-[var(--aui-fire)]"
          />
        </div>
        <div
          className="absolute inset-0 rounded-full border border-[var(--aui-fire)]
            animate-[listenRing_1.2s_ease-out_infinite]"
        />
      </div>
    )
  }

  if (state === 'thinking') {
    return (
      <div
        className={`
          ${sizeClasses[size]} rounded-full
          flex items-center justify-center
          animate-[spinDash_0.8s_linear_infinite]
        `}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-full h-full"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="var(--aui-fire)"
            strokeOpacity="0.5"
            strokeWidth="2"
            strokeDasharray="4 6"
          />
        </svg>
      </div>
    )
  }

  if (state === 'done') {
    return (
      <div
        className={`
          ${sizeClasses[size]} rounded-full
          bg-[var(--aui-fire-dim)]
          border border-[var(--aui-fire-glow)]
          flex items-center justify-center
          animate-[checkPop_0.3s_cubic-bezier(0.34,1.56,0.64,1)_both]
        `}
      >
        <Check
          size={iconSizes[size]}
          weight="bold"
          className="text-[var(--aui-fire)]"
        />
      </div>
    )
  }

  return null
}
