const WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL || ''

export async function appendToSheet(data: Record<string, unknown>): Promise<void> {
  if (!WEBHOOK_URL) {
    console.warn('SHEETS_WEBHOOK_URL not set — skipping Google Sheets write.')
    return
  }
  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Sheets webhook failed: ${res.status}`)
}
