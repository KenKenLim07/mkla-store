import { memo } from 'react'
import type { FooterBrandProps } from '../../types/home'

/**
 * FooterBrand - Atomic component for brand section in footer
 * Memoized to prevent unnecessary re-renders
 */
export const FooterBrand = memo<FooterBrandProps>(({ brandName, description }) => (
  <div className="col-span-1 md:col-span-2">
    <div className="flex items-center space-x-3 mb-4">
      <span className="text-3xl" role="img" aria-label="Shopping bag">🛍️</span>
      <h3 className="text-2xl font-bold text-pink-400">{brandName}</h3>
    </div>
    <p className="text-gray-300 mb-4 max-w-md">
      {description}
    </p>
    <div className="flex space-x-4" role="list" aria-label="Social media links">
      <a 
        href="#" 
        className="text-gray-400 hover:text-pink-400 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
        aria-label="Visit our Facebook page"
      >
        <span role="img" aria-hidden="true">📘</span>
      </a>
      <a 
        href="#" 
        className="text-gray-400 hover:text-pink-400 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
        aria-label="Visit our Instagram page"
      >
        <span role="img" aria-hidden="true">📷</span>
      </a>
      <a 
        href="#" 
        className="text-gray-400 hover:text-pink-400 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
        aria-label="Visit our Twitter page"
      >
        <span role="img" aria-hidden="true">🐦</span>
      </a>
    </div>
  </div>
))

FooterBrand.displayName = 'FooterBrand'