'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Menu, X, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface NavigationProps {
  isLoggedIn: boolean
}

export default function Navigation({ isLoggedIn }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const [userName, setUserName] = useState('User')

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          ENJOYS
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/products" className="hover:text-primary transition">
            Products
          </Link>
          {isLoggedIn && (
            <>
              <Link href="/orders" className="hover:text-primary transition">
                My Orders
              </Link>
              <Link href="/reports" className="hover:text-primary transition">
                Reports
              </Link>
            </>
          )}
          <Link href="/cart">
            <ShoppingCart className="w-6 h-6 hover:text-primary transition" />
          </Link>
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-sm">{userName}</span>
              <Button size="sm" variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button size="sm" variant="outline">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border p-4 space-y-4">
          <Link href="/products" className="block hover:text-primary">
            Products
          </Link>
          {isLoggedIn && (
            <>
              <Link href="/orders" className="block hover:text-primary">
                My Orders
              </Link>
              <Link href="/reports" className="block hover:text-primary">
                Reports
              </Link>
            </>
          )}
          <Link href="/cart" className="block hover:text-primary">
            Cart
          </Link>
          {isLoggedIn ? (
            <Button size="sm" variant="outline" onClick={handleLogout} className="w-full">
              Logout
            </Button>
          ) : (
            <div className="space-y-2">
              <Link href="/auth/login">
                <Button size="sm" variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
