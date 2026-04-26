'use client'

import { useState, createContext, useContext } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type OSType = 'ios' | 'samsung'

interface PhoneContextType {
  os: OSType
  fontFamily: string
}

const PhoneContext = createContext<PhoneContextType>({ 
  os: 'ios',
  fontFamily: 'var(--font-ios)'
})

export function usePhoneOS() {
  return useContext(PhoneContext)
}

interface PhoneFrameProps {
  children: React.ReactNode
  os?: OSType
  onOsChange?: (os: OSType) => void
  stageLabel?: string
  showOsToggle?: boolean
}

export function PhoneFrame({
  children,
  os = 'ios',
  onOsChange,
  stageLabel,
  showOsToggle = true,
}: PhoneFrameProps) {
  const [currentOs, setCurrentOs] = useState<OSType>(os)

  const handleOsChange = (newOs: string) => {
    const osValue = newOs as OSType
    setCurrentOs(osValue)
    onOsChange?.(osValue)
  }

  const frameStyles = {
    ios: {
      width: 393,
      height: 852,
      borderRadius: 55,
      statusBarHeight: 59,
      homeIndicatorHeight: 34,
      bezelColor: '#1a1a1a',
      bezelWidth: 10,
    },
    samsung: {
      width: 360,
      height: 780,
      borderRadius: 32,
      statusBarHeight: 28,
      homeIndicatorHeight: 0,
      bezelColor: '#1f1f1f',
      bezelWidth: 8,
    },
  }

  const style = frameStyles[currentOs]
  const fontFamily = currentOs === 'ios' ? 'var(--font-ios)' : 'var(--font-samsung)'

  return (
    <PhoneContext.Provider value={{ os: currentOs, fontFamily }}>
      <div className="flex flex-col items-center gap-8">
        {showOsToggle && (
          <Tabs
            value={currentOs}
            onValueChange={handleOsChange}
            className="w-auto"
          >
            <TabsList className="bg-[var(--aui-mist-08)] border border-[var(--aui-mist-15)] rounded-full px-1 h-9">
              <TabsTrigger
                value="ios"
                className="rounded-full px-5 py-1 text-[12px] font-medium data-[state=active]:bg-white data-[state=active]:text-black text-[var(--aui-mist-50)] transition-all"
                style={{ fontFamily: 'var(--font-ios)' }}
              >
                iOS
              </TabsTrigger>
              <TabsTrigger
                value="samsung"
                className="rounded-full px-5 py-1 text-[12px] font-medium data-[state=active]:bg-white data-[state=active]:text-black text-[var(--aui-mist-50)] transition-all"
                style={{ fontFamily: 'var(--font-samsung)' }}
              >
                Samsung
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <div
          className="relative overflow-hidden shadow-2xl shadow-black/60"
          style={{
            width: style.width,
            height: style.height,
            borderRadius: style.borderRadius,
            border: `${style.bezelWidth}px solid ${style.bezelColor}`,
            fontFamily,
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none z-[100] opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          <StatusBar os={currentOs} />

          <div
            className="absolute left-0 right-0 bottom-0"
            style={{ 
              top: style.statusBarHeight,
              borderRadius: `0 0 ${style.borderRadius - style.bezelWidth}px ${style.borderRadius - style.bezelWidth}px`,
              overflow: 'hidden',
            }}
          >
            <div 
              id="phone-content"
              className="relative w-full h-full" 
              style={{ fontFamily, overflow: 'hidden' }}
            >
              {children}
            </div>
          </div>

          {currentOs === 'ios' && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] bg-black rounded-full z-[60]" />
          )}
        </div>

        {stageLabel && (
          <div 
            className="text-[10px] uppercase tracking-[0.2em] text-[var(--aui-mist-30)]"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            {stageLabel}
          </div>
        )}
      </div>
    </PhoneContext.Provider>
  )
}

function StatusBar({ os }: { os: OSType }) {
  const time = '9:41'

  if (os === 'ios') {
    return (
      <div className="absolute top-0 left-0 right-0 z-[50] h-[59px] bg-white">
        <div className="relative h-full flex items-center justify-between px-8">
          <span 
            className="text-[15px] font-semibold text-black tracking-[-0.01em]"
            style={{ fontFamily: 'var(--font-ios)' }}
          >
            {time}
          </span>
          
          <div
            className="absolute left-1/2 -translate-x-1/2 top-[11px] w-[126px] h-[37px] bg-black rounded-[24px]"
          />
          
          <div className="flex items-center gap-[5px]">
            {/* iOS Signal Bars */}
            <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
              <rect x="0" y="7" width="3" height="4" rx="1" fill="black"/>
              <rect x="4.5" y="5" width="3" height="6" rx="1" fill="black"/>
              <rect x="9" y="2.5" width="3" height="8.5" rx="1" fill="black"/>
              <rect x="13.5" y="0" width="3" height="11" rx="1" fill="black"/>
            </svg>
            {/* iOS WiFi */}
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
              <path d="M7.5 10.5C8.33 10.5 9 9.83 9 9C9 8.17 8.33 7.5 7.5 7.5C6.67 7.5 6 8.17 6 9C6 9.83 6.67 10.5 7.5 10.5Z" fill="black"/>
              <path d="M4.5 7.5C5.3 6.7 6.35 6.2 7.5 6.2C8.65 6.2 9.7 6.7 10.5 7.5" stroke="black" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M2.25 5.25C3.6 3.9 5.45 3.1 7.5 3.1C9.55 3.1 11.4 3.9 12.75 5.25" stroke="black" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M0 3C1.95 1.05 4.6 0 7.5 0C10.4 0 13.05 1.05 15 3" stroke="black" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            {/* iOS Battery */}
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
              <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="black" strokeOpacity="0.35"/>
              <rect x="2" y="2" width="18" height="8" rx="1.5" fill="black"/>
              <path d="M23 4V8C23.8 7.6 24.5 6.9 24.5 6C24.5 5.1 23.8 4.4 23 4Z" fill="black" fillOpacity="0.4"/>
            </svg>
          </div>
        </div>
      </div>
    )
  }

  // Samsung status bar
  return (
    <div className="absolute top-0 left-0 right-0 z-[50] h-7 bg-white flex items-center justify-between px-4">
      <span 
        className="text-[12px] font-medium text-black"
        style={{ fontFamily: 'var(--font-samsung)' }}
      >
        {time}
      </span>
      
      <div className="flex items-center gap-1.5">
        {/* Samsung Signal */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 10H3V14H1V10Z" fill="black"/>
          <path d="M5 7H7V14H5V7Z" fill="black"/>
          <path d="M9 4H11V14H9V4Z" fill="black"/>
          <path d="M13 0H15V14H13V0Z" fill="black" fillOpacity="0.3"/>
        </svg>
        {/* Samsung WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M8 0C11.5 0 14.5 1.5 16 4L14.5 5.5C13.2 3.5 10.8 2 8 2C5.2 2 2.8 3.5 1.5 5.5L0 4C1.5 1.5 4.5 0 8 0ZM8 4C10.2 4 12.2 5 13.5 6.5L12 8C11 6.8 9.6 6 8 6C6.4 6 5 6.8 4 8L2.5 6.5C3.8 5 5.8 4 8 4ZM8 8C9.3 8 10.4 8.7 11 9.5L8 12L5 9.5C5.6 8.7 6.7 8 8 8Z" fill="black"/>
        </svg>
        {/* Samsung Battery */}
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
          <rect x="0" y="0" width="17" height="10" rx="2" stroke="black" strokeWidth="1"/>
          <rect x="1.5" y="1.5" width="14" height="7" rx="1" fill="black"/>
          <rect x="17" y="3" width="3" height="4" rx="1" fill="black" fillOpacity="0.3"/>
        </svg>
      </div>
    </div>
  )
}

export type { OSType }
