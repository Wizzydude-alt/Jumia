// ============================================================
// HEROBANNER.JSX — Auto-sliding promotional banner
//
// Matches Jumia's homepage hero section with:
//   - 4 promo slides (orange/dark theme)
//   - Auto-advances every 4 seconds
//   - Left/right arrow controls
//   - Dot indicators at the bottom
// ============================================================

import { useState, useEffect } from "react"

// Each slide has a background colour, headline, sub-text, CTA label & accent colour
const slides = [
  {
    id: 1,
    bg: "#F68B1E",
    textColor: "#fff",
    badge: "Flash Deals",
    headline: "Up to 79% Off",
    sub: "Phones, Electronics & More",
    cta: "Shop Now",
    accent: "#fff",
    pattern: "phones",
  },
  {
    id: 2,
    bg: "#1A1A2E",
    textColor: "#fff",
    badge: "Limited Time",
    headline: "Brand Festival",
    sub: "Samsung · Infinix · Xiaomi · Tecno",
    cta: "Explore Deals",
    accent: "#F68B1E",
    pattern: "brand",
  },
  {
    id: 3,
    bg: "#E8F5E9",
    textColor: "#1A1A2E",
    badge: "Supermarket Week",
    headline: "Groceries & More",
    sub: "Free delivery on orders above ₦5,000",
    cta: "Shop Groceries",
    accent: "#F68B1E",
    pattern: "grocery",
  },
  {
    id: 4,
    bg: "#FFF3E0",
    textColor: "#1A1A2E",
    badge: "Beauty Festival",
    headline: "Glow Up Season",
    sub: "Top brands up to 60% off",
    cta: "Shop Beauty",
    accent: "#F68B1E",
    pattern: "beauty",
  },
]

// Simple decorative shapes drawn for each slide theme
function SlideIllustration({ pattern, accent }) {
  if (pattern === "phones") {
    return (
      <div className="flex items-center justify-center gap-3 opacity-30">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border-4 border-white"
            style={{
              width: 48 + i * 8,
              height: 80 + i * 12,
              opacity: 1 - i * 0.2,
            }}
          />
        ))}
      </div>
    )
  }
  if (pattern === "brand") {
    return (
      <div className="flex flex-wrap gap-2 justify-center opacity-20">
        {["SAMSUNG", "INFINIX", "XIAOMI", "TECNO", "ORAIMO", "HIKERS"].map((b) => (
          <span
            key={b}
            className="text-orange-400 font-black text-sm tracking-widest"
          >
            {b}
          </span>
        ))}
      </div>
    )
  }
  if (pattern === "grocery") {
    return (
      <div className="flex gap-3 opacity-25 text-5xl">
        <span></span><span></span><span></span>
      </div>
    )
  }
  return (
    <div className="flex gap-3 opacity-25 text-5xl">
      <span></span><span></span><span></span>
    </div>
  )
}

function HeroBanner({ onShopNow }) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  // Auto-advance every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [current])

  function goTo(index) {
    if (animating) return
    setAnimating(true)
    setTimeout(() => setAnimating(false), 300)
    setCurrent(index)
  }

  const slide = slides[current]

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden mb-4 shadow-sm select-none"
      style={{ minHeight: 220, background: slide.bg, transition: "background 0.5s" }}
    >
      {/* Main slide content */}
      <div
        className="flex items-center justify-between px-5 sm:px-8 py-6 sm:py-8"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 0.3s, transform 0.3s",
          minHeight: 200,
        }}
      >
        {/* Left: text content */}
        <div className="flex flex-col gap-1.5 sm:gap-2 max-w-xs">
          <span
            className="text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2 py-0.5 sm:py-1 rounded-full w-fit"
            style={{
              background: slide.accent,
              color: slide.bg,
            }}
          >
            {slide.badge}
          </span>
          <h2
            className="text-2xl sm:text-4xl font-black leading-tight"
            style={{ color: slide.textColor }}
          >
            {slide.headline}
          </h2>
          <p
            className="text-xs sm:text-sm font-medium opacity-80"
            style={{ color: slide.textColor }}
          >
            {slide.sub}
          </p>
          <button
            onClick={onShopNow}
            className="mt-2 w-fit px-5 py-2 rounded-full text-sm font-bold transition-transform hover:scale-105"
            style={{
              background: slide.accent,
              color: slide.bg,
            }}
          >
            {slide.cta} →
          </button>
        </div>

        {/* Right: decorative illustration */}
        <div className="hidden sm:flex items-center justify-center w-48">
          <SlideIllustration pattern={slide.pattern} accent={slide.accent} />
        </div>
      </div>

      {/* Left arrow */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black bg-opacity-20 text-white flex items-center justify-center hover:bg-opacity-40 transition-all text-sm font-bold"
      >
        ‹
      </button>

      {/* Right arrow */}
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black bg-opacity-20 text-white flex items-center justify-center hover:bg-opacity-40 transition-all text-sm font-bold"
      >
        ›
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all"
            style={{
              width: i === current ? 20 : 8,
              height: 8,
              background: i === current ? slide.accent : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroBanner

