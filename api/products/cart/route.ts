import { NextRequest, NextResponse } from 'next/server'

// Mock product database
const products = [
  { id: '1', name: 'Wireless Headphones', price: 199.99 },
  { id: '2', name: 'Cotton T-Shirt', price: 29.99 },
  { id: '3', name: 'Programming Book', price: 49.99 },
]

export async function POST(request: NextRequest) {
  try {
    const { productIds } = await request.json()

    const cartProducts = products.filter(p => productIds.includes(p.id))

    return NextResponse.json({ products: cartProducts })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 })
  }
}
