export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
}

export const generateOrderNumber = (): string => {
  return `ORD-${Date.now().toString().slice(-8)}`
}

export const calculateDiscount = (originalPrice: number, discountPercent: number): number => {
  return originalPrice * (1 - discountPercent / 100)
}

export const getTotalPrice = (items: Array<{ price: number; quantity: number }>): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export const sortProducts = (products: any[], sortBy: string): any[] => {
  const sorted = [...products]

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    default:
      return sorted
  }
}
