import { NextRequest, NextResponse } from 'next/server'

// Mock product database
const products = [
  { id: '1', sku: 'PROD001', name: 'Wireless Headphones', price: 199.99, category: 'electronics', description: 'Premium noise-cancelling headphones', rating: 4.5 },
  { id: '2', sku: 'PROD002', name: 'Cotton T-Shirt', price: 29.99, category: 'clothing', description: 'Comfortable cotton t-shirt', rating: 4 },
  { id: '3', sku: 'PROD003', name: 'Programming Book', price: 49.99, category: 'books', description: 'Learn web development', rating: 4.8 },
  { id: '4', sku: 'PROD004', name: 'Office Chair', price: 299.99, category: 'home', description: 'Ergonomic office chair', rating: 4.2 },
  { id: '5', sku: 'PROD005', name: 'Wireless Mouse', price: 39.99, category: 'electronics', description: 'Precision wireless mouse', rating: 4.3 },
  { id: '6', sku: 'PROD006', name: 'Denim Jeans', price: 69.99, category: 'clothing', description: 'Classic blue denim', rating: 4.1 },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'price-desc'
  const search = searchParams.get('search') || ''

  // Filter
  let filtered = products

  if (category) {
    filtered = filtered.filter(p => p.category === category)
  }

  if (search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  // Sort
  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price)
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price)
  } else if (sort === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  }

  // Paginate
  const start = (page - 1) * limit
  const paginatedProducts = filtered.slice(start, start + limit)

  return NextResponse.json({
    products: paginatedProducts,
    total: filtered.length,
    page,
    limit,
  })
}
