// ============================================================
// FLASHSALES.JSX — Flash Sales section with live countdown
// (No external images — clean styled cards)
// ============================================================

import { useState, useEffect } from "react"

const flashProducts = [
  { id: "fs1", name: "Oraimo SpaceBuds Lite True Wireless Earbuds",        newPrice: 14602, oldPrice: 25920, discount: 44, rating: 4.1, reviews: 1108,   emoji: "🎧", brand: "Oraimo",  cardBg: "linear-gradient(135deg,#e0f2fe,#bae6fd)", stock: 20 },
  { id: "fs2", name: "EASYPIE 20000mAh Ultra Slim Power Bank Fast Charging", newPrice: 7800,  oldPrice: 14400, discount: 46, rating: 3.5, reviews: 38709,  emoji: "🔋", brand: "EasyPie", cardBg: "linear-gradient(135deg,#dcfce7,#bbf7d0)", stock: 20 },
  { id: "fs3", name: "Kiyome Kinoki Cleansing Detox Foot Pads - 10 Pieces",  newPrice: 2100,  oldPrice: 9500,  discount: 78, rating: 4.2, reviews: 44,     emoji: "🌿", brand: "Kiyome",  cardBg: "linear-gradient(135deg,#f0fdf4,#dcfce7)", stock: 9  },
  { id: "fs4", name: "Anti Snoring Device - Chin Strap",                     newPrice: 2950,  oldPrice: 9000,  discount: 67, rating: 3.5, reviews: 92,     emoji: "😴", brand: "Generic", cardBg: "linear-gradient(135deg,#fef3c7,#fde68a)", stock: 17 },
  { id: "fs5", name: "NIVEA MEN Deep Anti-Perspirant Roll-on 50ml (Pack 3)", newPrice: 4555,  oldPrice: 6125,  discount: 26, rating: 4.1, reviews: 8203,   emoji: "🧴", brand: "NIVEA",   cardBg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", stock: 20 },
  { id: "fs6", name: "Afro Metal Fist Pick Comb",                            newPrice: 1450,  oldPrice: 6500,  discount: 78, rating: 4.2, reviews: 19,     emoji: "✂️", brand: "Generic", cardBg: "linear-gradient(135deg,#fce7f3,#fbcfe8)", stock: 19 },
  { id: "fs7", name: "MATIHO Hair Clippers Multifunctional Haircut Machine", newPrice: 2808,  oldPrice: 4910,  discount: 43, rating: 3.5, reviews: 8638,   emoji: "💈", brand: "MATIHO",  cardBg: "linear-gradient(135deg,#fff7ed,#fed7aa)", stock: 15 },
  { id: "fs8", name: "Ace Elec 20000mAh Ultra Slim Portable Power Bank",     newPrice: 7650,  oldPrice: 12000, discount: 36, rating: 3.7, reviews: 161362, emoji: "⚡", brand: "Ace Elec",cardBg: "linear-gradient(135deg,#fefce8,#fef08a)", stock: 20 },
]

function StarRating({ rating, reviews }) {
  const full  = Math.floor(rating)
  const half  = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <div className="flex items-center gap-1 mt-0.5">
      <div className="flex text-orange-400 text-xs">
        {"★".repeat(full)}
        {half ? "½" : ""}
        <span className="text-gray-300">{"★".repeat(empty)}</span>
      </div>
      <span className="text-xs text-gray-400">({reviews.toLocaleString()})</span>
    </div>
  )
}

function FlashCard({ product, onAddToCart, onWishlist, wishlisted }) {
  const [added, setAdded] = useState(false)

  function handleAdd() {
    onAddToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="flex-shrink-0 w-36 sm:w-44 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">

      {/* Product visual */}
      <div
        className="relative w-full h-28 sm:h-36 flex flex-col items-center justify-center gap-1"
        style={{ background: product.cardBg }}
      >
        <p className="text-xs sm:text-sm font-black text-gray-600 tracking-wide uppercase px-2 text-center">
          {product.brand}
        </p>

        {/* Discount badge */}
        <span className="absolute top-2 left-2 bg-jumia-orange text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded">
          -{product.discount}%
        </span>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); onWishlist(product) }}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
        >
          <span className={`text-sm ${wishlisted ? "text-red-500" : "text-gray-300"}`}>
            {wishlisted ? "♥" : "♡"}
          </span>
        </button>

        {/* Stock bar */}
        {product.stock <= 10 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div className="h-full bg-jumia-orange" style={{ width: `${(product.stock / 20) * 100}%` }} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="text-xs text-gray-700 line-clamp-2 mb-1 leading-tight">{product.name}</p>
        <StarRating rating={product.rating} reviews={product.reviews} />
        <p className="text-xs sm:text-sm font-bold text-gray-900 mt-1">₦ {product.newPrice.toLocaleString()}</p>
        <p className="text-[11px] sm:text-xs text-gray-400 line-through">₦ {product.oldPrice.toLocaleString()}</p>
        <button
          onClick={handleAdd}
          className={`w-full mt-2 text-white text-xs font-semibold py-1.5 rounded transition-colors ${
            added ? "bg-green-500" : "bg-jumia-orange hover:bg-orange-500"
          }`}
        >
          {added ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}

function useCountdown() {
  const [endTime] = useState(() => Date.now() + 8 * 60 * 60 * 1000)
  const [timeLeft, setTimeLeft] = useState(0)
  useEffect(() => {
    function tick() { setTimeLeft(Math.max(0, endTime - Date.now())) }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endTime])
  return {
    hours:   Math.floor(timeLeft / 3_600_000),
    minutes: Math.floor((timeLeft % 3_600_000) / 60_000),
    seconds: Math.floor((timeLeft % 60_000) / 1000),
  }
}

function TimeBlock({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="bg-gray-900 text-white text-xs sm:text-sm font-black px-1.5 sm:px-2 py-0.5 sm:py-1 rounded min-w-[28px] sm:min-w-[32px] text-center tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-gray-400 mt-0.5">{label}</span>
    </div>
  )
}

function FlashSales({ onAddToCart, onWishlist, wishlist, onSeeAll }) {
  const { hours, minutes, seconds } = useCountdown()
  return (
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base sm:text-lg font-black text-gray-900">Flash Sales</h2>
          </div>
          <div className="flex items-center gap-1">
            <TimeBlock value={hours}   label="HRS" />
            <span className="text-gray-400 font-bold text-xs sm:text-sm mb-2">:</span>
            <TimeBlock value={minutes} label="MIN" />
            <span className="text-gray-400 font-bold text-xs sm:text-sm mb-2">:</span>
            <TimeBlock value={seconds} label="SEC" />
          </div>
        </div>
        <button
          onClick={onSeeAll}
          className="text-jumia-orange text-xs sm:text-sm font-semibold hover:underline cursor-pointer"
        >
          See All ›
        </button>
      </div>
      <div
        className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {flashProducts.map((p) => (
          <FlashCard
            key={p.id}
            product={p}
            onAddToCart={onAddToCart}
            onWishlist={onWishlist}
            wishlisted={wishlist.some((w) => w.id === p.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default FlashSales
