'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import AnimatedSection from '@/components/ui/AnimatedSection'

const stats = [
  { value: 1000, suffix: '+', label: 'Pilgrims Served', sublabel: 'Since 2018' },
  { value: 6, suffix: '+', label: 'Years Experience', sublabel: 'Trusted service' },
  { value: 4.9, suffix: '★', label: 'Average Rating', sublabel: '500+ reviews' },
  { value: 24, suffix: '/7', label: 'Support Available', sublabel: 'Always reachable' },
]

function CountUp({
  target,
  suffix,
  decimals = 0,
}: {
  target: number
  suffix: string
  decimals?: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const duration = 1800
    const steps = 60
    const increment = target / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(current + increment, target)
      setCount(parseFloat(current.toFixed(decimals)))
      if (step >= steps) clearInterval(timer)
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isInView, target, decimals])

  return (
    <span ref={ref}>
      {decimals > 0 ? count.toFixed(decimals) : Math.round(count)}
      {suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section className="py-14 bg-brand-700">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <AnimatedSection
              key={stat.label}
              delay={i * 0.1}
              className="text-center"
            >
              <div className="text-4xl lg:text-5xl font-bold text-white mb-1">
                <CountUp
                  target={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.value % 1 !== 0 ? 1 : 0}
                />
              </div>
              <div className="text-white font-semibold text-sm lg:text-base mb-0.5">
                {stat.label}
              </div>
              <div className="text-brand-200 text-xs">{stat.sublabel}</div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
