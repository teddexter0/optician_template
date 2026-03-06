'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Calendar, Bell, Glasses, BarChart2,
  CheckCircle, XCircle, Clock, Phone, Mail,
  Package, Eye, TrendingUp, Users, RefreshCw,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { opticianConfig } from '@/config/optician'
import type { Client, Frame } from '@/config/optician'

// ── Demo data ──────────────────────────────────────────────────────────────────
const DEMO_CLIENTS: Client[] = [
  { id: 'c1', name: 'Alice Wanjiru',  phone: '+254 712 345 678', email: 'alice@email.com',   lastVisit: '2025-04-10', nextDue: '2027-04-10', prescription: 'R: -1.50 / L: -1.75', framePurchased: 'Metro Classic', notes: 'Prefers thin lenses' },
  { id: 'c2', name: 'Brian Ochieng',  phone: '+254 722 987 654', email: 'brian@email.com',   lastVisit: '2024-02-15', nextDue: '2026-02-15', prescription: 'R: +0.75 / L: +1.00', framePurchased: 'Urban Round',   notes: 'Reading glasses only' },
  { id: 'c3', name: 'Cate Muthoni',   phone: '+254 733 111 222', email: 'cate@email.com',    lastVisit: '2024-03-20', nextDue: '2026-03-20', prescription: 'R: -2.25 / L: -2.00', framePurchased: 'Cat Eye Luxe',  notes: 'Astigmatism noted — right eye' },
  { id: 'c4', name: 'David Kimani',   phone: '+254 700 555 444', email: 'david@email.com',   lastVisit: '2025-01-08', nextDue: '2027-01-08', prescription: 'R: 0.00 / L: -0.50',  framePurchased: 'Aviator Pro',   notes: '' },
  { id: 'c5', name: 'Esther Njeri',   phone: '+254 711 888 999', email: 'esther@email.com',  lastVisit: '2023-11-05', nextDue: '2025-11-05', prescription: 'R: -3.00 / L: -3.25', framePurchased: 'Slim Reader',   notes: 'Needs recall — overdue' },
  { id: 'c6', name: 'Francis Mutua',  phone: '+254 799 321 654', email: '',                  lastVisit: '2024-06-12', nextDue: '2026-06-12', prescription: 'R: +1.25 / L: +1.50', framePurchased: 'Metro Classic', notes: 'Diabetic — annual check recommended' },
  { id: 'c7', name: 'Grace Akinyi',   phone: '+254 723 456 789', email: 'grace@email.com',   lastVisit: '2023-09-01', nextDue: '2025-09-01', prescription: 'R: -1.00 / L: -0.75', framePurchased: 'Sport Shield',  notes: '' },
  { id: 'c8', name: 'Hassan Omar',    phone: '+254 714 654 321', email: 'hassan@email.com',  lastVisit: '2025-02-20', nextDue: '2027-02-20', prescription: 'R: -0.25 / L: 0.00',  framePurchased: 'Urban Round',   notes: 'Contact lens wearer — annual check' },
]

interface Appointment {
  id: string; clientName: string; phone: string; time: string
  reason: string; status: 'waiting' | 'seen' | 'no-show'
}

const TODAY = new Date().toISOString().split('T')[0]
const DEMO_APPTS: Appointment[] = [
  { id: 'a1', clientName: 'Alice Wanjiru', phone: '+254 712 345 678', time: '9:00 AM',  reason: 'Routine eye test',    status: 'seen' },
  { id: 'a2', clientName: 'New Walk-in',   phone: '+254 700 000 000', time: '9:30 AM',  reason: 'Glasses adjustment',  status: 'seen' },
  { id: 'a3', clientName: 'Brian Ochieng', phone: '+254 722 987 654', time: '10:00 AM', reason: 'Contact lens fitting', status: 'waiting' },
  { id: 'a4', clientName: 'Cate Muthoni',  phone: '+254 733 111 222', time: '11:00 AM', reason: 'New glasses',          status: 'waiting' },
  { id: 'a5', clientName: 'David Kimani',  phone: '+254 700 555 444', time: '2:00 PM',  reason: 'Routine eye test',    status: 'waiting' },
  { id: 'a6', clientName: 'Esther Njeri',  phone: '+254 711 888 999', time: '3:00 PM',  reason: 'Eye concern',         status: 'no-show' },
]

