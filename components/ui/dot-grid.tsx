'use client'

import { useRef, useEffect, useState } from 'react'

interface DotGridProps {
  /** Dot size in px */
  dotSize?: number
  /** Spacing between dots in px */
  spacing?: number
  /** Opacity range for the shimmer animation */
  opacityMin?: number
  opacityMax?: number
  /** Color of dots — uses CSS currentColor by default (adapts to foreground) */
  color?: string
}

export function DotGrid({
  dotSize = 1.5,
  spacing = 28,
  opacityMin = 0.04,
  opacityMax = 0.12,
  color = 'currentColor',
}: DotGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ cols: 0, rows: 0 })

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return
      const { offsetWidth: w, offsetHeight: h } = containerRef.current
      setDims({
        cols: Math.ceil(w / spacing) + 1,
        rows: Math.ceil(h / spacing) + 1,
      })
    }
    update()
    const observer = new ResizeObserver(update)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [spacing])

  const total = dims.cols * dims.rows

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ color }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>{`
            .dot { animation: dotPulse var(--dur, 4s) ease-in-out infinite alternate; }
            @keyframes dotPulse {
              0%   { opacity: ${opacityMin}; }
              100% { opacity: ${opacityMax}; }
            }
          `}</style>
        </defs>
        {Array.from({ length: total }).map((_, i) => {
          const col = i % dims.cols
          const row = Math.floor(i / dims.cols)
          const cx = col * spacing + spacing / 2
          const cy = row * spacing + spacing / 2
          // Stagger the animation — each dot has a unique delay
          const delay = ((col * 13 + row * 7) % 50) * 0.1
          const dur = 3 + ((col * 11 + row * 5) % 30) * 0.2
          return (
            <circle
              key={`${col}-${row}`}
              className="dot"
              cx={cx}
              cy={cy}
              r={dotSize / 2}
              fill="currentColor"
              style={{
                '--dur': `${dur}s`,
                animationDelay: `${delay}s`,
              } as React.CSSProperties}
            />
          )
        })}
      </svg>
    </div>
  )
}
