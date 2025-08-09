"use client"

import type { Product } from "@/types/db"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

const ImageWithSkeleton = ({ src, alt }: { src: string; alt: string }) => {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="aspect-square w-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-200 flex items-center justify-center">
          <span className="text-gray-300 text-4xl">🖼️</span>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-transform duration-300 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
        onLoad={() => setLoaded(true)}
        draggable={false}
      />
    </div>
  )
}

const BuyButton = ({ isOutOfStock, productId, productName }: { isOutOfStock: boolean; productId: string; productName: string }) => (
  <Link
    href={isOutOfStock ? '#' : `/payment?product=${productId}`}
    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-pink-400
      ${isOutOfStock
        ? 'bg-gray-300 text-gray-400 cursor-not-allowed pointer-events-none'
        : 'bg-pink-600 text-white hover:bg-pink-700 focus:bg-pink-700 active:bg-pink-800'}
    `}
    aria-label={isOutOfStock ? 'Out of Stock' : `Buy ${productName}`}
    aria-disabled={isOutOfStock}
    tabIndex={isOutOfStock ? -1 : 0}
  >
    {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
  </Link>
)

export const ProductCard = ({ product }: ProductCardProps) => {
  const isOutOfStock = product.stocks === 0

  return (
    <article
      className="bg-white border border-gray-200 rounded-md shadow-sm hover:border-pink-200 hover:shadow-md transition-all duration-200 group focus-within:ring-2 focus-within:ring-pink-400 hover:scale-[1.01] product-card-hover h-full flex flex-col"
      tabIndex={0}
      aria-label={`Product: ${product.name}`}
    >
      <header className="flex-shrink-0">
        {product.image_url ? (
          <ImageWithSkeleton src={product.image_url} alt={product.name} />
        ) : (
          <div className="aspect-square w-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-300 text-4xl">🖼️</span>
          </div>
        )}
      </header>
      <section className="p-1 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-1 gap-2 h-6">
          <h3 className="font-semibold text-sm text-gray-900 group-hover:text-pink-600 transition-colors truncate flex-1" title={product.name}>
            {product.name}
          </h3>
          <span
            className={`text-xs font-medium transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${isOutOfStock ? 'text-red-500' : 'text-gray-500 group-hover:text-pink-600'}`}
            title={isOutOfStock ? 'Out of Stock' : `Stocks: ${product.stocks}`}
            aria-live="polite"
          >
            {isOutOfStock ? 'Out of Stock' : `Stocks: ${product.stocks}`}
          </span>
        </div>
        <div className="flex-1 min-h-0">
          {product.description ? (
            <p className="text-gray-500 text-xs mb-1 leading-snug line-clamp-2 h-8 overflow-hidden" title={product.description}>
              {product.description}
            </p>
          ) : (
            <div className="h-8" />
          )}
        </div>
        <div className="flex items-center justify-between pt-1 mt-auto">
          <span className="text-pink-600 font-bold text-sm transition-colors duration-200 group-hover:text-pink-700">
            ₱{product.price.toFixed(2)}
          </span>
          <BuyButton isOutOfStock={isOutOfStock} productId={product.id} productName={product.name} />
        </div>
      </section>
    </article>
  )
} 