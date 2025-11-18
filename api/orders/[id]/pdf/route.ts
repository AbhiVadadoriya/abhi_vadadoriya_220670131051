import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Mock PDF generation
    const orderId = params.id
    const pdfContent = `
Order Invoice
Order ID: ${orderId}
Date: ${new Date().toLocaleDateString()}

Items:
- Wireless Headphones x1 - $199.99
- Cotton T-Shirt x5 - $149.95

Total: $349.94

Thank you for your purchase!
    `.trim()

    // Create a simple PDF-like response
    const blob = new Blob([pdfContent], { type: 'text/plain' })

    return new Response(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="order-${orderId}.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to generate PDF' }, { status: 500 })
  }
}
