'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { opticianConfig } from '@/config/optician'

export default function ServicesPage() {
  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
            {opticianConfig.name}
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link href="/frames" className="hover:text-[var(--color-primary)]">Frames</Link>
            <Link href="/services" className="font-bold" style={{ color: 'var(--color-primary)' }}>Services</Link>
            <Link href="/book" className="btn-primary text-sm px-5 py-2">Book Eye Test</Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 section-pad">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-5xl mb-2" style={{ color: 'var(--color-primary)' }}>Services & Pricing</h1>
          <p className="text-gray-500 mb-12 max-w-xl">
            Transparent pricing, no surprises. All tests include a written prescription you keep.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {opticianConfig.services.map((svc, i) => (
            <motion.div key={svc.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="card flex gap-5">
              <div className="text-4xl mt-1 shrink-0">{svc.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{svc.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{svc.description}</p>
                <span className="inline-block text-sm font-bold px-3 py-1 rounded-full text-white"
                  style={{ background: 'var(--color-accent)' }}>
                  {svc.price}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ strip */}
        <div className="card max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--color-primary)' }}>Common Questions</h2>
          {[
            { q: 'How long does an eye test take?', a: 'About 30 minutes for a full comprehensive test.' },
            { q: 'Do I need an appointment?', a: 'Appointments are preferred, but walk-ins welcome when slots are free.' },
            { q: 'How often should I get tested?', a: 'Every 2 years for adults, annually for under-16s and over-60s.' },
            { q: 'Can I use my prescription elsewhere?', a: 'Yes — your written prescription is yours to keep and use anywhere.' },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-gray-100 py-4 last:border-0">
              <p className="font-semibold text-gray-800 mb-1">{q}</p>
              <p className="text-gray-500 text-sm">{a}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/book" className="btn-primary text-lg px-10 py-4">Book Your Eye Test</Link>
        </div>
      </main>
    </>
  )
}
