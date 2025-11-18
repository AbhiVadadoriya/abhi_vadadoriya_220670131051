'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Navigation from '@/components/navigation'
import { Trash2, Loader2 } from 'lucide-react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadCart()
    // compute isLoggedIn on client only
    if (typeof window !== 'undefined') {
      setIsLoggedIn(!!localStorage.getItem('token'))
    }
  }, [])

  const loadCart = async () => {
    setLoading(true)
    try {
      const cartData = JSON.parse(localStorage.getItem('cart') || '[]')
      
      if (cartData.length === 0) {
        setCartItems([])
        return
      }

      // Fetch product details for cart items
      const response = await fetch('/api/products/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: cartData.map((item: any) => item.id) }),
      })

      const data = await response.json()
      const itemsWithQuantity = data.products.map((product: any) => ({
        ...product,
        quantity: cartData.find((item: any) => item.id === product.id).quantity,
      }))

      setCartItems(itemsWithQuantity)
    } catch (err) {
      console.error('Failed to load cart:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    )
    setCartItems(updatedItems)

    const cart = updatedItems.map(({ id, quantity }) => ({ id, quantity }))
    localStorage.setItem('cart', JSON.stringify(cart))
  }

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id)
    setCartItems(updatedItems)

    const cart = updatedItems.map(({ id, quantity }) => ({ id, quantity }))
    localStorage.setItem('cart', JSON.stringify(cart))
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/auth/login')
      return
    }

    setIsCheckingOut(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map(({ id, quantity, price }) => ({
            productId: id,
            quantity,
            priceAtPurchase: price,
          })),
          total,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Checkout failed')
        return
      }

      localStorage.removeItem('cart')
      setCartItems([])
      router.push(`/orders/${data.order.id}`)
    } catch (err: any) {
      alert(err.message || 'Checkout failed')
    } finally {
      setIsCheckingOut(false)
    }
  }

    if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation isLoggedIn={isLoggedIn} />
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation isLoggedIn={isLoggedIn} />

      <section className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-lg text-muted-foreground mb-4">Your cart is empty</p>
              <Link href="/products">
                <Button className="bg-primary hover:bg-primary/90">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6 flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{item.name}</h3>
                      <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-4 mr-4">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 border border-input rounded hover:bg-muted"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 border border-input rounded hover:bg-muted"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-accent hover:bg-accent/90 mt-6"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </Button>

                <Button variant="outline" className="w-full">
                  <Link href="/products" className="w-full">
                    Continue Shopping
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </main>
  )
}
