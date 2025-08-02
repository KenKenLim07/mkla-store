import { memo } from 'react'
import { Layout } from '../ui/Layout'
import { TestimonialCard } from './TestimonialCard'
import { TESTIMONIALS_DATA } from '../../types/home'
import type { TestimonialsSectionProps } from '../../types/home'

/**
 * TestimonialsSection - Section component displaying customer testimonials
 * Uses default testimonials data with option to override
 * Memoized for performance optimization
 */
export const TestimonialsSection = memo<TestimonialsSectionProps>(({ 
  testimonials = TESTIMONIALS_DATA 
}) => (
  <section className="py-16 bg-white">
    <Layout>
      <header className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Don't just take our word for it - hear from our happy customers!
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </Layout>
  </section>
))

TestimonialsSection.displayName = 'TestimonialsSection'