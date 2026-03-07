'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { opticianConfig } from '@/config/optician'
import HeroGSAP from '@/components/HeroGSAP'

export default function HomePage() {
  const featured = opticianConfig.frames.filter(f => f.featured && f.inStock)

  const statsRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const framesRef = useRef<HTMLDivElement>(null)
  const ctaSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initScrollAnimations = async () => {
      if (typeof window === 'undefined') return
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      // Animate stat numbers counting up
      if (statsRef.current) {
        const statEls = statsRef.current.querySelectorAll('.stat-number')
        gsap.fromTo(
          statsRef.current.querySelectorAll('.stat-item'),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        )
        // Counter animation for stat numbers
        statEls.forEach(el => {
          const raw = el.getAttribute('data-value') || '0'
          const isPlus = raw.includes('+')
          const isDuration = raw.includes('Day')
          if (isDuration) return
          const num = parseInt(raw.replace(/[^0-9]/g, ''), 10)
          const obj = { val: 0 }
          gsap.to(obj, {
            val: num,
            duration: 1.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
              once: true,
            },
            onUpdate() {
              el.textContent = Math.round(obj.val).toLocaleString() + (isPlus ? '+' : '')
            },
          })
        })
      }

      // Service cards stagger in
      if (servicesRef.current) {
        gsap.fromTo(
          servicesRef.current.querySelectorAll('.service-card'),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: servicesRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        )
      }

      // Frame cards scale in
      if (framesRef.current) {
        gsap.fromTo(
          framesRef.current.querySelectorAll('.frame-card'),
          { opacity: 0, scale: 0.92 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: framesRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        )
      }

      // CTA section fade up
      if (ctaSectionRef.current) {
        gsap.fromTo(
          ctaSectionRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ctaSectionRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        )
      }
    }

    initScrollAnimations()
  }, [])

  const STATS = [
    { stat: '10+', label: 'Years in Practice', dataValue: '10+' },
    { stat: '4,000+', label: 'Happy Patients', dataValue: '4000+' },
    { stat: '200+', label: 'Frame Styles', dataValue: '200+' },
    { stat: '1 Day', label: 'Lens Turnaround', dataValue: '1 Day' },
  ]

  return (
    <>
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
            {opticianConfig.name}
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link href="/frames" className="hover:text-[var(--color-primary)] transition-colors">Frames</Link>
            <Link href="/services" className="hover:text-[var(--color-primary)] transition-colors">Services</Link>
            <Link href="/book" className="btn-primary text-sm px-5 py-2">Book Eye Test</Link>
          </div>
          {/* Mobile */}
          <Link href="/book" className="md:hidden btn-primary text-sm px-4 py-2">Book Now</Link>
        </div>
      </nav>

      <main className="pt-16">
        {/* HERO — GSAP animated */}
        <HeroGSAP
          headline={opticianConfig.tagline}
          subHeadline="Expert eye care, designer frames, and a team that remembers your name — not just your prescription."
          particleColor="#4ECDC4"
        >
          <p className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-widest mb-4">
            {opticianConfig.address}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/book" className="btn-primary" style={{ background: 'var(--color-accent)', color: '#0a2a2a' }}>
              Book Eye Test
            </Link>
            <Link href="/frames" className="btn-outline border-white text-white hover:bg-white hover:text-gray-900">
              Browse Frames
            </Link>
          </div>
        </HeroGSAP>

        {/* TRUST STRIP */}
        <section className="bg-white border-b border-gray-100">
          <div
            ref={statsRef}
            className="max-w-6xl mx-auto px-4 md:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            {STATS.map(({ stat, label, dataValue }) => (
              <div key={label} className="stat-item">
                <p
                  className="stat-number text-3xl font-bold font-display"
                  data-value={dataValue}
                  style={{ color: 'var(--color-primary)' }}
                >
                  {stat}
                </p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES STRIP */}
        <section className="section-pad">
          <h2 className="font-display text-4xl mb-2" style={{ color: 'var(--color-primary)' }}>Our Services</h2>
          <p className="text-gray-500 mb-10">Everything your eyes need, under one roof.</p>
          <div ref={servicesRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {opticianConfig.services.map((svc) => (
              <div key={svc.name} className="service-card card hover:shadow-md transition-shadow">
                <span className="text-3xl">{svc.icon}</span>
                <h3 className="font-semibold text-gray-900 mt-3 mb-1">{svc.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{svc.description}</p>
                <p className="text-sm font-bold" style={{ color: 'var(--color-accent)' }}>{svc.price}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/services" className="btn-outline">See All Services & Prices</Link>
          </div>
        </section>

        {/* FEATURED FRAMES */}
        <section className="section-pad bg-gray-50 rounded-3xl mx-4 md:mx-8">
          <h2 className="font-display text-4xl mb-2" style={{ color: 'var(--color-primary)' }}>Featured Frames</h2>
          <p className="text-gray-500 mb-10">Hand-picked styles for every face and budget.</p>
          <div ref={framesRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((frame) => (
              <div key={frame.id} className="frame-card card group cursor-pointer hover:shadow-md transition-shadow">
                <div className="bg-gray-100 rounded-xl h-40 flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors text-5xl">
                  🕶️
                </div>
                <h3 className="font-semibold text-gray-900">{frame.name}</h3>
                <p className="text-xs text-gray-400 mb-1">{frame.brand} · {frame.type}</p>
                <p className="font-bold text-sm" style={{ color: 'var(--color-primary)' }}>
                  KES {frame.price.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">{frame.colors.join(' / ')}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/frames" className="btn-primary">View All Frames</Link>
          </div>
        </section>

        {/* CTA */}
        <section className="section-pad text-center">
          <div ref={ctaSectionRef}>
            <h2 className="font-display text-4xl mb-4" style={{ color: 'var(--color-primary)' }}>
              When did you last have your eyes tested?
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-8">
              Experts recommend an eye test every two years. Book yours today — it takes just 30 minutes.
            </p>
            <Link href="/book" className="btn-primary text-lg px-10 py-4">Book My Eye Test</Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 grid md:grid-cols-3 gap-8 text-sm text-gray-500">
            <div>
              <p className="font-display text-lg font-bold mb-2" style={{ color: 'var(--color-primary)' }}>{opticianConfig.name}</p>
              <p>{opticianConfig.address}</p>
              <a href={`tel:${opticianConfig.phone}`} className="block mt-1 hover:text-gray-900">{opticianConfig.phone}</a>
              <a href={`mailto:${opticianConfig.email}`} className="block hover:text-gray-900">{opticianConfig.email}</a>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-2">Hours</p>
              <p>Mon–Fri: {opticianConfig.hours.weekdays}</p>
              <p>Saturday: {opticianConfig.hours.saturday}</p>
              <p>Sunday: {opticianConfig.hours.sunday}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-2">Links</p>
              <Link href="/frames" className="block hover:text-gray-900">Frames</Link>
              <Link href="/services" className="block hover:text-gray-900">Services</Link>
              <Link href="/book" className="block hover:text-gray-900">Book Eye Test</Link>
            </div>
          </div>
          <div className="text-center py-4 text-xs text-gray-400 border-t border-gray-100">
            © {new Date().getFullYear()} {opticianConfig.name}. All rights reserved.
          </div>
        </footer>
      </main>
    </>
  )
}
