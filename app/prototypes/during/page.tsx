'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PhoneFrame, AuiCard, AuiTag, AuiPulse, AuiDragHandle, AuiExplainer } from '@/components/aui'
import type { OSType } from '@/components/aui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import {
  Microphone,
  MicrophoneSlash,
  SpeakerHigh,
  Pause,
  PhoneX,
  SquaresFour,
  Plus,
  Bluetooth,
  VideoCamera,
  PaperPlaneTilt,
  X,
  Calendar,
  ArrowRight,
  CloudSun,
  CurrencyCircleDollar,
  TextAa,
} from '@phosphor-icons/react'

type CallState = 'idle' | 'listening' | 'thinking' | 'answered' | 'dismissed'

interface QueryAnswer {
  query: string
  answer: string
  detail: string
}

const queryAnswers: Record<string, QueryAnswer> = {
  schedule: {
    query: 'Thursday schedule',
    answer: 'Thursday is clear',
    detail: 'No events · Next: Friday 10am - Team sync',
  },
  spell: {
    query: 'Spell a name',
    answer: 'G · R · Z · E · G · O · R · Z',
    detail: "Polish given name · 'Gzheh-gosh'",
  },
  weather: {
    query: 'Weather today',
    answer: '24°C, sunny',
    detail: 'Tel Aviv · High 27° · No rain',
  },
  currency: {
    query: 'Convert currency',
    answer: '≈ €1,980',
    detail: 'Rate: 1 ILS = 0.2475 EUR',
  },
  custom: {
    query: 'Custom query',
    answer: 'Got it',
    detail: 'Answer ready · tap to expand',
  },
}

