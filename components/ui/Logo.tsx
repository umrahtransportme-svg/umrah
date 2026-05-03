'use client'

interface LogoMarkProps {
  size?: number
}

export function LogoMark({ size = 40 }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Umrah Transport logo"
    >
      {/* Deep navy background */}
      <rect width="100" height="100" rx="22" fill="#0F2044" />

      {/* Location pin — gold teardrop */}
      <path
        d="M 50 10 A 22 22 0 0 1 72 32 Q 72 52 50 88 Q 28 52 28 32 A 22 22 0 0 1 50 10 Z"
        fill="#C8A44A"
      />

      {/* Inner circle cutout */}
      <circle cx="50" cy="32" r="12" fill="#0F2044" />

      {/* Crescent inside the pin */}
      <circle cx="50" cy="32" r="8" fill="#C8A44A" />
      <circle cx="55" cy="29" r="6.5" fill="#0F2044" />
    </svg>
  )
}

// ── Full horizontal logo (icon + wordmark) ─────────────────────────────────────

interface LogoProps {
  /** 'dark' = dark text (use on light backgrounds)
   *  'light' = white text (use on dark/navy backgrounds) */
  variant?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ variant = 'dark', size = 'md', className = '' }: LogoProps) {
  const iconSize  = size === 'sm' ? 32 : size === 'lg' ? 52 : 40
  const nameSize  = size === 'sm' ? '1.05rem' : size === 'lg' ? '1.3rem'  : '1.15rem'
  const subSize   = size === 'sm' ? '0.58rem' : size === 'lg' ? '0.72rem' : '0.63rem'
  const nameColor = variant === 'light' ? '#FFFFFF' : '#0F2044'
  const subColor  = '#C8A44A'

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark size={iconSize} />
      <div style={{ lineHeight: 1 }}>
        <div
          style={{
            color: nameColor,
            fontWeight: 900,
            fontSize: nameSize,
            letterSpacing: '-0.01em',
            lineHeight: 1,
          }}
        >
          Umrah
        </div>
        <div
          style={{
            color: subColor,
            fontWeight: 600,
            fontSize: subSize,
            letterSpacing: '0.18em',
            lineHeight: 1,
            marginTop: 5,
            textTransform: 'uppercase',
          }}
        >
          Transport
        </div>
      </div>
    </div>
  )
}

// ── Standalone SVG string for use in emails / meta images ─────────────────────
export const LOGO_SVG = `<svg width="210" height="60" viewBox="0 0 210 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="56" height="56" rx="13" fill="#0F2044" x="2" y="2"/>
  <path d="M 30 8 A 13 13 0 0 1 43 21 Q 43 32 30 52 Q 17 32 17 21 A 13 13 0 0 1 30 8 Z" fill="#C8A44A"/>
  <circle cx="30" cy="21" r="7" fill="#0F2044"/>
  <circle cx="30" cy="21" r="4.5" fill="#C8A44A"/>
  <circle cx="33" cy="19" r="3.8" fill="#0F2044"/>
  <text x="66" y="34" font-family="system-ui,Arial,sans-serif" font-weight="900" font-size="22" fill="#0F2044" letter-spacing="-0.3">Umrah</text>
  <text x="67" y="48" font-family="system-ui,Arial,sans-serif" font-weight="600" font-size="9.5" fill="#C8A44A" letter-spacing="3.5">TRANSPORT</text>
</svg>`
