import { NextRequest, NextResponse } from 'next/server'
import { appendToSheet } from '@/lib/sheets'
import { sendEmail } from '@/lib/email'
import { opticianConfig } from '@/config/optician'

// Simple in-memory rate limiter (resets on server restart / cold start)
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3
const WINDOW_MS = 60 * 60 * 1000 // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  if (entry.count >= RATE_LIMIT) return true
  entry.count++
  return false
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot check
  if (body._hp) {
    return NextResponse.json({ ok: true }) // silently discard bot
  }

  const { name, phone, email, date, time, reason } = body
  if (!name || !phone || !date || !time) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const record = {
    timestamp: new Date().toISOString(),
    name, phone, email: email || '',
    date, time, reason: reason || '',
  }

  try {
    await appendToSheet(record)
    if (email) {
      await sendEmail(email, opticianConfig.brevo.bookingConfirmationTemplateId, {
        name, date, time, phone: opticianConfig.phone,
      })
    }
    await sendEmail(opticianConfig.email, opticianConfig.brevo.clinicNotificationTemplateId, {
      name, phone, date, time, reason: reason || 'Not specified',
    })
  } catch (err) {
    console.error('Booking handler error:', err)
    // Don't expose internal errors to the client
  }

  return NextResponse.json({ ok: true })
}
