// Types for Home page components
export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  avatar: string
}

export interface HeroSectionProps {
  onScrollToProducts: () => void
}

export interface TestimonialsSectionProps {
  testimonials?: Testimonial[]
}

export interface FooterBrandProps {
  brandName: string
  description: string
}

export interface FooterLinksProps {
  links: Array<{
    href: string
    label: string
  }>
}

export interface FooterContactProps {
  contact: {
    email: string
    phone: string
    address: string
    hours: string
  }
}

export interface ScrollBehavior {
  targetId: string
  offset?: number
  behavior?: 'smooth' | 'instant'
}

// Constants
export const NAVBAR_HEIGHT = 64

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Sarah M.',
    role: 'Student',
    content: 'Love the quality of the school supplies! The pens write so smoothly and the notebooks are adorable.',
    rating: 5,
    avatar: '👩‍🎓'
  },
  {
    id: 'testimonial-2',
    name: 'Mike R.',
    role: 'Parent',
    content: 'Great prices and fast delivery. My daughter loves all the cute accessories she got from here.',
    rating: 5,
    avatar: '👨‍👧'
  },
  {
    id: 'testimonial-3',
    name: 'Emma L.',
    role: 'Artist',
    content: 'The art supplies are amazing quality! Perfect for my creative projects. Highly recommend!',
    rating: 5,
    avatar: '👩‍🎨'
  }
]

export const FOOTER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/orders', label: 'My Orders' },
  { href: '/login', label: 'Login' },
  { href: '/register', label: 'Register' }
]

export const FOOTER_CONTACT = {
  email: 'support@mklacreations.com',
  phone: '+63 926 667 6316',
  address: 'South Fundidor, Molo, Iloilo',
  hours: 'Mon-Fri: 9AM-6PM'
}