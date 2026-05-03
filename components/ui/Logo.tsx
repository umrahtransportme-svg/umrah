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
      aria-label="Hajj Umrah Rentals logo mark"
    >
      {/* Navy rounded-square background */}
      <rect width="100" height="100" rx="22" fill="#1B2F5B" />

      {/* Subtle inner border ring */}
      <rect
        x="3.5" y="3.5" width="93" height="93" rx="19"
        fill="none" stroke="#C8A44A" strokeWidth="1" opacity="0.25"
      />

      {/* ── Crescent moon (gold) ── */}
      {/* Full golden circle */}
      <circle cx="49" cy="35" r="19" fill="#C8A44A" />
      {/* Cutout shifted right+up to create crescent opening right */}
      <circle cx="57" cy="30" r="16" fill="#1B2F5B" />

      {/* Small 4-point star beside crescent */}
      <path
        d="M71 21 L72.4 25 L76.5 25 L73.3 27.6 L74.7 31.5 L71 29 L67.3 31.5 L68.7 27.6 L65.5 25 L69.6 25 Z"
        fill="#C8A44A"
      />

      {/* ── Ka'bah (the holy cube) ── */}
      {/* Main body — warm cream/ivory */}
      <rect x="29" y="56" width="42" height="31" rx="1.5" fill="#F4EDD8" />

      {/* Black cloth cover (top portion — the kiswa) */}
      <rect x="29" y="56" width="42" height="17" rx="1.5" fill="#1B2F5B" />

      {/* Gold kiswa belt/embroidery band */}
      <rect x="29" y="67" width="42" height="5" fill="#C8A44A" />

      {/* Arched door (golden arch frame) */}
      <path
        d="M43 87 L43 76 Q50 71 57 76 L57 87 Z"
        fill="#C8A44A" opacity="0.9"
      />
      {/* Door interior */}
      <path
        d="M45 87 L45 77 Q50 73.5 55 77 L55 87 Z"
        fill="#1B2F5B"
      />

      {/* Left corner stone detail */}
      <rect x="27" y="56" width="4" height="31" rx="1" fill="#C8A44A" opacity="0.15" />
      {/* Right corner stone detail */}
      <rect x="69" y="56" width="4" height="31" rx="1" fill="#C8A44A" opacity="0.15" />

      {/* ── Ground / road line ── */}
      <rect x="18" y="87" width="64" height="2" rx="1" fill="#C8A44A" opacity="0.45" />

      {/* Subtle road dashes (suggests transportation) */}
      <rect x="18" y="92" width="14" height="1.5" rx="0.75" fill="#C8A44A" opacity="0.25" />
      <rect x="38" y="92" width="14" height="1.5" rx="0.75" fill="#C8A44A" opacity="0.25" />
      <rect x="58" y="92" width="14" height="1.5" rx="0.75" fill="#C8A44A" opacity="0.25" />
    </svg>
  )
}

// ── Full horizontal logo (icon + wordmark) ─────────────────────────────────────

interface LogoProps {
  /** 'dark' = dark text (use on white/light backgrounds)
   *  'light' = white text (use on dark/navy backgrounds) */
  variant?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ variant = 'dark', size = 'md', className = '' }: LogoProps) {
  const iconSize  = size === 'sm' ? 30 : size === 'lg' ? 52 : 38
  const nameSize  = size === 'sm' ? '0.8rem'  : size === 'lg' ? '1.1rem'  : '0.9rem'
  const subSize   = size === 'sm' ? '0.6rem'  : size === 'lg' ? '0.75rem' : '0.65rem'
  const nameColor = variant === 'light' ? '#FFFFFF' : '#1B2F5B'
  const subColor  = '#C8A44A'

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={iconSize} />
      <div style={{ lineHeight: 1 }}>
        <div
          style={{
            color: nameColor,
            fontWeight: 800,
            fontSize: nameSize,
            letterSpacing: '0.04em',
            lineHeight: 1,
          }}
        >
          HAJJ UMRAH
        </div>
        <div
          style={{
            color: subColor,
            fontWeight: 700,
            fontSize: subSize,
            letterSpacing: '0.12em',
            lineHeight: 1,
            marginTop: 4,
          }}
        >
          RENTALS
        </div>
      </div>
    </div>
  )
}

// ── Standalone SVG string for use in emails / meta images ─────────────────────
export const LOGO_SVG = `<svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="56" height="56" rx="13" fill="#1B2F5B" x="2" y="2"/>
  <rect x="5" y="5" width="50" height="50" rx="11" fill="none" stroke="#C8A44A" stroke-width="0.6" opacity="0.3"/>
  <circle cx="30" cy="22" r="11" fill="#C8A44A"/>
  <circle cx="35" cy="19" r="9.5" fill="#1B2F5B"/>
  <path d="M41.5 13.5 L42.3 16 L44.9 16 L42.8 17.6 L43.6 20.1 L41.5 18.5 L39.4 20.1 L40.2 17.6 L38.1 16 L40.7 16 Z" fill="#C8A44A"/>
  <rect x="17" y="34" width="26" height="19" rx="1" fill="#F4EDD8"/>
  <rect x="17" y="34" width="26" height="11" rx="1" fill="#1B2F5B"/>
  <rect x="17" y="41" width="26" height="3" fill="#C8A44A"/>
  <path d="M26 53 L26 47 Q30 44.5 34 47 L34 53 Z" fill="#C8A44A" opacity="0.9"/>
  <path d="M27.5 53 L27.5 47.5 Q30 45.5 32.5 47.5 L32.5 53 Z" fill="#1B2F5B"/>
  <rect x="10" y="53" width="40" height="1.5" rx="0.75" fill="#C8A44A" opacity="0.4"/>
  <text x="68" y="30" font-family="system-ui,Arial,sans-serif" font-weight="800" font-size="16" fill="#1B2F5B" letter-spacing="1.5">HAJJ UMRAH</text>
  <text x="68" y="44" font-family="system-ui,Arial,sans-serif" font-weight="700" font-size="10" fill="#C8A44A" letter-spacing="3">RENTALS</text>
</svg>`
