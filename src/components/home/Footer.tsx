import { memo } from 'react'
import { Layout } from '../ui/Layout'
import { FooterBrand } from './FooterBrand'
import { FooterLinks } from './FooterLinks'
import { FooterContact } from './FooterContact'
import { FooterBottom } from './FooterBottom'
import { FOOTER_LINKS, FOOTER_CONTACT } from '../../types/home'

/**
 * Footer - Main footer component composed of atomic components
 * Memoized to prevent unnecessary re-renders
 */
export const Footer = memo(() => (
  <footer className="bg-gray-900 text-white" role="contentinfo">
    <Layout className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <FooterBrand 
          brandName="MKLA Creations"
          description="Your one-stop shop for adorable school supplies and fun finds. Making learning and creating more enjoyable for everyone!"
        />
        <FooterLinks links={FOOTER_LINKS} />
        <FooterContact contact={FOOTER_CONTACT} />
      </div>
      <FooterBottom />
    </Layout>
  </footer>
))

Footer.displayName = 'Footer'