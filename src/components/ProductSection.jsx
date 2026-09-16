// ============================================================
// PRODUCTSECTION.JSX — Reusable horizontal product section
// (No external images — clean styled cards)
// ============================================================

import { useState } from "react"

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
      {reviews != null && (
        <span className="text-xs text-gray-400">({reviews.toLocaleString()})</span>
      )}
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

      {/* Product visual — clean gradient background, no icons/images */}
      <div
        className="relative w-full h-28 sm:h-36 flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: product.cardBg || "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
        }}
      >
        {/* Brand name centered on the card */}
        <p className="text-xs sm:text-sm font-black text-gray-600 tracking-wide uppercase px-2 text-center">
          {product.brand || product.name.split(" ")[0]}
        </p>

        {/* Discount badge */}
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-jumia-orange text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded">
            -{product.discount}%
          </span>
        )}

        {/* Wishlist button */}
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
        <p className="text-xs text-gray-700 line-clamp-2 mb-1 leading-tight">
          {product.name}
        </p>
        {product.rating != null && (
          <StarRating rating={product.rating} reviews={product.reviews} />
        )}
        <p className="text-xs sm:text-sm font-bold text-gray-900 mt-1">
          ₦ {product.newPrice.toLocaleString()}
        </p>
        {product.oldPrice > product.newPrice && (
          <p className="text-[11px] sm:text-xs text-gray-400 line-through">
            ₦ {product.oldPrice.toLocaleString()}
          </p>
        )}
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

function ProductSection({ title, products, badge, onAddToCart, onWishlist, wishlist, onSeeAll }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-base sm:text-lg font-black text-gray-900">{title}</h2>
          {badge && (
            <p className="text-[11px] sm:text-xs text-jumia-orange font-semibold mt-0.5">{badge}</p>
          )}
        </div>
        <button
          onClick={onSeeAll}
          className="text-jumia-orange text-xs sm:text-sm font-semibold hover:underline"
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

export default ProductSection
