'use client'

import {
  ResponsiveContainer, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import type { RevenueDataPoint } from '@/lib/admin/types'

interface Props {
  data: RevenueDataPoint[]
}

export default function AdminRevenueChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `£${v}`} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / .07)' }}
          formatter={(value: number, name: string) => [
            name === 'revenue' ? `£${value.toLocaleString()}` : value,
            name === 'revenue' ? 'Revenue' : 'Bookings',
          ]}
        />
        <Legend iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
        <Bar dataKey="revenue" fill="#2563eb" fillOpacity={0.85} radius={[4, 4, 0, 0]} name="revenue" />
        <Line dataKey="bookings" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b' }} name="bookings" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
