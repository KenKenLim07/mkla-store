import { lazy, Suspense, useCallback } from 'react'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { HeroSection } from '../components/home/HeroSection'
import { Layout } from '../components/ui/Layout'
import { useScrollToElement } from '../hooks/useScrollToElement'
import { NAVBAR_HEIGHT } from '../types/home'

// Lazy load heavy components for better performance
const TestimonialsSection = lazy(() => 
  import('../components/home/TestimonialsSection').then(module => ({
    default: module.TestimonialsSection
  }))
)

const ProductsSection = lazy(() => 
  import('../components/home/ProductsSection').then(module => ({
    default: module.ProductsSection
  }))
)

const Footer = lazy(() => 
  import('../components/home/Footer').then(module => ({
    default: module.Footer
  }))
)

/**
 * AnimatedSeparator - Lightweight separator component
 * Extracted for better maintainability and potential reuse
 */
const AnimatedSeparator = () => (
  <div className="relative py-1 bg-white">
    <Layout>
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-0 h-px bg-pink-300 animate-expand-line" />
        </div>
      </div>
    </Layout>
  </div>
)

/**
 * LoadingFallback - Reusable loading component for lazy-loaded sections
 */
const LoadingFallback = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex justify-center items-center py-16">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
    <span className="ml-3 text-gray-600">{message}</span>
  </div>
)

/**
 * Home - Main landing page component
 * 
 * Architecture:
 * - Clean separation of concerns with atomic components
 * - Performance optimized with lazy loading and memoization
 * - Proper error boundaries for graceful error handling
 * - Custom hooks for reusable logic
 * - TypeScript for type safety
 * - Accessibility improvements
 */
export const Home = () => {
  const { scrollToElement } = useScrollToElement()

  const handleScrollToProducts = useCallback(() => {
    scrollToElement({
      targetId: 'products-section',
      offset: NAVBAR_HEIGHT,
      behavior: 'smooth'
    })
  }, [scrollToElement])

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        {/* Hero Section - Above the fold, loaded immediately */}
        <HeroSection onScrollToProducts={handleScrollToProducts} />

        {/* Animated Separator */}
        <AnimatedSeparator />

        {/* Products Section - Lazy loaded with Suspense */}
        <ErrorBoundary fallback={
          <div className="py-16 text-center">
            <p className="text-red-600">Unable to load products. Please try refreshing the page.</p>
          </div>
        }>
          <Suspense fallback={<LoadingFallback message="Loading products..." />}>
            <ProductsSection />
          </Suspense>
        </ErrorBoundary>

        {/* Testimonials Section - Lazy loaded */}
        <ErrorBoundary fallback={
          <div className="py-16 text-center">
            <p className="text-red-600">Unable to load testimonials.</p>
          </div>
        }>
          <Suspense fallback={<LoadingFallback message="Loading testimonials..." />}>
            <TestimonialsSection />
          </Suspense>
        </ErrorBoundary>

        {/* Footer - Lazy loaded as it's below the fold */}
        <ErrorBoundary fallback={
          <div className="py-8 bg-gray-900 text-white text-center">
            <p>Unable to load footer content.</p>
          </div>
        }>
          <Suspense fallback={<LoadingFallback message="Loading footer..." />}>
            <Footer />
          </Suspense>
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  )
} 