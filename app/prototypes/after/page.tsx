'use client'

import { useState, useEffect } from 'react'
import { PhoneFrame, AuiCard, AuiItem, AuiTag, AuiPulse, AuiDragHandle, AuiExplainer, usePhoneOS } from '@/components/aui'
import type { OSType } from '@/components/aui'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type FlowState = 'call-ended' | 'consent' | 'understand' | 'confirm' | 'done' | 'draft'

interface UnderstandItem {
  id: string
  text: string
  group: 'you' | 'they' | 'remember'
  dismissed: boolean
}

const initialUnderstandItems: UnderstandItem[] = [
  { id: '1', text: 'Send the contract to Ran by Friday', group: 'you', dismissed: false },
  { id: '2', text: 'Check the delivery date with the supplier', group: 'you', dismissed: false },
  { id: '3', text: 'Call back next week with a decision', group: 'they', dismissed: false },
  { id: '4', text: 'Budget mentioned: around 8,000', group: 'remember', dismissed: false },
  { id: '5', text: 'Meeting suggested for Thursday the 15th', group: 'remember', dismissed: false },
]

export default function AfterTheCallPage() {
  const [os, setOs] = useState<OSType>('ios')
  const [state, setState] = useState<FlowState>('call-ended')
  const [items, setItems] = useState(initialUnderstandItems)
  const [draftSheetOpen, setDraftSheetOpen] = useState(false)
  const [showAlwaysAllow, setShowAlwaysAllow] = useState(false)
  const [undoTimer, setUndoTimer] = useState(59)
  const [explainerOpen, setExplainerOpen] = useState(false)
  const [callEndedSeconds, setCallEndedSeconds] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (state === 'call-ended' && mounted) {
      const timer = setTimeout(() => setState('consent'), 1500)
      const counter = setInterval(() => setCallEndedSeconds(s => s + 1), 1000)
      return () => {
        clearTimeout(timer)
        clearInterval(counter)
      }
    }
  }, [state, mounted])

  useEffect(() => {
    if (state === 'done') {
      const allowTimer = setTimeout(() => setShowAlwaysAllow(true), 600)
      const undoInterval = setInterval(() => {
        setUndoTimer((t) => (t > 0 ? t - 1 : 0))
      }, 1000)
      return () => {
        clearTimeout(allowTimer)
        clearInterval(undoInterval)
      }
    }
  }, [state])

  const handleReset = () => {
    setState('call-ended')
    setItems(initialUnderstandItems)
    setShowAlwaysAllow(false)
    setUndoTimer(59)
    setCallEndedSeconds(0)
  }

  const handleDismissItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, dismissed: true } : item
      )
    )
  }

  const stageLabels: Record<FlowState, string> = {
    'call-ended': 'Call Ended',
    consent: 'Consent Card',
    understand: 'Step 1 · Understood',
    confirm: 'Step 2 · Confirm',
    done: 'Step 3 · Done',
    draft: 'Draft Review',
  }

  const fontFamily = os === 'ios' ? 'var(--font-ios)' : 'var(--font-samsung)'

  return (
    <main className="min-h-screen bg-[var(--aui-space)] flex items-center justify-center py-16">
      <PhoneFrame os={os} onOsChange={setOs} stageLabel={stageLabels[state]}>
        <div className="relative h-full" style={{ minHeight: os === 'ios' ? 759 : 724, fontFamily }}>
          <div className="h-full flex flex-col">
            {(state === 'call-ended' || state === 'consent') && (
              <CallEndedScreen
                os={os}
                showConsent={state === 'consent'}
                seconds={mounted ? callEndedSeconds : 0}
                onAccept={() => setState('understand')}
                onDecline={handleReset}
              />
            )}

            {state === 'understand' && (
              <UnderstandScreen
                os={os}
                items={items.filter((i) => !i.dismissed)}
                onDismiss={handleDismissItem}
                onContinue={() => setState('confirm')}
                onExplain={() => setExplainerOpen(true)}
              />
            )}

            {state === 'confirm' && (
              <ConfirmScreen
                os={os}
                onConfirm={() => setState('done')}
                onBack={() => setState('understand')}
              />
            )}

            {state === 'done' && (
              <DoneScreen
                os={os}
                showAlwaysAllow={showAlwaysAllow}
                undoTimer={mounted ? undoTimer : 59}
                onUndo={handleReset}
                onDraftTap={() => setDraftSheetOpen(true)}
                onFinish={handleReset}
                onAlwaysAllow={handleReset}
              />
            )}
          </div>

          <DraftSheet
            open={draftSheetOpen}
            onOpenChange={setDraftSheetOpen}
            onExplain={() => setExplainerOpen(true)}
          />
          <AuiExplainer open={explainerOpen} onOpenChange={setExplainerOpen} />
        </div>
      </PhoneFrame>
    </main>
  )
}

