'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Star, Truck, Shield } from 'lucide-react'
import Navigation from '@/components/navigation'
import { useState } from 'react'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <Navigation isLoggedIn={isLoggedIn} />

      {/* Hero Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
                Premium Products at <span className="text-primary">Unbeatable Prices</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 text-balance">
                Discover curated collections of quality items delivered straight to your door. Shop with confidence backed by our 100% satisfaction guarantee.
              </p>
              <div className="flex gap-4">
                <Link href="/products">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="lg" variant="outline">
                    Join Us
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
              <ShoppingCart size={120} className="text-primary/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 md:px-8 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Enjoys?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: 'Fast Delivery', desc: 'Free shipping on orders over $50' },
              { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions with SSL' },
              { icon: Star, title: 'Quality Guaranteed', desc: 'Premium products handpicked for you' },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-card rounded-lg border border-border">
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Shopping?</h2>
          <p className="text-lg text-muted-foreground mb-8">Join thousands of happy customers today</p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-accent hover:bg-accent/90">
              Create Account Now
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
