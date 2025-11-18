'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Navigation from '@/components/navigation'
import { ShoppingCart, Loader2, Star } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  rating: number
  sku: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('price-desc')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    fetchProducts()
    if (typeof window !== 'undefined') {
      setIsLoggedIn(!!localStorage.getItem('token'))
    }
  }, [category, sortBy, page, search])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        category: category !== 'all' ? category : '',
        sort: sortBy,
        search,
      })

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (productId: string) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const exists = cart.find((item: any) => item.id === productId)

    if (exists) {
      exists.quantity += 1
    } else {
      cart.push({ id: productId, quantity: 1 })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Added to cart!')
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation isLoggedIn={isLoggedIn} />

      <section className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Products</h1>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-input rounded-md bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="w-full px-4 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home & Garden</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-md bg-background"
            >
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={() => setPage(1)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="aspect-square bg-muted rounded-md mb-4"></div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold line-clamp-2 mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(Math.round(product.rating))].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                      <Button
                        size="sm"
                        onClick={() => addToCart(product.id)}
                        className="bg-secondary hover:bg-secondary/90"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>

                    <Link href={`/products/${product.id}`}>
                      <Button variant="outline" className="w-full mt-3">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                variant="outline"
              >
                Previous
              </Button>
              <span className="flex items-center px-4">Page {page}</span>
              <Button
                onClick={() => setPage(page + 1)}
                disabled={products.length < 12}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
