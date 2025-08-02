import { memo, Suspense } from 'react'
import { Layout } from '../ui/Layout'
import { ProductList } from '../product/ProductList'

/**
 * ProductsSection - Products display section with loading boundary
 * Wrapped in Suspense for potential lazy loading of ProductList
 * Memoized to prevent unnecessary re-renders
 */
export const ProductsSection = memo(() => (
  <section id="products-section" className="pt-8 pb-12 bg-white">
    <Layout>
      <header className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Products</h2>
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          I carefully select each item myself! From trending favorites to hidden gems, 
          discover products that make learning and creating more fun.
        </p>
      </header>
      
      <Suspense fallback={
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      }>
        <ProductList />
      </Suspense>
    </Layout>
  </section>
))

ProductsSection.displayName = 'ProductsSection'