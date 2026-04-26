'use client'

import { Button } from '@/components/ui/button'
import { AuiDragHandle } from './AuiDragHandle'
import { Gear, X } from '@phosphor-icons/react'

interface AuiExplainerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuiExplainer({ open, onOpenChange }: AuiExplainerProps) {
  if (!open) return null

  return (
    <>
      <div 
        className="absolute inset-0 bg-black/50 z-40"
        onClick={() => onOpenChange(false)}
      />
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-[var(--aui-eerie)] border-t border-[var(--aui-mist-15)] rounded-t-3xl p-5 pb-8 animate-[slideUp_0.25s_ease-out_both]">
        <AuiDragHandle />
        
        <div className="flex items-center justify-between mb-4">
          <span 
            className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--aui-mist-50)]"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            How does this work?
          </span>
          <button 
            onClick={() => onOpenChange(false)}
            className="w-7 h-7 rounded-full bg-[var(--aui-mist-08)] flex items-center justify-center"
          >
            <X size={14} className="text-[var(--aui-mist-50)]" />
          </button>
        </div>
        
        <div 
          className="space-y-3 text-[14px] text-[var(--aui-mist-70)] leading-relaxed mb-6"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          <p>The AI listened to your call privately on your device.</p>
          <p>Nothing was sent to any server.</p>
          <p>You can turn this off any time in Settings.</p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="flex-1 h-11 text-[var(--aui-mist-50)] hover:text-[var(--aui-mist)] hover:bg-[var(--aui-mist-08)] rounded-xl"
            onClick={() => {}}
          >
            <Gear size={16} className="mr-2" />
            <span style={{ fontFamily: 'var(--font-geist-sans)' }}>Open Settings</span>
          </Button>
          <Button
            className="flex-1 h-11 bg-[var(--aui-fire)] hover:bg-[var(--aui-fire)]/90 text-white rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            <span style={{ fontFamily: 'var(--font-geist-sans)' }}>Got it</span>
          </Button>
        </div>
      </div>
    </>
  )
}
