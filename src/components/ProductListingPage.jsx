// ============================================================
// PRODUCTLISTINGPAGE COMPONENT
// ============================================================
// Full category page layout:
//   [FilterSidebar]  |  [Sort bar + Filter buttons + Product grid]
//
// New features added from screenshots:
//   - Coupon badges: "JBF: XTRA 2500 OFF", "XTR15% OFF" (orange pills)
//   - "Jumia Express" green text badge on cards
//   - "Brand Festival" teal label on cards
//   - "Sponsored" label on some cards
//   - More products in the grid
//   - Load More button at the bottom
// ============================================================

import { useState } from "react"
import FilterSidebar from "./FilterSidebar"

function ProductListingPage({ onAddToCart, onGoHome, categoryTitle = "Women Handbags & Wallets", searchQuery = "" }) {

  const [sortBy, setSortBy]               = useState("Popularity")
  const [activeFilter, setActiveFilter]   = useState("")
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // ── All products ──
  // coupon: the orange pill text shown below the price (e.g. "JBF: XTRA 2500 OFF")
  // express: shows green "Jumia Express" badge
  // badge: "Brand Festival" (teal), "EXPRESS" (green)
  // sponsored: shows "Sponsored" text
  const products = [
    { id: 1,  name: "Women's Vintage Monogram Tote Bag Brown Beige Large Capacity",    newPrice: 18000,  oldPrice: 40320,  discount: 55, rating: 4, reviews: 0,    bg: "#f5e6d3", badge: "",               coupon: "",                 express: false, sponsored: false },
    { id: 2,  name: "Women's Color-Block Tote Bag with Adjustable Strap",              newPrice: 23665,  oldPrice: 0,      discount: 0,  rating: 4, reviews: 2,    bg: "#dce8f5", badge: "Brand Festival",  coupon: "",                 express: true,  sponsored: true  },
    { id: 3,  name: "Women Large Capacity Tote Bag Waterproof PU Leather",             newPrice: 9336,   oldPrice: 20169,  discount: 51, rating: 4, reviews: 11,   bg: "#e8d5c3", badge: "Brand Festival",  coupon: "XTR15% OFF",       express: true,  sponsored: false },
    { id: 4,  name: "Women Crossbody Tote Bag Large Capacity PU Leather Handbag",      newPrice: 10944,  oldPrice: 22444,  discount: 51, rating: 4, reviews: 5,    bg: "#d5c3e8", badge: "Brand Festival",  coupon: "",                 express: true,  sponsored: false },
    { id: 5,  name: "NAOT NAOT Plush Love Handbag Shoulder Bag Crossbody Bag",         newPrice: 2880,   oldPrice: 9173,   discount: 69, rating: 3, reviews: 258,  bg: "#e8e0f0", badge: "Brand Festival",  coupon: "JBF: XTRA 2500 OFF", express: true, sponsored: false },
    { id: 6,  name: "2 In 1 Women's Tote Bag Set Grey Large Capacity Handbag",         newPrice: 10480,  oldPrice: 33320,  discount: 51, rating: 4, reviews: 141,  bg: "#f5f0e8", badge: "",               coupon: "",                 express: false, sponsored: true  },
    { id: 7,  name: "ASHION Chic PU Leather Tote Bag For Women Lightweight Durable",   newPrice: 9300,   oldPrice: 10206,  discount: 52, rating: 4, reviews: 192,  bg: "#d4c5a0", badge: "Brand Festival",  coupon: "XTR15% OFF",       express: true,  sponsored: false },
    { id: 8,  name: "MIDIA Ladies Small Square Package Women's Bag Handbag",            newPrice: 10100,  oldPrice: 17280,  discount: 42, rating: 4, reviews: 110,  bg: "#c8d8e8", badge: "",               coupon: "JBF: XTRA 2500 OFF", express: true, sponsored: false },
    { id: 9,  name: "STY Women Handbags Shoulder Bags Tote Bags Ladies 4 in 1",        newPrice: 9191,   oldPrice: 13330,  discount: 31, rating: 4, reviews: 421,  bg: "#2c2c3c", badge: "Brand Festival",  coupon: "JBF: XTRA 2500 OFF", express: true, sponsored: false },
    { id: 10, name: "Women Bags Ladies Bags Handbags Purse Shoulder Bag",               newPrice: 6480,   oldPrice: 6631,   discount: 2,  rating: 4, reviews: 38,   bg: "#d4b896", badge: "",               coupon: "JBF: XTRA 2500 OFF", express: true, sponsored: true  },
    { id: 11, name: "Unisex Fashion Canvas Shoulder Chest Bag With USB Charging Port",  newPrice: 2890,   oldPrice: 6233,   discount: 54, rating: 3, reviews: 223,  bg: "#b8c8d4", badge: "Brand Festival",  coupon: "JBF: XTRA 2500 OFF", express: true, sponsored: false },
    { id: 12, name: "Matesmode 2 PCS Women Bags Ladies Bag Handbags Purse",             newPrice: 3485,   oldPrice: 8000,   discount: 61, rating: 4, reviews: 232,  bg: "#1a1a2e", badge: "Brand Festival",  coupon: "JBF: XTRA 2500 OFF", express: true, sponsored: false },
    { id: 13, name: "STY Women's Black PU Handbag & Coin Bag Set Medium Bag",           newPrice: 8360,   oldPrice: 12980,  discount: 36, rating: 4, reviews: 106,  bg: "#1a1a1a", badge: "Brand Festival",  coupon: "JBF: XTRA 2500 OFF", express: true, sponsored: false },
    { id: 14, name: "MIDIA Lady Handbag Duchess Bag Woman Crossbody Bag Black",         newPrice: 13680,  oldPrice: 25908,  discount: 47, rating: 3, reviews: 5,    bg: "#2c2c2c", badge: "Brand Festival",  coupon: "",                 express: true,  sponsored: true  },
    { id: 15, name: "Simple Oxford Fabric Tote Waterproof Large Capacity",              newPrice: 6545,   oldPrice: 10000,  discount: 35, rating: 4, reviews: 73,   bg: "#3c3c3c", badge: "Brand Festival",  coupon: "JBF: XTRA 2500 OFF", express: true, sponsored: false },
    { id: 16, name: "STY Ladies Shoulder Bag Women Handbags Tote Bag Contrast Color",   newPrice: 7268,   oldPrice: 14700,  discount: 51, rating: 4, reviews: 92,   bg: "#d4d8e0", badge: "Brand Festival",  coupon: "JBF: XTRA 2500 OFF", express: true, sponsored: false },
    { id: 17, name: "NAOT NAOT Plush Love Handbag Shoulder Bag Crossbody Bag White",    newPrice: 2700,   oldPrice: 9473,   discount: 71, rating: 4, reviews: 77,   bg: "#f5f5f0", badge: "Brand Festival",  coupon: "JBF: XTRA 2500 OFF", express: true, sponsored: false },
    { id: 18, name: "MIDIA Lady Handbag Duchess Bag Woman Crossbody Bag White",         newPrice: 13680,  oldPrice: 25908,  discount: 47, rating: 4, reviews: 5,    bg: "#e8e8e0", badge: "",               coupon: "",                 express: true,  sponsored: true  },
    { id: 19, name: "4 In 1 Ladies Backpack Women Bag Handbag Purse School Bag",        newPrice: 6753,   oldPrice: 20085,  discount: 68, rating: 3, reviews: 316,  bg: "#d0c8c0", badge: "Brand Festival",  coupon: "JBF: XTRA 2500 OFF", express: true, sponsored: false },
    { id: 20, name: "Women Bags Ladies Bags Handbags Purse Tote Bags",                  newPrice: 2562,   oldPrice: 5000,   discount: 49, rating: 4, reviews: 30,   bg: "#c8d0c8", badge: "Brand Festival",  coupon: "JBF: XTRA 2500 OFF", express: true, sponsored: false },
    { id: 21, name: "Embroidered Shoulder Chain Handbag Silk Scarf Lingge Tote",        newPrice: 5377,   oldPrice: 6163,   discount: 13, rating: 4, reviews: 151,  bg: "#e0d0c8", badge: "Brand Festival",  coupon: "XTR15% OFF",       express: true,  sponsored: false },
    { id: 22, name: "Black Woven Shoulder Bag with Gold Chain Crossbody Handbag",       newPrice: 11275,  oldPrice: 0,      discount: 0,  rating: 5, reviews: 2,    bg: "#1c1c1c", badge: "",               coupon: "",                 express: true,  sponsored: true  },
    { id: 23, name: "STY Ladies Black Handbag Coin Bag Set Swan Metal Decoration",      newPrice: 6290,   oldPrice: 12060,  discount: 52, rating: 5, reviews: 58,   bg: "#2a2a2a", badge: "Brand Festival",  coupon: "XTR15% OFF",       express: true,  sponsored: false },
    { id: 24, name: "Multi Functional Casual Plaid Backpack Student Backpack",          newPrice: 1855,   oldPrice: 11520,  discount: 84, rating: 4, reviews: 11,   bg: "#c8c0d8", badge: "Brand Festival",  coupon: "JBF: XTRA 2500 OFF", express: true, sponsored: false },
    { id: 25, name: "HUAHUA New Trendy Pearl Chain Mini Crossbody Jelly Bag",           newPrice: 2880,   oldPrice: 5760,   discount: 50, rating: 3, reviews: 2,    bg: "#f0e8f5", badge: "Brand Festival",  coupon: "JBF: XTRA 2500 OFF", express: true, sponsored: false },
    { id: 26, name: "Men Fashion Cross Bag Crossing Bag Waterproof Cross Side Bag",     newPrice: 9562,   oldPrice: 12948,  discount: 26, rating: 4, reviews: 1,    bg: "#2c3040", badge: "Brand Festival",  coupon: "XTR15% OFF",       express: true,  sponsored: true  },
    { id: 27, name: "Matesmode Women Bag Crossbody Bag Handbag Underarm Bag",           newPrice: 7664,   oldPrice: 24823,  discount: 69, rating: 4, reviews: 231,  bg: "#1a1e2e", badge: "Brand Festival",  coupon: "JBF: XTRA 2500 OFF", express: true, sponsored: false },
    { id: 28, name: "HUAHUA New Fashionable Cloud-Shaped Messenger Bag Crossbody",      newPrice: 1440,   oldPrice: 11400,  discount: 50, rating: 4, reviews: 4,    bg: "#1a1a1a", badge: "Brand Festival",  coupon: "JBF: XTRA 2500 OFF", express: true, sponsored: false },
  ]

  // How many products to show at once — starts at 16
  // "Load More" adds 8 more each time
  const [visibleCount, setVisibleCount] = useState(16)

  function formatPrice(n) {
    return n.toLocaleString()
  }

  // Build star string: rating 4 → "★★★★☆"
  function renderStars(rating) {
    return "★".repeat(rating) + "☆".repeat(5 - rating)
  }

  const relatedLinks = [
    "Women messenger handbag",
    "Nigeria earrings",
    "Women handbag fashion shoulder",
    "Office handbags for women",
  ]

  // Filter by search query if any
  const matchedProducts = searchQuery
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.badge && p.badge.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : products

  const displayList = matchedProducts.length > 0 ? matchedProducts : products

  // Only show products up to visibleCount
  const visibleProducts = displayList.slice(0, visibleCount)

  return (
    <div>
      {/* ── Breadcrumb Bar: Always gives clear path to Home ── */}
      <div className="bg-white rounded-lg shadow-sm px-4 py-3 mb-3 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 text-gray-500">
          <button
            onClick={onGoHome}
            className="text-jumia-orange font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            ← Back to Home
          </button>
          <span className="text-gray-300">/</span>
          <button
            onClick={onGoHome}
            className="text-gray-600 hover:text-jumia-orange cursor-pointer"
          >
            Home
          </button>
          <span className="text-gray-300">›</span>
          <span className="text-gray-900 font-bold truncate max-w-[200px] sm:max-w-md">
            {categoryTitle}
          </span>
        </div>
        <button
          onClick={onGoHome}
          className="bg-gray-100 hover:bg-orange-50 text-gray-700 hover:text-jumia-orange font-semibold px-3 py-1.5 rounded transition-colors cursor-pointer"
        >
          Return to Home Page
        </button>
      </div>

      {/* ── Mobile Filter Modal/Drawer ── */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col">
            <FilterSidebar onClose={() => setShowMobileFilters(false)} isMobile={true} />
          </div>
        </div>
      )}

      <div className="flex gap-4 items-start">

        {/* ── LEFT: Filter Sidebar (Desktop only) ── */}
        <div className="hidden lg:block">
          <FilterSidebar />
        </div>

        {/* ── RIGHT: Products area ── */}
        <div className="flex-1 min-w-0">

          {/* Top bar */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-3">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-sm sm:text-base font-bold text-gray-900">
                  {categoryTitle}
                  <span className="text-gray-400 font-normal text-xs sm:text-sm ml-2">
                    ({matchedProducts.length} {matchedProducts.length === 1 ? "product" : "products"} found)
                  </span>
                </h1>

                {searchQuery && matchedProducts.length === 0 && (
                  <p className="text-xs text-orange-600 mt-1 font-medium">
                    No exact matches for "{searchQuery}". Showing popular items below:
                  </p>
                )}

                {/* Related orange links */}
                <div className="flex flex-wrap gap-1 mt-1.5 sm:mt-2">
                  <span className="text-xs text-gray-500">Related results:</span>
                  {relatedLinks.map((link, i) => (
                    <span key={link}>
                      <a href="#" className="text-xs text-orange-500 hover:underline">{link}</a>
                      {i < relatedLinks.length - 1 && <span className="text-gray-300 mx-1">|</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Controls: Filter Button on Mobile + Sort dropdown */}
              <div className="flex items-center gap-2 mt-1 sm:mt-0">
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden text-xs font-bold px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-700 hover:border-jumia-orange hover:text-jumia-orange transition-colors cursor-pointer"
                >
                  Filters
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs sm:text-sm border border-gray-300 rounded px-2.5 sm:px-3 py-1.5 outline-none focus:border-orange-400 text-gray-700 bg-white"
                >
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                  <option>Best Rating</option>
                </select>
              </div>
            </div>

            {/* Quick filter pills */}
            <div className="flex gap-2 mt-3 flex-wrap">
              <button
                onClick={() => setActiveFilter(activeFilter === "EXPRESS" ? "" : "EXPRESS")}
                className={`text-xs font-semibold px-2.5 sm:px-3 py-1 rounded border transition-colors ${
                  activeFilter === "EXPRESS"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-600 border-gray-300 hover:border-orange-400"
                }`}
              >
                EXPRESS
              </button>
              {["Brand", "Price", "Size"].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(activeFilter === f ? "" : f)}
                  className={`text-xs px-2.5 sm:px-3 py-1 rounded border transition-colors flex items-center gap-1 ${
                    activeFilter === f
                      ? "bg-orange-50 text-orange-500 border-orange-400"
                      : "bg-white text-gray-600 border-gray-300 hover:border-orange-400"
                  }`}
                >
                  {f} <span className="text-gray-400">▾</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Product Grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                formatPrice={formatPrice}
                renderStars={renderStars}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          {/* ── Load More button ── */}
          {visibleCount < products.length && (
            <div className="text-center mt-6 mb-4">
              <button
                onClick={() => setVisibleCount(visibleCount + 8)}
                className="bg-white border border-orange-500 text-orange-500 text-sm font-semibold px-8 py-2 rounded-full hover:bg-orange-50 transition-colors"
              >
                Load More Products
              </button>
            </div>
          )}

        </div>
      </div>
  </div>
  )
}

// ── Product Card ──
function ProductCard({ product, formatPrice, renderStars, onAddToCart }) {
  const [added, setAdded] = useState(false)

  function handleAdd() {
    onAddToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">

      {/* Image area */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{ height: "160px", backgroundColor: product.bg }}
      >
        {/* Product name as placeholder text */}
        <span className="text-center px-2 text-xs leading-tight" style={{ color: "#aaa" }}>
          {product.name.split(" ").slice(0, 3).join(" ")}
        </span>

        {/* Discount badge */}
        {product.discount > 0 && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
            -{product.discount}%
          </span>
        )}

        {/* Brand Festival badge (teal) */}
        {product.badge === "Brand Festival" && (
          <span
            className="absolute top-2 left-0 text-white text-xs font-bold px-2 py-0.5"
            style={{ backgroundColor: "#1a9b8a" }}
          >
            Brand Festival
          </span>
        )}
      </div>

      {/* Card info */}
      <div className="p-2">
        <p className="text-xs text-gray-700 line-clamp-2 leading-tight mb-1">
          {product.name}
        </p>

        {/* Prices */}
        <p className="text-sm font-bold text-gray-900">₦ {formatPrice(product.newPrice)}</p>
        {product.oldPrice > 0 && (
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-400 line-through">₦ {formatPrice(product.oldPrice)}</p>
            {product.discount > 0 && (
              <span className="text-xs text-orange-500 font-semibold">-{product.discount}%</span>
            )}
          </div>
        )}

        {/* Coupon badge */}
        {/*
          This is the orange pill that says "JBF: XTRA 2500 OFF" or "XTR15% OFF"
          It's a promotional coupon that the real Jumia shows on eligible products
        */}
        {product.coupon && (
          <div
            className="text-white text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block"
            style={{ backgroundColor: "#F68B1E", fontSize: "10px" }}
          >
            {product.coupon}
          </div>
        )}

        {/* Star rating */}
        <p className="text-xs text-orange-400 mt-1">
          {renderStars(product.rating)}
          {product.reviews > 0 && (
            <span className="text-gray-400 ml-1">({product.reviews})</span>
          )}
        </p>

        {/* Jumia Express badge */}
        {product.express && (
          <p className="text-xs font-bold mt-0.5" style={{ color: "#00a650" }}>
            Jumia Express
          </p>
        )}

        {/* Sponsored label */}
        {product.sponsored && (
          <p className="text-xs text-gray-400 mt-0.5">Sponsored</p>
        )}

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          className="w-full mt-2 bg-orange-500 text-white text-xs font-semibold py-1.5 rounded hover:bg-orange-600 transition-colors"
        >
          {added ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}

export default ProductListingPage
