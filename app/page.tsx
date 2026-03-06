'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { opticianConfig } from '@/config/optician'

export default function HomePage() {
  const featured = opticianConfig.frames.filter(f => f.featured && f.inStock)

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
        {/* HERO */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden" style={{ background: 'var(--hero-bg)' }}>
          <div className="section-pad relative z-10 text-white">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-[var(--color-accent)] font-semibold text-sm uppercase tracking-widest mb-4">
                {opticianConfig.address}
              </p>
              <h1 className="font-display text-5xl md:text-7xl leading-tight mb-6">
                {opticianConfig.tagline}
              </h1>
              <p className="text-lg text-white/80 max-w-xl mb-10">
                Expert eye care, designer frames, and a team that remembers your name — not just your prescription.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/book" className="btn-primary" style={{ background: 'var(--color-accent)', color: '#0a2a2a' }}>
                  Book Eye Test
                </Link>
                <Link href="/frames" className="btn-outline border-white text-white hover:bg-white hover:text-gray-900">
                  Browse Frames
                </Link>
              </div>
            </motion.div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-32 -top-32 w-[520px] h-[520px] rounded-full opacity-10 border-[60px] border-white" />
          <div className="absolute -right-10 bottom-10 w-[300px] h-[300px] rounded-full opacity-10 border-[40px] border-white" />
        </section>

        {/* TRUST STRIP */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { stat: '10+', label: 'Years in Practice' },
              { stat: '4,000+', label: 'Happy Patients' },
              { stat: '200+', label: 'Frame Styles' },
              { stat: '1 Day', label: 'Lens Turnaround' },
            ].map(({ stat, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold font-display" style={{ color: 'var(--color-primary)' }}>{stat}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES STRIP */}
        <section className="section-pad">
          <h2 className="font-display text-4xl mb-2" style={{ color: 'var(--color-primary)' }}>Our Services</h2>
          <p className="text-gray-500 mb-10">Everything your eyes need, under one roof.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {opticianConfig.services.map((svc, i) => (
              <motion.div key={svc.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="card hover:shadow-md transition-shadow">
                <span className="text-3xl">{svc.icon}</span>
                <h3 className="font-semibold text-gray-900 mt-3 mb-1">{svc.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{svc.description}</p>
                <p className="text-sm font-bold" style={{ color: 'var(--color-accent)' }}>{svc.price}</p>
              </motion.div>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((frame, i) => (
              <motion.div key={frame.id}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="card group cursor-pointer">
                <div className="bg-gray-100 rounded-xl h-40 flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors text-5xl">
                  🕶️
                </div>
                <h3 className="font-semibold text-gray-900">{frame.name}</h3>
                <p className="text-xs text-gray-400 mb-1">{frame.brand} · {frame.type}</p>
                <p className="font-bold text-sm" style={{ color: 'var(--color-primary)' }}>
                  KES {frame.price.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">{frame.colors.join(' / ')}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/frames" className="btn-primary">View All Frames</Link>
          </div>
        </section>

        {/* CTA */}
        <section className="section-pad text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-4xl mb-4" style={{ color: 'var(--color-primary)' }}>
              When did you last have your eyes tested?
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-8">
              Experts recommend an eye test every two years. Book yours today — it takes just 30 minutes.
            </p>
            <Link href="/book" className="btn-primary text-lg px-10 py-4">Book My Eye Test</Link>
          </motion.div>
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