function CallEndedScreen({
  os,
  showConsent,
  seconds,
  onAccept,
  onDecline,
}: {
  os: OSType
  showConsent: boolean
  seconds: number
  onAccept: () => void
  onDecline: () => void
}) {
  const isIos = os === 'ios'
  const fontFamily = isIos ? 'var(--font-ios)' : 'var(--font-samsung)'

  return (
    <div className="flex-1 flex flex-col bg-[#1c1c1e] relative" style={{ fontFamily }}>
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <Avatar className="w-28 h-28 mb-6">
          <AvatarFallback 
            className="text-4xl font-light bg-[#3a3a3c] text-white"
            style={{ fontFamily }}
          >
            R
          </AvatarFallback>
        </Avatar>

        <h1 
          className="text-[28px] font-light text-white mb-2 tracking-tight"
          style={{ fontFamily }}
        >
          Ran
        </h1>

        <p 
          className="text-[15px] text-[#8e8e93] mb-8"
          style={{ fontFamily }}
        >
          Call Ended
        </p>

        <div className="flex items-center gap-3 text-[#8e8e93]">
          <div className="flex items-center gap-2">
            {/* Phone icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z"/>
            </svg>
            <span className="text-[14px]" style={{ fontFamily }}>22 min</span>
          </div>
          <span>·</span>
          <span className="text-[14px] tabular-nums" style={{ fontFamily }}>{seconds}s ago</span>
        </div>
      </div>

      {/* Consent card overlay */}
      {showConsent && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10" />
          
          <div className="absolute bottom-0 left-0 right-0 z-20 animate-[slideUp_0.35s_cubic-bezier(0.16,1,0.3,1)_both]">
            <AuiCard className="rounded-b-none rounded-t-[32px] pb-10">
              <AuiDragHandle />

              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-14 h-14">
                  <AvatarFallback 
                    className="bg-[var(--aui-mist-08)] text-[var(--aui-mist)] text-xl font-light"
                    style={{ fontFamily: 'var(--font-geist-sans)' }}
                  >
                    R
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p 
                    className="text-[17px] font-medium text-[var(--aui-mist)]"
                    style={{ fontFamily: 'var(--font-geist-sans)' }}
                  >
                    Ran
                  </p>
                  <p 
                    className="text-[10px] uppercase tracking-[0.12em] text-[var(--aui-fire)]"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}
                  >
                    22 MIN CALL ENDED
                  </p>
                </div>
              </div>

              <p 
                className="text-[26px] font-light text-[var(--aui-mist)] leading-[1.15] mb-8"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                Want my help
                <br />
                <span className="font-medium">with this call?</span>
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  className="w-full h-[54px] bg-[var(--aui-fire)] hover:bg-[var(--aui-fire)]/90 text-white text-[17px] font-medium rounded-2xl"
                  style={{ fontFamily: 'var(--font-geist-sans)' }}
                  onClick={onAccept}
                >
                  Yes, help me
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-[48px] text-[var(--aui-mist-50)] hover:text-[var(--aui-mist)] hover:bg-[var(--aui-mist-08)] text-[16px] rounded-xl"
                  style={{ fontFamily: 'var(--font-geist-sans)' }}
                  onClick={onDecline}
                >
                  Not now
                </Button>
              </div>
            </AuiCard>
          </div>
        </>
      )}
    </div>
  )
}

