import { memo } from 'react'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import type { Testimonial } from '../../types/home'

interface TestimonialCardProps {
  testimonial: Testimonial
}

/**
 * TestimonialCard - Atomic component for individual testimonial display
 * Memoized to prevent unnecessary re-renders when testimonials array changes
 */
export const TestimonialCard = memo<TestimonialCardProps>(({ testimonial }) => (
  <article className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
    <header className="flex items-center mb-4">
      <div className="text-3xl mr-3" role="img" aria-label={`${testimonial.role} avatar`}>
        {testimonial.avatar}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
        <p className="text-sm text-gray-600">{testimonial.role}</p>
      </div>
    </header>
    
    <div className="flex items-center mb-3" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
      {Array.from({ length: testimonial.rating }, (_, i) => (
        <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" aria-hidden="true" />
      ))}
    </div>
    
    <blockquote className="text-gray-700 italic">
      "{testimonial.content}"
    </blockquote>
  </article>
))

TestimonialCard.displayName = 'TestimonialCard'