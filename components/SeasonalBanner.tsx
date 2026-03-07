'use client'
import { useState, useEffect, useRef } from 'react'
import { opticianConfig } from '@/config/optician'
import { detectSeason } from '@/lib/season'

const MESSAGES = {
  valentine: '💝 Valentine\'s Gift? Treat someone special to a designer frame this February.',
  christmas: '🎄 Christmas Special — FREE lens coating on any frame this December!',
  easter:    '🐣 Easter Offer — 15% off contact lens starter packs this Easter.',
  default:   '',
}

export default function SeasonalBanner() {
  const [dismissed, setDismissed] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)
  const season = opticianConfig.season !== 'default' ? opticianConfig.season : detectSeason()
  const message = MESSAGES[season]

  useEffect(() => {
    if (!bannerRef.current || !message) return
    const init = async () => {
      const { gsap } = await import('gsap')
      gsap.fromTo(
        bannerRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.4)', delay: 0.1 }
      )
    }
    init()
  }, [message])

  if (!message || dismissed) return null

  return (
    <div ref={bannerRef} className="seasonal-banner" role="banner">
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => setDismissed(true)}
        className="ml-4 text-lg leading-none opacity-70 hover:opacity-100"
        aria-label="Dismiss banner"
      >×</button>
    </div>
  )
}