function UnderstandScreen({
  os,
  items,
  onDismiss,
  onContinue,
  onExplain,
}: {
  os: OSType
  items: UnderstandItem[]
  onDismiss: (id: string) => void
  onContinue: () => void
  onExplain: () => void
}) {
  const youItems = items.filter((i) => i.group === 'you')
  const theyItems = items.filter((i) => i.group === 'they')
  const rememberItems = items.filter((i) => i.group === 'remember')

  return (
    <div className="flex-1 flex flex-col bg-[var(--aui-space)]">
      <div className="px-5 pt-6 pb-4">
        <StepDots current={1} />

        <div className="flex items-center gap-2.5 mb-3">
          <AuiPulse state="idle" size="sm" />
          <span 
            className="text-[10px] uppercase tracking-[0.15em] text-[var(--aui-fire)]"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            HERE&apos;S WHAT I UNDERSTOOD
          </span>
        </div>

        <h1 
          className="text-[24px] font-light text-[var(--aui-mist)] mb-1"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          From your call with Ran
        </h1>
        <p 
          className="text-[13px] font-light text-[var(--aui-mist-50)]"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          Tap × to remove anything that&apos;s wrong
        </p>

        <div className="h-px bg-[var(--aui-stroke)] mt-5" />
      </div>

      <div className="flex-1 overflow-auto px-5 pb-4">
        {youItems.length > 0 && (
          <ItemGroup
            label="YOU SAID YOU'D"
            items={youItems}
            onDismiss={onDismiss}
            onExplain={onExplain}
          />
        )}

        {theyItems.length > 0 && (
          <ItemGroup
            label="THEY SAID THEY'D"
            items={theyItems}
            onDismiss={onDismiss}
            onExplain={onExplain}
          />
        )}

        {rememberItems.length > 0 && (
          <ItemGroup
            label="WORTH REMEMBERING"
            items={rememberItems}
            onDismiss={onDismiss}
            onExplain={onExplain}
          />
        )}

        <button className="w-full flex items-center gap-3 py-4 border border-dashed border-[var(--aui-mist-15)] rounded-xl mt-5 hover:border-[var(--aui-mist-30)] transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-4 text-[var(--aui-mist-30)]">
            <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span 
            className="text-[13px] text-[var(--aui-mist-30)]"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Anything missing? Add it here
          </span>
        </button>
      </div>

      <div className="p-5 border-t border-[var(--aui-stroke)]">
        <Button
          className="w-full h-[54px] bg-[var(--aui-fire)] hover:bg-[var(--aui-fire)]/90 text-white text-[17px] font-medium rounded-2xl"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
          onClick={onContinue}
        >
          Looks good →
        </Button>
      </div>
    </div>
  )
}

function ItemGroup({
  label,
  items,
  onDismiss,
  onExplain,
}: {
  label: string
  items: UnderstandItem[]
  onDismiss: (id: string) => void
  onExplain: () => void
}) {
  return (
    <div className="mt-5">
      <p 
        className="text-[10px] uppercase tracking-[0.15em] text-[var(--aui-mist-50)] mb-2"
        style={{ fontFamily: 'var(--font-geist-mono)' }}
      >
        {label}
      </p>
      {items.map((item, index) => (
        <div
          key={item.id}
          className="animate-[slideUp_0.28s_ease-out_both]"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <AuiItem onDismiss={() => onDismiss(item.id)} onExplain={onExplain}>
            <HighlightedText text={item.text} />
          </AuiItem>
        </div>
      ))}
    </div>
  )
}

