// config/optician.ts — single source of truth for client customisation
export type Season = 'default' | 'valentine' | 'christmas' | 'easter'

export interface Frame {
  id: string
  name: string
  brand: string
  type: 'glasses' | 'sunglasses' | 'reading'
  price: number
  image: string
  inStock: boolean
  featured: boolean
  colors: string[]
}

export interface Client {
  id: string
  name: string
  phone: string
  email: string
  lastVisit: string        // ISO date string
  nextDue: string          // ISO date string
  prescription: string     // e.g. "R: -1.50 / L: -1.75"
  framePurchased: string
  notes: string
}

export const opticianConfig = {
  name: 'ClearVision Opticians',
  tagline: 'See Better. Live Better.',
  phone: '+254 700 123 456',
  whatsapp: '254700123456',
  email: 'hello@clearvision.co.ke',
  address: 'Ground Floor, Vision Plaza, Eldoret',
  mapsLink: 'https://maps.google.com/?q=Vision+Plaza+Eldoret',
  googleAnalyticsId: '',
  hours: {
    weekdays: '8:00 AM – 6:00 PM',
    saturday: '9:00 AM – 4:00 PM',
    sunday:   'Closed',
  },
  colors: {
    primary: '#1B3A5C',
    accent:  '#4ECDC4',
    bg:      '#F8FBFF',
    text:    '#1A1A1A',
  },
  // Set to 'default' for auto-detect, or override: 'valentine' | 'christmas' | 'easter'
  season: 'default' as Season,

  services: [
    { name: 'Comprehensive Eye Test', description: 'Full sight test including retinal health check.', price: 'KES 800', icon: '👁️' },
    { name: 'Children\'s Eye Care', description: 'Gentle, fun eye exams for ages 3 and up.', price: 'KES 500', icon: '🧒' },
    { name: 'Contact Lens Fitting', description: 'Trial lenses + fitting consultation included.', price: 'KES 600', icon: '💧' },
    { name: 'Glasses Dispensing', description: 'Choose from 200+ frames, same-day basic lenses.', price: 'From KES 2,500', icon: '🕶️' },
    { name: 'Emergency Eye Care', description: 'Walk-in for eye infections, injuries, and foreign bodies.', price: 'KES 500', icon: '🚑' },
    { name: 'Recall & Monitoring', description: 'Annual checks to monitor conditions like glaucoma.', price: 'KES 700', icon: '📋' },
  ],

  frames: [
    { id: 'f1', name: 'Metro Classic', brand: 'Ray-Ban', type: 'glasses',     price: 8500,  image: '/frames/metro.jpg',    inStock: true,  featured: true,  colors: ['Black', 'Tortoise'] },
    { id: 'f2', name: 'Aviator Pro',   brand: 'Ray-Ban', type: 'sunglasses',  price: 12000, image: '/frames/aviator.jpg',  inStock: true,  featured: true,  colors: ['Gold', 'Silver'] },
    { id: 'f3', name: 'Slim Reader',   brand: 'Silhouette', type: 'reading',  price: 3500,  image: '/frames/slim.jpg',     inStock: true,  featured: false, colors: ['Matte Black'] },
    { id: 'f4', name: 'Urban Round',   brand: 'Oakley',  type: 'glasses',     price: 6500,  image: '/frames/urban.jpg',    inStock: true,  featured: true,  colors: ['Burgundy', 'Navy'] },
    { id: 'f5', name: 'Sport Shield',  brand: 'Oakley',  type: 'sunglasses',  price: 9500,  image: '/frames/sport.jpg',    inStock: false, featured: false, colors: ['Black'] },
    { id: 'f6', name: 'Cat Eye Luxe',  brand: 'Vogue',   type: 'glasses',     price: 5500,  image: '/frames/cateye.jpg',   inStock: true,  featured: true,  colors: ['Rose Gold', 'Black'] },
  ] as Frame[],

  brevo: {
    bookingConfirmationTemplateId: 1,
    clinicNotificationTemplateId: 2,
    reminderTemplateId: 3,
  },
}
