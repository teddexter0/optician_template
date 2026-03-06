const BREVO_API_KEY = process.env.BREVO_API_KEY || ''

export async function sendEmail(
  to: string,
  templateId: number,
  params: Record<string, unknown>
): Promise<void> {
  if (!BREVO_API_KEY) {
    console.warn('BREVO_API_KEY not set — skipping email.')
    return
  }
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify({
      to: [{ email: to }],
      templateId,
      params,
    }),
  })
  if (!res.ok) throw new Error(`Brevo send failed: ${res.status}`)
}
