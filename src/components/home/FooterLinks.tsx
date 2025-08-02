import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { FooterLinksProps } from '../../types/home'

/**
 * FooterLinks - Atomic component for navigation links in footer
 * Memoized to prevent unnecessary re-renders
 */
export const FooterLinks = memo<FooterLinksProps>(({ links }) => (
  <div>
    <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
    <nav aria-label="Footer navigation">
      <ul className="space-y-2">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link 
              to={href} 
              className="text-gray-300 hover:text-pink-400 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </div>
))

FooterLinks.displayName = 'FooterLinks'