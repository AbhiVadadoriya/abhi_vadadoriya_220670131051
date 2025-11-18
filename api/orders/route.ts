import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { items, total } = await request.json()

    const orderId = 'ORD-' + Date.now()

    return NextResponse.json({
      order: {
        id: orderId,
        total,
        items,
        createdAt: new Date().toISOString(),
        status: 'completed',
      },
    })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Mock orders
    const orders = [
      {
        id: 'ORD-123456',
        total: 299.98,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'completed',
        items: [
          { id: '1', productName: 'Wireless Headphones', quantity: 1, priceAtPurchase: 199.99 },
          { id: '2', productName: 'Cotton T-Shirt', quantity: 5, priceAtPurchase: 29.99 },
        ],
      },
    ]

    return NextResponse.json({ orders })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 })
  }
}
