import { Layout } from "@/components/ui/Layout"
import { ProductList } from "@/components/product/ProductList"
import type { Product } from "@/types/db"
import { ShoppingBagIcon, HeartIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

export const metadata = {
  title: "MKLA Creations | Home",
  description: "A cute store by Mikela with curated products",
}

async function fetchProducts(): Promise<Product[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return []
  // Avoid importing supabase in a server file with 'use client' version; do a simple fetch via REST
  const res = await fetch(`${url}/rest/v1/products?select=*&order=created_at.desc`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    // Revalidate frequently during migration; adjust later
    next: { revalidate: 60 },
  })
  if (!res.ok) return []
  return res.json()
}

function Hero() {
  return (
    <section className="relative bg-white overflow-hidden pb-4">
      <Layout className="relative py-6 sm:py-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="text-3xl sm:text-4xl">👋</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-pink-600 tracking-tight">
              Hi, I&apos;m Mikela!
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            I&apos;m a 13-year-old aspiring entrepreneur passionate about helping everyone find the perfect items!
            Welcome to my little store where I curate adorable and quality products for everyone.
          </p>
          <div className="flex flex-row gap-3 justify-center items-center">
            <a
              href="#products-section"
              className="inline-flex items-center px-6 py-3 bg-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-base"
            >
              <ShoppingBagIcon className="w-4 h-4 mr-2" />
              Shop Now
            </a>
            <Link
              href="/orders"
              className="inline-flex items-center px-6 py-3 border-2 border-pink-600 text-pink-600 font-semibold rounded-full hover:bg-pink-50 transition-all duration-200 text-base"
            >
              <HeartIcon className="w-4 h-4 mr-2" />
              My Orders
            </Link>
          </div>
        </div>
      </Layout>
    </section>
  )
}

function Testimonials() {
  const testimonials = [
    { name: 'Sarah M.', role: 'Student', content: 'Love the quality of everything! The items are so cute and well-made. Perfect for my needs!', rating: 5, avatar: '👩‍🎓' },
    { name: 'Mike R.', role: 'Parent', content: 'Great prices and adorable items! My daughter loves all the cute accessories she got from here.', rating: 5, avatar: '👨‍👧' },
    { name: 'Emma L.', role: 'Artist', content: 'The quality is amazing! Perfect for my creative projects and daily use. Highly recommend!', rating: 5, avatar: '👩‍🎨' },
  ]
  return (
    <section className="py-16 bg-white">
      <Layout>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don&apos;t just take our word for it - hear from our happy customers!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">{t.avatar}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t.name}</h4>
                  <p className="text-sm text-gray-600">{t.role}</p>
                </div>
              </div>
              <div className="flex items-center mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.402 8.172L12 18.896 4.664 23.168l1.402-8.172L.132 9.21l8.2-1.192z"/></svg>
                ))}
              </div>
              <p className="text-gray-700 italic">&quot;{t.content}&quot;</p>
            </div>
          ))}
        </div>
      </Layout>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <Layout className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl">🛍️</span>
              <h3 className="text-2xl font-bold text-pink-400">MKLA Creations</h3>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your one-stop shop for adorable items and fun finds.
              Making life more enjoyable and colorful for everyone!
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-pink-400 transition-colors">Home</Link></li>
              <li><Link href="/orders" className="text-gray-300 hover:text-pink-400 transition-colors">My Orders</Link></li>
              <li><Link href="/login" className="text-gray-300 hover:text-pink-400 transition-colors">Login</Link></li>
              <li><Link href="/register" className="text-gray-300 hover:text-pink-400 transition-colors">Register</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li>📧 support@mklacreations.com</li>
              <li>📱 +63 926 667 6316</li>
              <li>📍 South Fundidor, Molo, Iloilo</li>
              <li>🕒 Mon-Fri: 9AM-6PM</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} MKLA Creations. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">Shipping Info</a>
          </div>
        </div>
      </Layout>
      </footer>
  )
}

export default async function Page() {
  const products = await fetchProducts()
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="relative py-1 bg-white">
        <Layout>
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-0 h-px bg-pink-300 animate-expand-line"></div>
            </div>
          </div>
        </Layout>
      </div>
      <section id="products-section" className="pt-8 pb-12 bg-white">
        <Layout>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              I carefully select each item myself! From trending favorites to hidden gems, discover products that make life more fun and colorful.
            </p>
          </div>
          <ProductList products={products} />
        </Layout>
      </section>
      <Testimonials />
      <Footer />
    </div>
  )
}
