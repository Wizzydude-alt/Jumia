// ============================================================
// TOPDEALS.JSX — Top Deals section (no external images)
// ============================================================

import { useState } from "react"

const products = [
  { id: "td1", name: "EILIFINTE B01 Ladies Casual Shoulder Bag",       newPrice: 3880,  oldPrice: 18800, discount: 79, rating: 4.3, reviews: 215, emoji: "👜", brand: "EILIFINTE", cardBg: "linear-gradient(135deg,#fdf2f8,#fce7f3)" },
  { id: "td2", name: "Multifunction Anti Theft Laptop Backpack",        newPrice: 16149, oldPrice: 19999, discount: 19, rating: 4.1, reviews: 892, emoji: "🎒", brand: "TechBag",   cardBg: "linear-gradient(135deg,#eff6ff,#dbeafe)" },
  { id: "td3", name: "Men Bags Backpacks School Bag Satchel Grey",      newPrice: 5603,  oldPrice: 10000, discount: 44, rating: 3.9, reviews: 340, emoji: "🎒", brand: "SchoolPro", cardBg: "linear-gradient(135deg,#f1f5f9,#e2e8f0)" },
  { id: "td4", name: "Ladies Elegant Multifunction Handbag",            newPrice: 19500, oldPrice: 25000, discount: 22, rating: 4.5, reviews: 128, emoji: "👛", brand: "Elegant",   cardBg: "linear-gradient(135deg,#fff7ed,#fed7aa)" },
  { id: "td5", name: "Classic Women Tote Shoulder Bag",                 newPrice: 8750,  oldPrice: 15000, discount: 42, rating: 4.0, reviews: 503, emoji: "🛍️", brand: "Classic",   cardBg: "linear-gradient(135deg,#f0fdf4,#dcfce7)" },
  { id: "td6", name: "Men Leather Crossbody Messenger Bag",             newPrice: 11200, oldPrice: 20000, discount: 44, rating: 4.2, reviews: 267, emoji: "💼", brand: "LeatherCo", cardBg: "linear-gradient(135deg,#fefce8,#fef9c3)" },
  { id: "td7", name: "Women Mini Shoulder Purse Clutch Bag",            newPrice: 4200,  oldPrice: 9000,  discount: 53, rating: 3.8, reviews: 189, emoji: "👝", brand: "MiniPurse", cardBg: "linear-gradient(135deg,#fdf4ff,#fae8ff)" },
  { id: "td8", name: "Canvas Travel Duffle Weekender Bag",              newPrice: 13500, oldPrice: 22000, discount: 39, rating: 4.4, reviews: 421, emoji: "🧳", brand: "TravelPro", cardBg: "linear-gradient(135deg,#ecfdf5,#d1fae5)" },
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

function ProductCard({ product, onAddToCart, onWishlist, wishlisted }) {
  const [added, setAdded] = useState(false)

  function handleAdd(e) {
    e.stopPropagation()
    onAddToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="flex-shrink-0 w-36 sm:w-44 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
      {/* Product visual — coloured gradient, no external image */}
      <div
        className="relative w-full h-28 sm:h-36 flex flex-col items-center justify-center gap-1"
        style={{ background: product.cardBg }}
      >
        <p className="text-xs sm:text-sm font-black text-gray-600 tracking-wide uppercase px-2 text-center">
          {product.brand}
        </p>

        <span className="absolute top-2 left-2 bg-jumia-orange text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded">
          -{product.discount}%
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onWishlist(product) }}
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
        >
          <span className={`text-sm ${wishlisted ? "text-red-500" : "text-gray-300"}`}>
            {wishlisted ? "♥" : "♡"}
          </span>
        </button>
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

function TopDeals({ onAddToCart, onWishlist, wishlist, onSeeAll }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-black text-gray-800">Top Deals</h2>
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
        {products.map((p) => (
          <ProductCard
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

export default TopDeals