const STATS_DATA = [
  { month: 'Oct', patients: 38 }, { month: 'Nov', patients: 45 },
  { month: 'Dec', patients: 52 }, { month: 'Jan', patients: 41 },
  { month: 'Feb', patients: 49 }, { month: 'Mar', patients: 57 },
]

// ── Component ──────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [tab, setTab] = useState('search')

  // Tab: Client Search
  const [query, setQuery] = useState('')
  const filteredClients = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return DEMO_CLIENTS
    return DEMO_CLIENTS.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q)
    )
  }, [query])

  // Tab: Appointments
  const [appts, setAppts] = useState<Appointment[]>(DEMO_APPTS)
  const updateAppt = (id: string, status: Appointment['status']) =>
    setAppts(p => p.map(a => a.id === id ? { ...a, status } : a))

  // Tab: Reminders
  const overdueClients = DEMO_CLIENTS.filter(c => new Date(c.nextDue) < new Date())
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [remindState, setRemindState] = useState<'idle' | 'sending' | 'done'>('idle')
  const toggleSelect = (id: string) => setSelected(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s })

  async function sendReminders() {
    setRemindState('sending')
    const targets = overdueClients.filter(c => selected.has(c.id) && c.email)
    try {
      await fetch('/api/remind', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'clearvision2025',
        },
        body: JSON.stringify({ clients: targets }),
      })
    } catch { /* ignore in demo */ }
    setRemindState('done')
    setSelected(new Set())
  }

  // Tab: Frames
  const [frames, setFrames] = useState<Frame[]>(opticianConfig.frames)
  const toggleStock = (id: string) => setFrames(p => p.map(f => f.id === id ? { ...f, inStock: !f.inStock } : f))
  const toggleFeatured = (id: string) => setFrames(p => p.map(f => f.id === id ? { ...f, featured: !f.featured } : f))

  // ── Login screen ───────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--hero-bg)' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--color-primary)' }}>
              <Eye className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-display text-2xl" style={{ color: 'var(--color-primary)' }}>Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">{opticianConfig.name}</p>
          </div>
          <form onSubmit={e => { e.preventDefault(); if (pw === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'clearvision2025')) setAuthed(true); else alert('Incorrect password') }}>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)}
              className="input-field mb-4" placeholder="Admin password" required />
            <button type="submit" className="btn-primary w-full py-3">Sign In</button>
          </form>
        </motion.div>
      </div>
    )
  }

  const tabs = [
    { id: 'search',    label: 'Client Search',        Icon: Search },
    { id: 'today',     label: 'Appointments Today',    Icon: Calendar },
    { id: 'reminders', label: 'Send Reminders',        Icon: Bell },
    { id: 'inventory', label: 'Frame Inventory',       Icon: Glasses },
    { id: 'stats',     label: 'Stats',                 Icon: BarChart2 },
  ]

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-14">
            <p className="font-display text-lg" style={{ color: 'var(--color-primary)' }}>{opticianConfig.name} — Admin</p>
            <button onClick={() => setAuthed(false)} className="text-xs text-gray-400 hover:text-gray-700">Sign out</button>
          </div>
          {/* Tab bar */}
          <div className="flex gap-1 overflow-x-auto pb-px scrollbar-none">
            {tabs.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  tab === id ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}>
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

            {/* ── TAB 1: CLIENT SEARCH ── */}
            {tab === 'search' && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">Client Search</h2>
                  <span className="text-xs bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full font-medium" style={{ background: '#d5f5f4', color: '#226b66' }}>
                    {DEMO_CLIENTS.length} clients
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-5">
                  Type a name or phone number — no more Ctrl+F in a spreadsheet.
                </p>
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    autoFocus
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="input-field pl-10 text-base"
                    placeholder="Search by name, phone, or email…"
                  />
                </div>

                {filteredClients.length === 0 ? (
                  <p className="text-gray-400 text-center py-16">No clients found for "{query}"</p>
                ) : (
                  <div className="space-y-3">
                    {filteredClients.map((c, i) => (
                      <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        className="card grid md:grid-cols-[1fr_auto] gap-4 items-start">
                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1">
                          <div>
                            <p className="font-semibold text-gray-900 text-lg">{c.name}</p>
                            <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mt-0.5">
                              <Phone className="w-3 h-3" />{c.phone}
                            </a>
                            {c.email && (
                              <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 mt-0.5">
                                <Mail className="w-3 h-3" />{c.email}
                              </a>
                            )}
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-500">Prescription</p>
                            <p className="font-mono font-medium text-gray-800">{c.prescription}</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-500">Last visit</p>
                            <p className="font-medium text-gray-800">{new Date(c.lastVisit).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-500">Next due</p>
                            <p className={`font-medium ${new Date(c.nextDue) < new Date() ? 'text-red-600' : 'text-gray-800'}`}>
                              {new Date(c.nextDue).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              {new Date(c.nextDue) < new Date() && ' ⚠️'}
                            </p>
                          </div>
                          {c.framePurchased && (
                            <div className="text-sm">
                              <p className="text-gray-500">Frame purchased</p>
                              <p className="text-gray-800">{c.framePurchased}</p>
                            </div>
                          )}
                          {c.notes && (
                            <div className="text-sm sm:col-span-2">
                              <p className="text-gray-500">Notes</p>
                              <p className="text-gray-700 italic">{c.notes}</p>
                            </div>
                          )}
                        </div>
                        <a href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=Hi+${encodeURIComponent(c.name)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="shrink-0 text-sm px-3 py-1.5 rounded-full font-medium text-white"
                          style={{ background: '#25D366' }}>
                          WhatsApp
                        </a>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 2: APPOINTMENTS TODAY ── */}
            {tab === 'today' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Appointments Today</h2>
                <p className="text-gray-500 text-sm mb-6">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'Total', count: appts.length, color: 'text-gray-800' },
                    { label: 'Seen', count: appts.filter(a => a.status === 'seen').length, color: 'text-green-600' },
                    { label: 'Waiting', count: appts.filter(a => a.status === 'waiting').length, color: 'text-amber-600' },
                  ].map(({ label, count, color }) => (
                    <div key={label} className="card text-center">
                      <p className={`text-3xl font-bold ${color}`}>{count}</p>
                      <p className="text-sm text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {appts.map((a, i) => (
                    <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="card flex items-center gap-4">
                      <div className="text-center shrink-0 w-16">
                        <p className="font-bold text-sm" style={{ color: 'var(--color-primary)' }}>{a.time}</p>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{a.clientName}</p>
                        <p className="text-sm text-gray-500">{a.reason}</p>
                        <a href={`tel:${a.phone}`} className="text-xs text-gray-400 hover:text-gray-700">{a.phone}</a>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {a.status !== 'seen' && (
                          <button onClick={() => updateAppt(a.id, 'seen')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-full text-xs font-medium">
                            <CheckCircle className="w-3 h-3" /> Seen
                          </button>
                        )}
                        {a.status !== 'no-show' && (
                          <button onClick={() => updateAppt(a.id, 'no-show')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-full text-xs font-medium">
                            <XCircle className="w-3 h-3" /> No-show
                          </button>
                        )}
                        {a.status !== 'waiting' && (
                          <button onClick={() => updateAppt(a.id, 'waiting')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-full text-xs font-medium">
                            <Clock className="w-3 h-3" /> Reset
                          </button>
                        )}
                      </div>
                      {/* Status badge */}
                      <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
                        a.status === 'seen'     ? 'bg-green-50 text-green-700' :
                        a.status === 'no-show'  ? 'bg-red-50 text-red-600' :
                                                  'bg-amber-50 text-amber-700'
                      }`}>
                        {a.status === 'seen' ? 'Seen' : a.status === 'no-show' ? 'No-show' : 'Waiting'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB 3: SEND REMINDERS ── */}
            {tab === 'reminders' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Send Recall Reminders</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Clients below are overdue for a check-up. Select any with an email address and send a Brevo reminder in one click.
                </p>

                {remindState === 'done' && (
                  <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
                    ✅ Reminders sent! Check your Brevo dashboard for delivery status.
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  {overdueClients.length === 0 && (
                    <p className="text-gray-400 text-center py-12">No overdue clients — great job! 🎉</p>
                  )}
                  {overdueClients.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className={`card flex items-center gap-4 cursor-pointer transition-all ${selected.has(c.id) ? 'ring-2 ring-[var(--color-primary)]' : ''}`}
                      onClick={() => toggleSelect(c.id)}>
                      <input type="checkbox" readOnly checked={selected.has(c.id)}
                        className="w-4 h-4 accent-[var(--color-primary)] pointer-events-none" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{c.name}</p>
                        <p className="text-sm text-gray-500">{c.phone}</p>
                        {c.email ? (
                          <p className="text-xs text-gray-400">{c.email}</p>
                        ) : (
                          <p className="text-xs text-red-400">No email — cannot send reminder</p>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-red-600 font-medium">Overdue</p>
                        <p className="text-gray-400 text-xs">Due: {new Date(c.nextDue).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <button
                    disabled={selected.size === 0 || remindState === 'sending'}
                    onClick={sendReminders}
                    className="btn-primary disabled:opacity-50 flex items-center gap-2">
                    {remindState === 'sending' ? <><RefreshCw className="w-4 h-4 animate-spin" /> Sending…</> : <><Bell className="w-4 h-4" /> Send Reminders ({selected.size})</>}
                  </button>
                  {selected.size > 0 && (
                    <button onClick={() => setSelected(new Set())} className="text-sm text-gray-400 hover:text-gray-700">
                      Clear selection
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 4: FRAME INVENTORY ── */}
            {tab === 'inventory' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Frame Inventory</h2>
                <p className="text-gray-500 text-sm mb-6">Toggle availability and featured status. Changes reflect on the public frames page.</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {frames.map((f, i) => (
                    <motion.div key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="card space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{f.name}</p>
                          <p className="text-xs text-gray-500">{f.brand} · {f.type}</p>
                          <p className="text-sm font-bold mt-1" style={{ color: 'var(--color-primary)' }}>
                            KES {f.price.toLocaleString()}
                          </p>
                        </div>
                        <Package className={`w-6 h-6 ${f.inStock ? 'text-green-500' : 'text-gray-300'}`} />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => toggleStock(f.id)}
                          className={`flex-1 text-xs font-medium py-2 rounded-lg transition-colors ${
                            f.inStock ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}>
                          {f.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                        </button>
                        <button onClick={() => toggleFeatured(f.id)}
                          className={`flex-1 text-xs font-medium py-2 rounded-lg transition-colors ${
                            f.featured ? 'text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          style={f.featured ? { background: 'var(--color-accent)' } : {}}>
                          {f.featured ? '★ Featured' : '☆ Feature'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center mt-6">
                  Demo mode — connect Google Sheets to persist changes across sessions.
                </p>
              </div>
            )}

            {/* ── TAB 5: STATS ── */}
            {tab === 'stats' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Practice Stats</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Clients', value: DEMO_CLIENTS.length, Icon: Users, color: 'var(--color-primary)' },
                    { label: 'Overdue Recalls', value: overdueClients.length, Icon: Bell, color: '#d97706' },
                    { label: 'Frames in Stock', value: opticianConfig.frames.filter(f => f.inStock).length, Icon: Glasses, color: 'var(--color-accent)' },
                    { label: 'Appts Today', value: DEMO_APPTS.length, Icon: Calendar, color: '#7c3aed' },
                  ].map(({ label, value, Icon, color }) => (
                    <div key={label} className="card text-center">
                      <Icon className="w-6 h-6 mx-auto mb-2" style={{ color }} />
                      <p className="text-3xl font-bold" style={{ color }}>{value}</p>
                      <p className="text-sm text-gray-500 mt-1">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                    <h3 className="font-semibold text-gray-900">Patients per Month (last 6 months)</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={STATS_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                      <Bar dataKey="patients" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
