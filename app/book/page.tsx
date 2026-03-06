'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { opticianConfig } from '@/config/optician'

export default function BookPage() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', date: '', time: '', reason: '', _hp: '',
  })
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const times = [
    '8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM',
    '11:00 AM','11:30 AM','12:00 PM','1:00 PM','1:30 PM','2:00 PM',
    '2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM',
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form._hp) return                // honeypot
    setState('loading')
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(await res.text())
      setState('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card text-center max-w-md">
          <span className="text-5xl">✅</span>
          <h2 className="font-display text-3xl mt-4 mb-2" style={{ color: 'var(--color-primary)' }}>Booking Received!</h2>
          <p className="text-gray-500 mb-6">We'll confirm via WhatsApp or email shortly. See you soon!</p>
          <Link href="/" className="btn-primary">Back to Home</Link>
        </motion.div>
      </main>
    )
  }

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
            {opticianConfig.name}
          </Link>
          <Link href="/frames" className="text-sm text-gray-600 hover:text-gray-900">Browse Frames</Link>
        </div>
      </nav>

      <main className="pt-24 section-pad">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-5xl mb-2" style={{ color: 'var(--color-primary)' }}>Book an Eye Test</h1>
            <p className="text-gray-500 mb-8">30-minute comprehensive test. Walk-outs welcome too.</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="card space-y-5">
            {/* Honeypot — hidden from humans */}
            <input type="text" name="_hp" value={form._hp} onChange={e => set('_hp', e.target.value)}
              className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input required className="input-field" value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="Jane Mwangi" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input required type="tel" className="input-field" value={form.phone} onChange={e => set('phone', e.target.value)}
                  placeholder="+254 7XX XXX XXX" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
              <input type="email" className="input-field" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="jane@email.com" />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                <input required type="date" className="input-field" value={form.date} onChange={e => set('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
                <select required className="input-field" value={form.time} onChange={e => set('time', e.target.value)}>
                  <option value="">Select time…</option>
                  {times.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
              <select className="input-field" value={form.reason} onChange={e => set('reason', e.target.value)}>
                <option value="">Select reason…</option>
                <option>Routine eye test</option>
                <option>New glasses / contact lenses</option>
                <option>Child eye test</option>
                <option>Eye concern or pain</option>
                <option>Frame repair / adjustment</option>
                <option>Other</option>
              </select>
            </div>

            {state === 'error' && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button type="submit" disabled={state === 'loading'}
              className="btn-primary w-full py-4 text-base disabled:opacity-60">
              {state === 'loading' ? 'Submitting…' : 'Confirm Booking'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              We'll confirm via WhatsApp or email within 2 hours during business hours.
            </p>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Rather call us?{' '}
              <a href={`tel:${opticianConfig.phone}`} className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                {opticianConfig.phone}
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
