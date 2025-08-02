import { memo } from 'react'
import { Link } from 'react-router-dom'
import { HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { Layout } from '../ui/Layout'
import type { HeroSectionProps } from '../../types/home'

/**
 * HeroSection - Hero banner component with call-to-action buttons
 * Memoized to prevent unnecessary re-renders when parent state changes
 */
export const HeroSection = memo<HeroSectionProps>(({ onScrollToProducts }) => (
  <section className="relative bg-white overflow-hidden pb-4">
    <Layout className="relative py-6 sm:py-8">
      <div className="text-center">
        <header className="flex items-center justify-center space-x-3 mb-4">
          <span className="text-3xl sm:text-4xl" role="img" aria-label="Waving hand">👋</span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-pink-600 tracking-tight">
            Hi, I'm Mikela!
          </h1>
        </header>
        
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
          I'm a 13-year-old aspiring entrepreneur passionate about helping everyone find the perfect items! 
          Welcome to my little store where I curate adorable and quality products just for you.
        </p>
        
        <div className="flex flex-row gap-3 justify-center items-center">
          <button
            onClick={onScrollToProducts}
            className="inline-flex items-center px-6 py-3 bg-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-base focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            aria-label="Scroll to products section"
          >
            <ShoppingBagIcon className="w-4 h-4 mr-2" aria-hidden="true" />
            Shop Now
          </button>
          
          <Link
            to="/orders"
            className="inline-flex items-center px-6 py-3 border-2 border-pink-600 text-pink-600 font-semibold rounded-full hover:bg-pink-50 transition-all duration-200 text-base focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            aria-label="View your orders"
          >
            <HeartIcon className="w-4 h-4 mr-2" aria-hidden="true" />
            My Orders
          </Link>
        </div>
      </div>
    </Layout>
  </section>
))

HeroSection.displayName = 'HeroSection'