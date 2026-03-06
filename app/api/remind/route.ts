import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { opticianConfig } from '@/config/optician'

export async function POST(req: NextRequest) {
  // Require admin password
  const auth = req.headers.get('x-admin-password')
  const adminPw = process.env.ADMIN_PASSWORD || 'clearvision2025'
  if (auth !== adminPw) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { clients: { name: string; email: string; phone: string }[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { clients } = body
  if (!Array.isArray(clients) || clients.length === 0) {
    return NextResponse.json({ error: 'No clients provided.' }, { status: 400 })
  }

  const results: { email: string; ok: boolean }[] = []
  for (const client of clients) {
    if (!client.email) { results.push({ email: '', ok: false }); continue }
    try {
      await sendEmail(client.email, opticianConfig.brevo.reminderTemplateId, {
        name: client.name,
        clinicName: opticianConfig.name,
        phone: opticianConfig.phone,
        bookingLink: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/book`,
      })
      results.push({ email: client.email, ok: true })
    } catch {
      results.push({ email: client.email, ok: false })
    }
  }

  return NextResponse.json({ results })
}