function HighlightedText({ text }: { text: string }) {
  const keywords = ['Friday', 'delivery date', 'supplier', 'next week', '8,000', 'Thursday the 15th', 'contract', 'Ran']
  
  let result = text
  keywords.forEach((keyword) => {
    result = result.replace(
      new RegExp(`(${keyword})`, 'gi'),
      '<em class="not-italic font-normal text-[var(--aui-mist)]">$1</em>'
    )
  })
  
  return <span dangerouslySetInnerHTML={{ __html: result }} style={{ fontFamily: 'var(--font-geist-sans)' }} />
}

function ConfirmScreen({
  os,
  onConfirm,
  onBack,
}: {
  os: OSType
  onConfirm: () => void
  onBack: () => void
}) {
  const actions = [
    {
      iconPath: 'M4 4h8v2H4V4zm0 4h8v2H4V8zm0 4h5v2H4v-2z',
      iconBg: 'bg-[var(--aui-fire-dim)]',
      iconColor: 'text-[var(--aui-fire)]',
      title: 'Add to Calendar',
      detail: 'Thursday 15th, meeting with Ran',
    },
    {
      iconPath: 'M3 3h10v10H3V3zm2 2v6h6V5H5z',
      iconBg: 'bg-[var(--aui-fire-dim)]',
      iconColor: 'text-[var(--aui-fire)]',
      title: 'Save a note',
      detail: 'Budget ~8,000 · check delivery date',
    },
    {
      iconPath: 'M2 4h12v8H4l-2 2V4zm2 2v4h8V6H4z',
      iconBg: 'bg-[var(--aui-fire-dim)]',
      iconColor: 'text-[var(--aui-fire)]',
      title: 'Draft a message to Ran',
      detail: "Contract reminder, you'll review first",
    },
  ]

  return (
    <div className="flex-1 flex flex-col bg-[var(--aui-space)]">
      <div className="px-5 pt-6 pb-4">
        <StepDots current={2} />

        <p 
          className="text-[10px] uppercase tracking-[0.15em] text-[var(--aui-fire)] mb-2"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          HERE&apos;S WHAT I&apos;LL DO
        </p>

        <h1 
          className="text-[24px] font-light text-[var(--aui-mist)]"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          Review before I act
        </h1>

        <div className="h-px bg-[var(--aui-stroke)] mt-5" />
      </div>

      <div className="flex-1 px-5 pb-4">
        {actions.map((action, index) => (
          <Card
            key={index}
            className="bg-[var(--aui-eerie)] border-[var(--aui-mist-15)] p-4 mb-3 animate-[slideUp_0.28s_ease-out_both]"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${action.iconBg} flex items-center justify-center`}>
                <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" className={action.iconColor}>
                  <path d={action.iconPath}/>
                </svg>
              </div>
              <div>
                <p 
                  className="text-[15px] font-normal text-[var(--aui-mist)]"
                  style={{ fontFamily: 'var(--font-geist-sans)' }}
                >
                  {action.title}
                </p>
                <p 
                  className="text-[12px] font-light text-[var(--aui-mist-50)]"
                  style={{ fontFamily: 'var(--font-geist-sans)' }}
                >
                  {action.detail}
                </p>
              </div>
            </div>
          </Card>
        ))}

        <p 
          className="text-[12px] font-light text-[var(--aui-mist-30)] text-center mt-5"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          Nothing happens until you tap below
        </p>
      </div>

      <div className="p-5 border-t border-[var(--aui-stroke)] space-y-3">
        <Button
          className="w-full h-[54px] bg-[var(--aui-fire)] hover:bg-[var(--aui-fire)]/90 text-white text-[17px] font-medium rounded-2xl"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
          onClick={onConfirm}
        >
          Do it
        </Button>
        <Button
          variant="ghost"
          className="w-full h-[44px] text-[var(--aui-mist-50)] hover:text-[var(--aui-mist)] hover:bg-[var(--aui-mist-08)] rounded-xl"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
          onClick={onBack}
        >
          ← Go back
        </Button>
      </div>
    </div>
  )
}

function DoneScreen({
  os,
  showAlwaysAllow,
  undoTimer,
  onUndo,
  onDraftTap,
  onFinish,
  onAlwaysAllow,
}: {
  os: OSType
  showAlwaysAllow: boolean
  undoTimer: number
  onUndo: () => void
  onDraftTap: () => void
  onFinish: () => void
  onAlwaysAllow: () => void
}) {
  const completedItems = [
    { title: 'Thursday 15th added', detail: 'Calendar · Meeting with Ran' },
    { title: 'Note saved', detail: 'Budget ~8,000 · delivery date' },
  ]

  return (
    <div className="flex-1 flex flex-col bg-[var(--aui-space)]">
      <div className="px-5 pt-6 pb-4">
        <StepDots current={3} />

        <div className="flex items-center gap-2.5 mb-3">
          <AuiPulse state="done" size="sm" />
          <span 
            className="text-[10px] uppercase tracking-[0.15em] text-[var(--aui-fire)]"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            DONE
          </span>
        </div>

        <h1 
          className="text-[24px] font-light text-[var(--aui-mist)]"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          All taken care of
        </h1>

        <div className="h-px bg-[var(--aui-stroke)] mt-5" />
      </div>

      <div className="flex-1 overflow-auto px-5 pb-4">
        {completedItems.map((item, index) => (
          <Card
            key={index}
            className="bg-[var(--aui-eerie)] border-[var(--aui-mist-15)] p-4 mb-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--aui-fire-dim)] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4h8v2H4V4zm0 4h8v2H4V8zm0 4h5v2H4v-2z" fill="var(--aui-fire)"/>
                </svg>
              </div>
              <div className="flex-1">
                <p 
                  className="text-[15px] font-normal text-[var(--aui-mist)]"
                  style={{ fontFamily: 'var(--font-geist-sans)' }}
                >
                  {item.title}
                </p>
                <p 
                  className="text-[12px] font-light text-[var(--aui-mist-50)]"
                  style={{ fontFamily: 'var(--font-geist-sans)' }}
                >
                  {item.detail}
                </p>
              </div>
              <div
                className="w-6 h-6 rounded-full bg-[var(--aui-fire-dim)] border border-[var(--aui-fire-glow)] flex items-center justify-center animate-[checkPop_0.3s_cubic-bezier(0.34,1.56,0.64,1)_both]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path d="M1 5L4 8L11 1" stroke="var(--aui-fire)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Card>
        ))}

        {/* Pending draft */}
        <Card
          className="bg-[var(--aui-fire-dim)] border-[var(--aui-fire-glow)] p-4 mb-4 cursor-pointer hover:border-[var(--aui-fire)] transition-colors"
          onClick={onDraftTap}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(255,179,64,0.15)] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="var(--aui-fire)">
                <path d="M2 4h12v8H4l-2 2V4zm2 2v4h8V6H4z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p 
                className="text-[15px] font-normal text-[var(--aui-mist)]"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                Draft ready for Ran
              </p>
              <p 
                className="text-[12px] font-light text-[var(--aui-fire)]"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                Tap to review before sending →
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[var(--aui-fire)]">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </Card>

        <p 
          className="text-[12px] font-light text-[var(--aui-mist-30)] text-center"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          <button onClick={onUndo} className="underline hover:text-[var(--aui-mist-50)] transition-colors">
            Undo everything
          </button>
          {' · '}{undoTimer}s
        </p>

        {showAlwaysAllow && (
          <Card className="bg-[var(--aui-elevated)] border-[var(--aui-mist-15)] p-5 mt-5 animate-[slideUp_0.3s_ease-out_both]">
            <p 
              className="text-[14px] font-normal text-[var(--aui-mist-70)] leading-[1.5] mb-4"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              Do this automatically after every call?
              <br />
              <span className="text-[var(--aui-mist-50)]">You can turn it off any time.</span>
            </p>
            <div className="flex gap-2">
              <Button
                className="flex-1 h-11 bg-[var(--aui-fire-dim)] hover:bg-[var(--aui-fire-dim)]/80 text-[var(--aui-fire)] border border-[var(--aui-fire-glow)] rounded-xl"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
                onClick={onAlwaysAllow}
              >
                Yes, always
              </Button>
              <Button
                variant="ghost"
                className="flex-1 h-11 text-[var(--aui-mist-50)] hover:text-[var(--aui-mist)] hover:bg-[var(--aui-mist-08)] rounded-xl"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
                onClick={onFinish}
              >
                Ask each time
              </Button>
            </div>
          </Card>
        )}
      </div>

      <div className="p-5 border-t border-[var(--aui-stroke)]">
        <Button
          variant="ghost"
          className="w-full h-[44px] text-[var(--aui-mist-50)] hover:text-[var(--aui-mist)] hover:bg-[var(--aui-mist-08)] rounded-xl"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
          onClick={onFinish}
        >
          Close
        </Button>
      </div>
    </div>
  )
}

function StepDots({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={`h-[5px] rounded-full transition-all duration-300 ${
            step === current
              ? 'w-6 bg-[var(--aui-fire)]'
              : step < current
              ? 'w-[5px] bg-[var(--aui-fire)]'
              : 'w-[5px] bg-[var(--aui-mist-15)]'
          }`}
        />
      ))}
    </div>
  )
}

function DraftSheet({
  open,
  onOpenChange,
  onExplain,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExplain: () => void
}) {
  if (!open) return null

  return (
    <>
      <div 
        className="absolute inset-0 bg-black/60 z-40"
        onClick={() => onOpenChange(false)}
      />
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-[var(--aui-eerie)] border-t border-[var(--aui-mist-15)] rounded-t-3xl p-5 pb-8 animate-[slideUp_0.25s_ease-out_both]" style={{ maxHeight: '75%' }}>
        <AuiDragHandle />
        
        <div className="flex items-center justify-between mb-4">
          <h3 
            className="text-[20px] font-medium text-[var(--aui-mist)]"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Draft to Ran
          </h3>
          <button
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 rounded-full bg-[var(--aui-mist-08)] flex items-center justify-center text-[var(--aui-mist-50)] hover:text-[var(--aui-mist)]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <AuiTag onExplain={onExplain} />
          <span 
            className="text-[12px] text-[var(--aui-mist-50)]"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            AI drafted this from your call
          </span>
        </div>

        <Card className="bg-[var(--aui-elevated)] border-[var(--aui-mist-15)] p-4 mb-4">
          <p 
            className="text-[14px] font-light text-[var(--aui-mist-70)] leading-[1.6]"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Hi Ran, following up on our call, I&apos;ll send over the contract by Friday.
            <br /><br />
            Let me know if you need anything before then.
          </p>
        </Card>

        <div className="flex items-start gap-2.5 mb-5">
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 bg-[var(--aui-fire)] animate-[dotBreath_2.8s_ease-in-out_infinite]" />
          <p 
            className="text-[13px] font-light text-[var(--aui-mist-50)]"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            This is a draft. Edit before sending.
          </p>
        </div>

        <div className="space-y-3">
          <Button 
            className="w-full h-[52px] bg-[var(--aui-fire)] hover:bg-[var(--aui-fire)]/90 text-white text-[16px] font-medium rounded-2xl"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Send
          </Button>
          <Button
            variant="ghost"
            className="w-full h-[44px] bg-[var(--aui-mist-08)] text-[var(--aui-mist-70)] hover:text-[var(--aui-mist)] hover:bg-[var(--aui-mist-15)] rounded-xl border-0"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Edit first
          </Button>
        </div>
      </div>
    </>
  )
}