export default function DuringTheCallPage() {
  const router = useRouter()
  const [os, setOs] = useState<OSType>('ios')
  const [state, setState] = useState<CallState>('idle')
  const [querySheetOpen, setQuerySheetOpen] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState<QueryAnswer | null>(null)
  const [showTooltip, setShowTooltip] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [explainerOpen, setExplainerOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const handleHangup = () => {
    router.push('/prototypes/after')
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const timer = setInterval(() => {
      setCallDuration((d) => d + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [mounted])

  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showTooltip])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAssistantHold = () => {
    setState('listening')
    setQuerySheetOpen(true)
    setShowTooltip(false)
  }

  const handleQuerySubmit = (queryKey: string, customText?: string) => {
    setQuerySheetOpen(false)
    setState('thinking')

    setTimeout(() => {
      if (queryKey === 'custom' && customText) {
        setCurrentAnswer({
          query: customText,
          answer: 'Got it',
          detail: 'Answer ready · tap to expand',
        })
      } else {
        setCurrentAnswer(queryAnswers[queryKey] || queryAnswers.custom)
      }
      setState('answered')
    }, 900)
  }

  const handleDismissAnswer = () => {
    setCurrentAnswer(null)
    setState('idle')
  }

  const stageLabels: Record<CallState, string> = {
    idle: 'Active Call · Idle',
    listening: 'Assistant · Listening',
    thinking: 'Assistant · Thinking',
    answered: 'Answer Delivered',
    dismissed: 'Active Call · Idle',
  }

  return (
    <main className="min-h-screen bg-[var(--aui-space)] flex items-center justify-center py-16">
      <PhoneFrame os={os} onOsChange={setOs} stageLabel={stageLabels[state]}>
        <div className="relative h-full" style={{ height: '100%' }}>
          <CallScreen
            os={os}
            state={state}
            callDuration={mounted ? callDuration : 0}
            formatDuration={formatDuration}
            showTooltip={showTooltip}
            currentAnswer={currentAnswer}
            onAssistantHold={handleAssistantHold}
            onDismissAnswer={handleDismissAnswer}
            onExplain={() => setExplainerOpen(true)}
            onHangup={handleHangup}
          />

          <QuerySheet
            open={querySheetOpen}
            onOpenChange={setQuerySheetOpen}
            onQuerySubmit={handleQuerySubmit}
          />
          <AuiExplainer open={explainerOpen} onOpenChange={setExplainerOpen} />
        </div>
      </PhoneFrame>
    </main>
  )
}

function CallScreen({
  os,
  state,
  callDuration,
  formatDuration,
  showTooltip,
  currentAnswer,
  onAssistantHold,
  onDismissAnswer,
  onExplain,
  onHangup,
}: {
  os: OSType
  state: CallState
  callDuration: number
  formatDuration: (s: number) => string
  showTooltip: boolean
  currentAnswer: QueryAnswer | null
  onAssistantHold: () => void
  onDismissAnswer: () => void
  onExplain: () => void
  onHangup: () => void
}) {
  const isIos = os === 'ios'

  // Samsung layout
  if (!isIos) {
    return (
      <div className="flex flex-col h-full relative bg-[#1a1a1a]">
        {/* Top area with call info */}
        <div className="flex-1 flex flex-col items-center pt-4 px-6">
          <div className="flex items-center gap-1.5 mb-1">
            <span 
              className="text-[13px] text-white/70 tracking-tight tabular-nums"
              style={{ fontFamily: 'var(--font-samsung)' }}
            >
              {formatDuration(callDuration)}
            </span>
          </div>

          <h1 
            className="text-[28px] font-normal text-white mb-0.5 tracking-tight"
            style={{ fontFamily: 'var(--font-samsung)' }}
          >
            Ran
          </h1>
          <p 
            className="text-[14px] text-white/60"
            style={{ fontFamily: 'var(--font-samsung)' }}
          >
            mobile
          </p>

          {state === 'answered' && currentAnswer && (
            <AnswerCard
              answer={currentAnswer}
              onDismiss={onDismissAnswer}
              onExplain={onExplain}
            />
          )}
        </div>

        {/* Bottom controls area */}
        <div className="px-4 pb-4">
          <CallControls os={os} />

          {/* AI Assistant button - positioned below the card */}
          <div className="relative flex flex-col items-center mt-4 mb-3">
            {showTooltip && (
              <div className="absolute -top-14 animate-[slideUp_0.3s_ease-out_both]">
                <div className="bg-[#1a1a1a]/90 backdrop-blur rounded-xl px-3 py-2 relative shadow-lg">
                  <p 
                    className="text-[11px] text-white/80"
                    style={{ fontFamily: 'var(--font-geist-sans)' }}
                  >
                    Hold to ask · private
                  </p>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-transparent border-t-[#1a1a1a]/90" />
                </div>
              </div>
            )}

            <button
              onMouseDown={onAssistantHold}
              onTouchStart={onAssistantHold}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-14 h-14 rounded-full bg-[var(--aui-fire)] flex items-center justify-center shadow-[0_4px_20px_rgba(255,107,0,0.5)] group-active:scale-95 transition-transform">
                {/* Simple sparkle/AI icon */}
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" fill="white"/>
                  <circle cx="18" cy="5" r="1.5" fill="white" fillOpacity="0.7"/>
                  <circle cx="6" cy="17" r="1" fill="white" fillOpacity="0.5"/>
                </svg>
              </div>
              <span 
                className="text-[9px] uppercase tracking-[0.1em] text-[var(--aui-fire)] font-semibold drop-shadow-sm"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                {state === 'thinking' ? 'THINKING…' : 'HOLD TO ASK'}
              </span>
            </button>
          </div>

          {/* End call button */}
          <button
            onClick={onHangup}
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-[#FF3B30] active:bg-[#D63028] transition-colors shadow-lg"
          >
            <PhoneX size={28} weight="fill" className="text-white" />
          </button>
        </div>
      </div>
    )
  }

  // iOS layout
  return (
    <div className="bg-[#1c1c1e] flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center pt-5 px-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-[#34C759] animate-[livePulse_1.2s_ease-in-out_infinite]" />
          <span 
            className="text-[13px] text-[#34C759] tracking-tight tabular-nums"
            style={{ fontFamily: 'var(--font-ios)' }}
          >
            {formatDuration(callDuration)}
          </span>
        </div>

        <h1 
          className="text-[32px] font-semibold text-white mb-0.5 tracking-tight"
          style={{ fontFamily: 'var(--font-ios)' }}
        >
          Ran
        </h1>
        <p 
          className="text-[15px] text-[#8E8E93]"
          style={{ fontFamily: 'var(--font-ios)' }}
        >
          mobile
        </p>

        {state === 'answered' && currentAnswer && (
          <AnswerCard
            answer={currentAnswer}
            onDismiss={onDismissAnswer}
            onExplain={onExplain}
          />
        )}
      </div>

      <div className="px-8 pb-6">
        <CallControls os={os} />

        <div className="relative flex flex-col items-center mt-4 mb-4">
          {showTooltip && (
            <div className="absolute -top-16 animate-[slideUp_0.3s_ease-out_both]">
              <div className="bg-[var(--aui-eerie)] border border-[var(--aui-fire)]/40 rounded-xl px-4 py-2.5 relative shadow-lg">
                <p 
                  className="text-[12px] text-[var(--aui-mist-70)]"
                  style={{ fontFamily: 'var(--font-geist-sans)' }}
                >
                  Only activates when you hold · private
                </p>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-[var(--aui-eerie)]" />
              </div>
            </div>
          )}

          <button
            onMouseDown={onAssistantHold}
            onTouchStart={onAssistantHold}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 rounded-full bg-[var(--aui-fire)] flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.4)] group-active:scale-95 transition-transform">
              {/* Simple sparkle/AI icon */}
              <svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" fill="white"/>
                <circle cx="18" cy="5" r="1.5" fill="white" fillOpacity="0.7"/>
                <circle cx="6" cy="17" r="1" fill="white" fillOpacity="0.5"/>
              </svg>
            </div>
            <span 
              className="text-[9px] uppercase tracking-[0.1em] text-[var(--aui-fire)] font-medium"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              {state === 'thinking' ? 'THINKING…' : 'HOLD TO ASK'}
            </span>
          </button>
        </div>

        <button
          onClick={onHangup}
          className="w-full h-[66px] rounded-full flex items-center justify-center bg-[#FF3B30] active:bg-[#D63028] transition-colors"
        >
          <PhoneX size={34} weight="fill" className="text-white" />
        </button>
      </div>
    </div>
  )
}

function CallControls({ os }: { os: OSType }) {
  const isIos = os === 'ios'

  const iosControls = [
    { icon: MicrophoneSlash, label: 'mute', active: false },
    { icon: SquaresFour, label: 'keypad', active: false },
    { icon: SpeakerHigh, label: 'audio', active: false },
    { icon: Pause, label: 'hold', active: false },
    { icon: Plus, label: 'add', active: false },
    { icon: VideoCamera, label: 'FaceTime', active: false },
  ]

  // Samsung layout matches real Samsung call screen:
  // Row 1: Add call, Hold call, Bluetooth
  // Row 2: Speaker, Mute, Keypad
  const samsungControls = [
    { icon: Plus, label: 'Add call', active: false },
    { icon: Pause, label: 'Hold call', active: false },
    { icon: Bluetooth, label: 'Bluetooth', active: false },
    { icon: SpeakerHigh, label: 'Speaker', active: false },
    { icon: MicrophoneSlash, label: 'Mute', active: false },
    { icon: SquaresFour, label: 'Keypad', active: false },
  ]

  const controls = isIos ? iosControls : samsungControls

  if (!isIos) {
    // Samsung uses a light card with 3x2 grid
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-[28px] p-5 shadow-lg">
        <div className="grid grid-cols-3 gap-x-8 gap-y-4">
          {controls.map((ctrl, i) => (
            <button
              key={i}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center">
                <ctrl.icon
                  size={24}
                  weight="regular"
                  className="text-[#1a1a1a]"
                />
              </div>
              <span 
                className="text-[10px] text-[#1a1a1a]"
                style={{ fontFamily: 'var(--font-samsung)' }}
              >
                {ctrl.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-y-5 gap-x-4">
      {controls.map((ctrl, i) => (
        <button
          key={i}
          className="flex flex-col items-center gap-1.5"
        >
          <div
            className="w-[66px] h-[66px] rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.1)] transition-colors"
          >
            <ctrl.icon
              size={30}
              weight={ctrl.active ? 'fill' : 'regular'}
              className={ctrl.active ? 'text-black' : 'text-white'}
            />
          </div>
          <span 
            className="text-[11px] text-white"
            style={{ fontFamily: 'var(--font-ios)' }}
          >
            {ctrl.label}
          </span>
        </button>
      ))}
    </div>
  )
}

function AnswerCard({
  answer,
  onDismiss,
  onExplain,
}: {
  answer: QueryAnswer
  onDismiss: () => void
  onExplain: () => void
}) {
  return (
    <div className="w-full mt-8 animate-[slideUp_0.28s_cubic-bezier(0.34,1.1,0.64,1)_both]">
      <AuiCard>
        <div className="flex items-center justify-between mb-3">
          <span 
            className="text-[10px] uppercase tracking-[0.1em] text-[var(--aui-mist-50)]"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            ANSWER
          </span>
          <button
            onClick={onDismiss}
            className="w-6 h-6 rounded-full bg-[var(--aui-mist-08)] flex items-center justify-center text-[var(--aui-mist-50)] hover:text-[var(--aui-mist)] transition-colors"
          >
            <X size={12} weight="bold" />
          </button>
        </div>

        <p 
          className="text-[13px] italic text-[var(--aui-mist-50)] mb-3"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          "{answer.query}"
        </p>

        <div className="flex items-start gap-2.5">
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2
              bg-[var(--aui-fire)]
              animate-[dotBreath_2.8s_ease-in-out_infinite]"
          />
          <div>
            <p 
              className="text-[18px] font-normal text-[var(--aui-mist)]"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              {answer.answer}
            </p>
            <p 
              className="text-[12px] font-light text-[var(--aui-mist-50)] mt-1"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              {answer.detail}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--aui-stroke)]">
          <AuiTag onExplain={onExplain} />
          <button className="text-[12px] text-[var(--aui-fire)] flex items-center gap-1 hover:underline">
            <span style={{ fontFamily: 'var(--font-geist-sans)' }}>Open in full</span>
            <ArrowRight size={12} weight="bold" />
          </button>
        </div>
      </AuiCard>
    </div>
  )
}

function QuerySheet({
  open,
  onOpenChange,
  onQuerySubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onQuerySubmit: (queryKey: string, customText?: string) => void
}) {
  const [inputValue, setInputValue] = useState('')

  const chips = [
    { key: 'schedule', icon: Calendar, label: 'Thursday schedule' },
    { key: 'spell', icon: TextAa, label: 'Spell a name' },
    { key: 'weather', icon: CloudSun, label: 'Weather today' },
    { key: 'currency', icon: CurrencyCircleDollar, label: 'Convert currency' },
  ]

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onQuerySubmit('custom', inputValue.trim())
      setInputValue('')
    }
  }

  if (!open) return null

  return (
    <>
      <div 
        className="absolute inset-0 bg-black/50 z-40"
        onClick={() => onOpenChange(false)}
      />
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-[var(--aui-eerie)] border-t border-[var(--aui-mist-15)] rounded-t-3xl p-5 pb-8 animate-[slideUp_0.25s_ease-out_both]">
        <AuiDragHandle />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--aui-fire)] animate-[aiPulse_1.2s_ease-in-out_infinite]" />
            <span 
              className="text-[10px] uppercase tracking-[0.15em] text-[var(--aui-fire)]"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              ASKING · PRIVATE
            </span>
          </div>
          <button 
            onClick={() => onOpenChange(false)}
            className="w-7 h-7 rounded-full bg-[var(--aui-mist-08)] flex items-center justify-center"
          >
            <X size={14} className="text-[var(--aui-mist-50)]" />
          </button>
        </div>

        <p 
          className="text-[13px] font-light text-[var(--aui-mist-50)] mb-4"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          Only you hear this. Nothing goes through the call.
        </p>

        <div className="relative mb-4">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {chips.map((chip) => (
              <Badge
                key={chip.key}
                variant="outline"
                className="flex-shrink-0 px-3 py-2 bg-[var(--aui-mist-08)] border-[var(--aui-mist-15)] text-[var(--aui-mist-70)] hover:bg-[var(--aui-mist-15)] cursor-pointer transition-colors rounded-full text-[13px]"
                onClick={() => onQuerySubmit(chip.key)}
              >
                <chip.icon size={14} className="mr-1.5" />
                <span style={{ fontFamily: 'var(--font-geist-sans)' }}>{chip.label}</span>
              </Badge>
            ))}
          </div>
          {/* Right fade indicator */}
          <div className="absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-[var(--aui-eerie)] to-transparent pointer-events-none" />
        </div>

        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything…"
            className="flex-1 h-11 bg-[var(--aui-elevated)] border-[var(--aui-mist-15)] text-[var(--aui-mist)] placeholder:text-[var(--aui-mist-30)] rounded-xl"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button
            size="icon"
            className="w-11 h-11 bg-[var(--aui-fire)] hover:bg-[var(--aui-fire)]/90 rounded-xl"
            onClick={handleSubmit}
          >
            <PaperPlaneTilt size={18} className="text-white" />
          </Button>
        </div>
      </div>
    </>
  )
}
