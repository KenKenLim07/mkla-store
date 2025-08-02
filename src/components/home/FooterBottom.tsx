import { memo } from 'react'

/**
 * FooterBottom - Atomic component for bottom copyright and legal links
 * Memoized to prevent unnecessary re-renders since data rarely changes
 */
export const FooterBottom = memo(() => {
  const currentYear = new Date().getFullYear()

  return (
    <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
      <p className="text-gray-400 text-sm">
        © {currentYear} MKLA Creations. All rights reserved.
      </p>
      <nav aria-label="Legal links" className="flex space-x-6 mt-4 md:mt-0">
        <a 
          href="#" 
          className="text-gray-400 hover:text-pink-400 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
        >
          Privacy Policy
        </a>
        <a 
          href="#" 
          className="text-gray-400 hover:text-pink-400 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
        >
          Terms of Service
        </a>
        <a 
          href="#" 
          className="text-gray-400 hover:text-pink-400 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
        >
          Shipping Info
        </a>
      </nav>
    </div>
  )
})

FooterBottom.displayName = 'FooterBottom'