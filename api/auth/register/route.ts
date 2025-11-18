import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Mock registration - replace with actual DB query
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const token = Buffer.from(
      JSON.stringify({ userId: 'new-' + Date.now(), email, role: 'customer', exp: Math.floor(Date.now() / 1000) + 86400 })
    ).toString('base64')

    return NextResponse.json({
      token,
      user: { id: 'new-' + Date.now(), name, email, role: 'customer' },
    })
  } catch (error) {
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 })
  }
}
