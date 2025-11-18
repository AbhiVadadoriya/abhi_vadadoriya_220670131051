'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Navigation from '@/components/navigation'
import { Loader2 } from 'lucide-react'

interface ReportData {
  dailyRevenue: Array<{ date: string; total: number }>
  topCustomers: Array<{ name: string; total: number }>
  categoryWiseSales: Array<{ category: string; count: number }>
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user') || '{}')

      if (user.role !== 'admin') {
        router.push('/products')
        return
      }

      const response = await fetch('/api/reports', {
        headers: { 'Authorization': `Bearer ${token}` },
      })

      if (!response.ok) throw new Error('Failed to fetch reports')

      const data = await response.json()
      setReports(data)
    } catch (err) {
      console.error('Failed to fetch reports:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation isLoggedIn={true} />
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} />

      <section className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Admin Reports</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Daily Revenue */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue (SQL Aggregation)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reports?.dailyRevenue.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-sm">{item.date}</span>
                    <span className="font-semibold text-primary">${item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category-wise Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Category-wise Sales (MongoDB Aggregation)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reports?.categoryWiseSales.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(item.count / Math.max(...(reports?.categoryWiseSales.map(c => c.count) || [1]))) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="font-semibold text-sm w-8">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Customers */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2">Customer Name</th>
                      <th className="text-right py-2">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports?.topCustomers.map((customer, i) => (
                      <tr key={i} className="border-b border-border last:border-b-0">
                        <td className="py-3">{customer.name}</td>
                        <td className="text-right font-semibold text-primary">
                          ${customer.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
