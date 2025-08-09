import type { Metadata } from 'next'
import Image from 'next/image'

type Product = {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
  stocks: number
  created_at?: string
}

async function fetchProduct(id: string): Promise<Product | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  const res = await fetch(`${url}/rest/v1/products?select=*&id=eq.${id}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  const data = await res.json()
  return data?.[0] || null
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await fetchProduct(params.id)
  if (!product) return { title: 'Product Not Found' }
  const title = `${product.name} | MKLA Creations`
  const description = product.description || `Buy ${product.name} at MKLA Creations.`
  return { title, description, openGraph: { title, description, images: product.image_url ? [product.image_url] : [] } }
}

export default async function Page({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id)
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="text-gray-600 mt-2">The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image_url ? [product.image_url] : [],
    sku: product.id,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PHP',
      price: product.price,
      availability: product.stocks > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300">🖼️</div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <div className="mt-2 text-pink-600 text-2xl font-semibold">₱{product.price.toFixed(2)}</div>
          {product.description && <p className="mt-4 text-gray-700 leading-relaxed">{product.description}</p>}
          <div className="mt-4">
            <span className={`px-3 py-1 rounded-full text-sm ${product.stocks === 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-800'}`}>
              {product.stocks === 0 ? 'Out of Stock' : `Stocks: ${product.stocks}`}
            </span>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  )
} 