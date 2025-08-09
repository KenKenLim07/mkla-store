import type { Product } from "@/types/db"
import { ProductCard } from "./ProductCard"
import { Layout } from "@/components/ui/Layout"

export function ProductList({ products }: { products: Product[] }) {
  return (
    <section>
      <Layout>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 items-stretch">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🛍️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
              <p className="text-gray-500">Check back soon for new items!</p>
            </div>
          ) : (
            products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </Layout>
    </section>
  )
} 