import type { Season } from '@/config/optician'

export function detectSeason(): Season {
  const now = new Date()
  const m = now.getMonth() + 1
  const d = now.getDate()
  if (m === 2 && d <= 14) return 'valentine'
  if (m === 12 && d <= 26) return 'christmas'
  if ((m === 3 && d >= 20) || (m === 4 && d <= 15)) return 'easter'
  return 'default'
}
