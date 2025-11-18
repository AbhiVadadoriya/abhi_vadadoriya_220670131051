import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Mock authentication - replace with actual DB query
    const users = [
      { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'AdminPass123!', role: 'admin' },
      { id: '2', name: 'John Doe', email: 'john@example.com', password: 'Password123!', role: 'customer' },
    ]

    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const token = Buffer.from(
      JSON.stringify({ userId: user.id, email: user.email, role: user.role, exp: Math.floor(Date.now() / 1000) + 86400 })
    ).toString('base64')

    return NextResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    return NextResponse.json({ message: 'Login failed' }, { status: 500 })
  }
}
