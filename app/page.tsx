'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Phone, Headset, ListChecks } from '@phosphor-icons/react'

const prototypes = [
  {
    number: '01',
    title: 'Before the Call',
    description: 'Know before you dial',
    href: '/prototypes/before',
    icon: Phone,
    featured: false,
  },
  {
    number: '02',
    title: 'During the Call',
    description: 'A silent second pair of hands',
    href: '/prototypes/during',
    icon: Headset,
    featured: false,
  },
  {
    number: '03',
    title: 'After the Call',
    description: 'The proactive handoff',
    href: '/prototypes/after',
    icon: ListChecks,
    featured: true,
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--aui-space)] flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <h1 
            className="text-[48px] md:text-[56px] font-light text-[var(--aui-mist)] mb-5 tracking-[-0.02em] leading-[1.1]"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            AUI Phone Prototypes
          </h1>
          <p 
            className="text-[18px] text-[var(--aui-mist-50)] font-light max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            Three interactive prototypes exploring AI assistance before, during, and after phone calls
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {prototypes.map((proto) => (
            <Link
              key={proto.number}
              href={proto.href}
              className={`group relative block p-7 rounded-3xl border transition-all duration-300
                ${proto.featured
                  ? 'bg-[var(--aui-eerie)] border-[var(--aui-fire)]/25 hover:border-[var(--aui-fire)]/50 md:scale-[1.03]'
                  : 'bg-[var(--aui-eerie)] border-[var(--aui-mist-15)] hover:border-[var(--aui-mist-30)]'
                }
                hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(0,0,0,0.5)]
              `}
            >
              {proto.featured && (
                <Badge 
                  className="absolute -top-3 right-5 bg-[var(--aui-fire)] hover:bg-[var(--aui-fire)] text-white text-[9px] uppercase tracking-[0.15em] px-3 py-1 rounded-full"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >
                  Featured
                </Badge>
              )}

              <span 
                className="text-[11px] tracking-[0.2em] text-[var(--aui-fire)] block mb-5"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                {proto.number}
              </span>

              <div className="w-12 h-12 rounded-2xl bg-[var(--aui-mist-08)] flex items-center justify-center mb-5 group-hover:bg-[var(--aui-mist-15)] transition-colors">
                <proto.icon size={24} weight="light" className="text-[var(--aui-mist)]" />
              </div>

              <h2 
                className="text-[20px] font-medium text-[var(--aui-mist)] mb-2 tracking-[-0.01em]"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                {proto.title}
              </h2>

              <p 
                className="text-[14px] text-[var(--aui-mist-50)] mb-6 font-light"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                {proto.description}
              </p>

              <span 
                className="inline-flex items-center gap-1.5 text-[12px] text-[var(--aui-mist-30)] group-hover:text-[var(--aui-mist-50)] transition-colors"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                View prototype
                <ArrowRight
                  size={12}
                  weight="bold"
                  className="transform group-hover:translate-x-0.5 transition-transform"
                />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p 
            className="text-[10px] text-[var(--aui-mist-30)] uppercase tracking-[0.2em]"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            Native structure · AUI skin
          </p>
        </div>
      </div>
    </main>
  )
}
