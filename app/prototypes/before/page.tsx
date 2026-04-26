'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PhoneFrame, AuiCard, AuiTag, AuiExplainer } from '@/components/aui'
import type { OSType } from '@/components/aui'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Phone,
  VideoCamera,
  ChatCircle,
  CaretRight,
  MagnifyingGlass,
  Star,
  User,
  Clock,
  SquaresFour,
  Voicemail,
} from '@phosphor-icons/react'

type ViewState = 'list' | 'contact-known' | 'contact-unknown' | 'contact-first'

const contacts = [
  { id: 'ran', name: 'Ran', type: 'known' as const, lastCall: '3 weeks ago' },
  { id: 'unknown', name: '+972 52 000 0000', type: 'unknown' as const, lastCall: 'Yesterday' },
  { id: 'dr-cohen', name: 'Dr. Cohen', type: 'first' as const, lastCall: 'Never' },
  { id: 'noa', name: 'Noa', type: 'regular' as const, lastCall: '2 days ago' },
  { id: 'david', name: 'David', type: 'regular' as const, lastCall: 'Yesterday' },
  { id: 'mum', name: 'Mum', type: 'regular' as const, lastCall: 'Yesterday' },
]

export default function BeforeTheCallPage() {
  const router = useRouter()
  const [os, setOs] = useState<OSType>('ios')
  const [view, setView] = useState<ViewState>('list')
  const [selectedContact, setSelectedContact] = useState<typeof contacts[0] | null>(null)
  const [explainerOpen, setExplainerOpen] = useState(false)

  const handleCall = () => {
    router.push('/prototypes/during')
  }

  const handleContactTap = (contact: typeof contacts[0]) => {
    setSelectedContact(contact)
    if (contact.type === 'known') {
      setView('contact-known')
    } else if (contact.type === 'unknown') {
      setView('contact-unknown')
    } else if (contact.type === 'first') {
      setView('contact-first')
    }
  }

  const handleBack = () => {
    setView('list')
    setSelectedContact(null)
  }

  const stageLabels: Record<ViewState, string> = {
    'list': 'Contacts List',
    'contact-known': 'Known Contact · Context Strip',
    'contact-unknown': 'Unknown Number · Context Strip',
    'contact-first': 'First Time Contact · Context Strip',
  }

  return (
    <main className="min-h-screen bg-[var(--aui-space)] flex items-center justify-center py-16">
      <PhoneFrame os={os} onOsChange={setOs} stageLabel={stageLabels[view]}>
        <div className="relative h-full">
          <div className="h-full flex flex-col" style={{ minHeight: os === 'ios' ? 759 : 752 }}>
            {view === 'list' ? (
              <ContactsList os={os} onContactTap={handleContactTap} />
            ) : (
              <ContactDetail
                os={os}
                contact={selectedContact!}
                onBack={handleBack}
                onExplain={() => setExplainerOpen(true)}
                onCall={handleCall}
              />
            )}
          </div>
          <AuiExplainer open={explainerOpen} onOpenChange={setExplainerOpen} />
        </div>
      </PhoneFrame>

    </main>
  )
}

