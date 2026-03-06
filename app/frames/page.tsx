'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { opticianConfig } from '@/config/optician'
import type { Frame } from '@/config/optician'

type FrameType = Frame['type'] | 'all'

export default function FramesPage() {
  const [filter, setFilter] = useState<FrameType>('all')
  const [stockOnly, setStockOnly] = useState(true)

  const filters: { label: string; value: FrameType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Prescription', value: 'glasses' },
    { label: 'Sunglasses', value: 'sunglasses' },
    { label: 'Reading', value: 'reading' },
  ]

  const visible = opticianConfig.frames.filter(f => {
    if (stockOnly && !f.inStock) return false
    if (filter !== 'all' && f.type !== filter) return false
    return true
  })

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
            {opticianConfig.name}
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link href="/frames" className="font-bold" style={{ color: 'var(--color-primary)' }}>Frames</Link>
            <Link href="/services" className="hover:text-[var(--color-primary)]">Services</Link>
            <Link href="/book" className="btn-primary text-sm px-5 py-2">Book Eye Test</Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 section-pad">
        <h1 className="font-display text-5xl mb-2" style={{ color: 'var(--color-primary)' }}>Our Frames</h1>
        <p className="text-gray-500 mb-8">200+ styles in-store. Here are our current highlights.</p>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {filters.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f.value ? 'text-white shadow' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
              style={filter === f.value ? { background: 'var(--color-primary)' } : {}}>
              {f.label}
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={stockOnly} onChange={e => setStockOnly(e.target.checked)}
              className="rounded" />
            In stock only
          </label>
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <p className="text-gray-400 py-20 text-center">No frames match your filters.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((frame, i) => {
              const msg = encodeURIComponent(`Hi, I'm interested in the ${frame.name} (${frame.brand}) frame. Is it available?`)
              return (
                <motion.div key={frame.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="card group">
                  <div className="relative bg-gray-100 rounded-xl h-48 flex items-center justify-center mb-4 text-6xl overflow-hidden">
                    🕶️
                    {!frame.inStock && (
                      <span className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                        Out of stock
                      </span>
                    )}
                    {frame.featured && frame.inStock && (
                      <span className="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full"
                        style={{ background: 'var(--color-accent)' }}>
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{frame.name}</h3>
                  <p className="text-sm text-gray-400 mb-1">{frame.brand} · {frame.type}</p>
                  <p className="text-sm text-gray-500 mb-3">{frame.colors.join(' / ')}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg" style={{ color: 'var(--color-primary)' }}>
                      KES {frame.price.toLocaleString()}
                    </span>
                    {frame.inStock ? (
                      <a href={`https://wa.me/${opticianConfig.whatsapp}?text=${msg}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-sm px-4 py-2 rounded-full font-medium text-white transition-all"
                        style={{ background: 'var(--color-accent)' }}>
                        Enquire
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Notify me</span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        <div className="mt-12 text-center card max-w-lg mx-auto">
          <p className="text-gray-700 font-medium mb-1">Didn't find what you're looking for?</p>
          <p className="text-gray-500 text-sm mb-4">We stock 200+ frames in-store. Come in or chat with us on WhatsApp.</p>
          <a href={`https://wa.me/${opticianConfig.whatsapp}?text=Hi%2C%20I%27m%20looking%20for%20a%20specific%20frame%20style.`}
            target="_blank" rel="noopener noreferrer" className="btn-primary">
            Ask on WhatsApp
          </a>
        </div>
      </main>
    </>
  )
}
