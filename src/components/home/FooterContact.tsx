import { memo } from 'react'
import type { FooterContactProps } from '../../types/home'

/**
 * FooterContact - Atomic component for contact information in footer
 * Memoized to prevent unnecessary re-renders
 */
export const FooterContact = memo<FooterContactProps>(({ contact }) => (
  <div>
    <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
    <address className="not-italic">
      <ul className="space-y-2 text-gray-300">
        <li className="flex items-center gap-2">
          <span role="img" aria-label="Email">📧</span>
          <a 
            href={`mailto:${contact.email}`}
            className="hover:text-pink-400 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
          >
            {contact.email}
          </a>
        </li>
        <li className="flex items-center gap-2">
          <span role="img" aria-label="Phone">📱</span>
          <a 
            href={`tel:${contact.phone.replace(/\s/g, '')}`}
            className="hover:text-pink-400 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
          >
            {contact.phone}
          </a>
        </li>
        <li className="flex items-center gap-2">
          <span role="img" aria-label="Address">📍</span>
          <span>{contact.address}</span>
        </li>
        <li className="flex items-center gap-2">
          <span role="img" aria-label="Hours">🕒</span>
          <span>{contact.hours}</span>
        </li>
      </ul>
    </address>
  </div>
))

FooterContact.displayName = 'FooterContact'