function ContactsList({
  os,
  onContactTap,
}: {
  os: OSType
  onContactTap: (contact: typeof contacts[0]) => void
}) {
  const isIos = os === 'ios'

  return (
    <div className={`flex-1 flex flex-col ${isIos ? 'bg-[#F2F2F7]' : 'bg-[#F5F5F5]'}`}>
      <div className={`bg-white ${isIos ? 'px-4 pt-1 pb-2' : 'px-5 pt-3 pb-4'}`}>
        <h1
          className={`${
            isIos
              ? 'text-[34px] font-bold tracking-tight text-black'
              : 'text-[22px] font-semibold text-black'
          }`}
          style={{ fontFamily: isIos ? 'var(--font-ios)' : 'var(--font-samsung)' }}
        >
          Contacts
        </h1>
      </div>

      <div className={`bg-white px-4 pb-3`}>
        <div
          className={`flex items-center gap-2.5 px-3.5 ${
            isIos
              ? 'py-2 bg-[rgba(118,118,128,0.12)] rounded-[10px]'
              : 'py-2.5 bg-[#F0F0F0] rounded-lg'
          }`}
        >
          <MagnifyingGlass size={16} weight="bold" className="text-[#8E8E93]" />
          <span className="text-[15px] text-[#8E8E93]" style={{ fontFamily: isIos ? 'var(--font-ios)' : 'var(--font-samsung)' }}>Search</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative">
        {isIos && (
          <div 
            className="absolute right-0.5 top-4 bottom-4 flex flex-col justify-center text-[10px] text-[#007AFF] font-semibold z-10"
            style={{ fontFamily: 'var(--font-ios)' }}
          >
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('').map((letter) => (
              <span key={letter} className="px-1 leading-[13px]">{letter}</span>
            ))}
          </div>
        )}

        <div className={isIos ? 'pr-5' : ''}>
          {['D', 'M', 'N', 'R'].map((section) => (
            <div key={section}>
              <div
                className={`px-4 py-1 ${
                  isIos
                    ? 'bg-[#F2F2F7] text-[13px] font-semibold text-[#8E8E93]'
                    : 'bg-[#E8E8E8] text-[12px] font-medium text-[#666]'
                }`}
                style={{ fontFamily: isIos ? 'var(--font-ios)' : 'var(--font-samsung)' }}
              >
                {section}
              </div>
              <div className="bg-white">
                {contacts
                  .filter((c) => c.name.charAt(0).toUpperCase() === section || (section === 'D' && c.name === 'Dr. Cohen'))
                  .map((contact) => (
                    <ContactRow
                      key={contact.id}
                      contact={contact}
                      os={os}
                      onTap={() => onContactTap(contact)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomTabBar os={os} activeTab="contacts" />
    </div>
  )
}

function ContactRow({
  contact,
  os,
  onTap,
}: {
  contact: typeof contacts[0]
  os: OSType
  onTap: () => void
}) {
  const isIos = os === 'ios'
  const isUnknown = contact.type === 'unknown'

  return (
    <button
      onClick={onTap}
      className={`w-full flex items-center justify-between ${
        isIos ? 'h-[44px] pl-4 pr-3' : 'h-[56px] px-4'
      } bg-white active:bg-[#E5E5EA] transition-colors text-left border-b border-[#C6C6C8]/30`}
    >
      <span
        className={`${
          isIos ? 'text-[17px]' : 'text-[16px]'
        } text-black`}
        style={{ 
          fontFamily: isUnknown ? 'var(--font-geist-mono)' : (isIos ? 'var(--font-ios)' : 'var(--font-samsung)'),
          fontSize: isUnknown ? '14px' : undefined
        }}
      >
        {contact.name}
      </span>
      {isIos && <CaretRight size={14} weight="bold" className="text-[#C7C7CC]" />}
    </button>
  )
}

function ContactDetail({
  os,
  contact,
  onBack,
  onExplain,
  onCall,
}: {
  os: OSType
  contact: typeof contacts[0]
  onBack: () => void
  onExplain: () => void
  onCall: () => void
}) {
  const isIos = os === 'ios'
  const [showStrip, setShowStrip] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowStrip(true), 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`flex-1 flex flex-col ${isIos ? 'bg-[#F2F2F7]' : 'bg-[#F5F5F5]'}`}>
      <div className="bg-white px-4 py-2">
        <button
          onClick={onBack}
          className={`flex items-center gap-1 text-[17px] ${isIos ? 'text-[#007AFF]' : 'text-[#1259C3]'}`}
          style={{ fontFamily: isIos ? 'var(--font-ios)' : 'var(--font-samsung)' }}
        >
          <CaretRight size={18} weight="bold" className="rotate-180" />
          <span>Contacts</span>
        </button>
      </div>

      <div className="bg-white px-4 py-6 flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-3">
          <AvatarFallback
            className={`text-3xl font-medium ${
              contact.type === 'unknown'
                ? 'bg-[#E5E5EA] text-[#8E8E93]'
                : isIos
                ? 'bg-[#C7C7CC] text-white'
                : 'bg-[#1259C3] text-white'
            }`}
            style={{ fontFamily: isIos ? 'var(--font-ios)' : 'var(--font-samsung)' }}
          >
            {contact.type === 'unknown'
              ? '#'
              : contact.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <h2 
          className="text-[24px] font-medium text-black mb-5"
          style={{ fontFamily: isIos ? 'var(--font-ios)' : 'var(--font-samsung)' }}
        >
          {contact.name}
        </h2>

        <div className="flex gap-6">
          <ActionButton icon={<Phone size={24} weight="fill" />} label="call" os={os} primary onClick={onCall} />
          <ActionButton icon={<ChatCircle size={24} />} label="message" os={os} />
          <ActionButton icon={<VideoCamera size={24} />} label="video" os={os} />
        </div>
      </div>

      <div
        className={`
          flex-1 px-4 py-4 transition-all duration-300 ease-out
          ${showStrip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
        `}
      >
        <ContextStrip type={contact.type} onExplain={onExplain} />
      </div>

      <BottomTabBar os={os} activeTab="contacts" />
    </div>
  )
}

function ActionButton({
  icon,
  label,
  os,
  primary = false,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  os: OSType
  primary?: boolean
  onClick?: () => void
}) {
  const isIos = os === 'ios'
  const activeColor = isIos ? 'text-[#007AFF]' : 'text-[#1259C3]'

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center ${
          primary
            ? 'bg-[#34C759] text-white'
            : isIos 
            ? 'bg-[#F2F2F7] ' + activeColor
            : 'bg-[#E8E8E8] ' + activeColor
        }`}
      >
        {icon}
      </div>
      <span 
        className={`text-[11px] ${primary ? 'text-[#34C759]' : activeColor}`}
        style={{ fontFamily: isIos ? 'var(--font-ios)' : 'var(--font-samsung)' }}
      >
        {label}
      </span>
    </button>
  )
}

function ContextStrip({
  type,
  onExplain,
}: {
  type: 'known' | 'unknown' | 'first' | 'regular'
  onExplain: () => void
}) {
  if (type === 'regular') return null

  const content = {
    known: {
      body: (
        <>
          You haven&apos;t spoken since March. Last time you talked about the{' '}
          <em className="not-italic font-medium text-white">
            apartment renovation
          </em>
          .
        </>
      ),
      footer: 'From your last call · 3 weeks ago',
    },
    unknown: {
      body: (
        <>
          This looks like a{' '}
          <em className="not-italic font-medium text-white">
            local dental clinic
          </em>
          .
          <br />
          <span className="flex items-center gap-1 mt-2">
            {[...Array(4)].map((_, i) => (
              <Star key={i} size={11} weight="fill" className="text-[#FFD60A]" />
            ))}
            <Star size={11} weight="regular" className="text-[#FFD60A]" />
            <span className="text-[12px] ml-1.5 text-[rgba(255,255,255,0.6)]">4.2 · Usually picks up quickly</span>
          </span>
        </>
      ),
      footer: 'Matched from public business directory',
    },
    first: {
      body: (
        <>
          First time calling.{' '}
          <em className="not-italic font-medium text-white">
            Specialist at Ichilov Hospital
          </em>
          .
          <br />
          <span className="text-[13px] mt-2 block text-[rgba(255,255,255,0.7)]">
            Mutual connection:{' '}
            <em className="not-italic font-medium text-white">
              Yael Cohen
            </em>
          </span>
        </>
      ),
      footer: 'From shared contacts and calendar events',
    },
  }

  const data = content[type]

  return (
    <div className="bg-[#1a1a1a] border border-[var(--aui-fire)]/25 rounded-2xl p-4 shadow-lg animate-[slideUp_0.28s_ease-out_both]">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[var(--aui-fire)] flex items-center justify-center flex-shrink-0">
          {/* Sparkle icon - matches During call AI button */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" fill="white"/>
            <circle cx="18" cy="5" r="1.5" fill="white" fillOpacity="0.7"/>
            <circle cx="6" cy="17" r="1" fill="white" fillOpacity="0.5"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span 
              className="text-[10px] uppercase tracking-[0.1em] text-[var(--aui-fire)] font-medium"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              AI CONTEXT
            </span>
            <button 
              onClick={onExplain}
              className="text-[10px] text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.6)]"
            >
              ?
            </button>
          </div>
          <p 
            className="text-[14px] font-light text-[rgba(255,255,255,0.8)] leading-[1.5]"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            {data.body}
          </p>
          <p 
            className="text-[10px] text-[rgba(255,255,255,0.4)] mt-3 tracking-wide"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            {data.footer}
          </p>
        </div>
      </div>
    </div>
  )
}

function BottomTabBar({
  os,
  activeTab,
}: {
  os: OSType
  activeTab: 'favorites' | 'recents' | 'contacts' | 'keypad' | 'voicemail'
}) {
  const isIos = os === 'ios'
  const activeColor = isIos ? '#007AFF' : '#1259C3'
  const inactiveColor = '#8E8E93'

  const iosTabs = [
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'recents', label: 'Recents', icon: Clock },
    { id: 'contacts', label: 'Contacts', icon: User },
    { id: 'keypad', label: 'Keypad', icon: SquaresFour },
    { id: 'voicemail', label: 'Voicemail', icon: Voicemail },
  ]

  const samsungTabs = [
    { id: 'keypad', label: 'Keypad', icon: SquaresFour },
    { id: 'recents', label: 'Recents', icon: Clock },
    { id: 'contacts', label: 'Contacts', icon: User },
  ]

  const tabs = isIos ? iosTabs : samsungTabs

  return (
    <div
      className={`
        flex-shrink-0 bg-[rgba(249,249,249,0.94)] backdrop-blur-xl
        border-t border-[rgba(0,0,0,0.08)]
        flex items-center justify-around
        ${isIos ? 'h-[83px] pt-2 pb-6' : 'h-[56px]'}
      `}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            className="flex flex-col items-center gap-0.5"
          >
            <tab.icon 
              size={isIos ? 26 : 24} 
              weight={isActive ? 'fill' : 'regular'} 
              color={isActive ? activeColor : inactiveColor}
            />
            <span 
              className={`text-[10px]`}
              style={{ 
                fontFamily: isIos ? 'var(--font-ios)' : 'var(--font-samsung)',
                color: isActive ? activeColor : inactiveColor
              }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
