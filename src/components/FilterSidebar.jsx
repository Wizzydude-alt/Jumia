// ============================================================
// FILTERSIDEBAR COMPONENT
// ============================================================
// Left sidebar with ALL filter options from the real Jumia page:
//   1. Category tree
//   2. Brand (search + checkboxes)
//   3. Color
//   4. Gender
//   5. Price range
//   6. Discount Percentage
//   7. Product Rating    ← NEW
//   8. Seller Score      ← NEW
//   9. Express Delivery  ← NEW
//  10. Size              ← NEW
//  11. Official Stores   ← NEW
// ============================================================

import { useState } from "react"

function FilterSidebar({ onClose, isMobile = false }) {

  // ── Each filter section's state ──
  const [brandSearch,      setBrandSearch]      = useState("")
  const [selectedBrands,   setSelectedBrands]   = useState([])
  const [selectedColors,   setSelectedColors]   = useState([])
  const [selectedGenders,  setSelectedGenders]  = useState([])
  const [minPrice,         setMinPrice]         = useState("1192")
  const [maxPrice,         setMaxPrice]         = useState("529701")
  const [discount,         setDiscount]         = useState("")
  const [productRating,    setProductRating]    = useState("")   // NEW
  const [sellerScore,      setSellerScore]      = useState("")   // NEW
  const [expressOnly,      setExpressOnly]      = useState(false) // NEW
  const [officialOnly,     setOfficialOnly]     = useState(false) // NEW

  // Data lists
  const brands  = ["AAFashions", "African", "African Essence", "Alligator", "ASHION", "BiChu", "NAOT NAOT", "MIDIA", "STY", "HUAHUA"]
  const colors  = ["Beige", "Black", "Blue", "Brown", "Cyan", "Green", "Red", "White"]
  const genders = ["Female", "Girls", "Male", "Teen", "Unisex"]

  // Toggle checkbox helper — adds or removes an item from a list
  function toggle(list, setList, item) {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item))
    } else {
      setList([...list, item])
    }
  }

  // Reusable section wrapper with a title
  function Section({ title, children }) {
    return (
      <div className="mb-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          {title}
        </p>
        {children}
        <hr className="border-gray-100 mt-4" />
      </div>
    )
  }

  return (
    <div
      className={`bg-white text-sm ${
        isMobile
          ? "p-4 h-full overflow-y-auto w-full"
          : "rounded-lg shadow-sm p-4 w-56 flex-shrink-0"
      }`}
    >
      {/* Mobile Header with Close Button */}
      {isMobile && (
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
          <span className="font-bold text-gray-900 text-base">Filters</span>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-lg font-bold p-1 cursor-pointer"
            aria-label="Close Filters"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── 1. CATEGORY ── */}
      <Section title="Category">
        <a href="#" className="block text-gray-700 hover:text-orange-500 py-0.5 text-xs">Women's Fashion</a>
        <a href="#" className="block text-orange-500 font-semibold py-0.5 pl-2 text-xs">Handbags & Wallets</a>
        {[
          "Clutches", "Cross-Body Bags", "Evening Bags", "Shoulder Bags",
          "Top-Handle Bags", "Wristlets", "Backpack Bags", "Handbags",
          "Purses", "Waist Bags", "Beach Bags"
        ].map((cat) => (
          <a key={cat} href="#" className="block text-gray-600 hover:text-orange-500 py-0.5 pl-4 text-xs">
            {cat}
          </a>
        ))}
      </Section>

      {/* ── 2. BRAND ── */}
      <Section title="Brand">
        <input
          type="text"
          placeholder="Search"
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-orange-400 mb-2"
        />
        {brands
          .filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase()))
          .map((brand) => (
            <label key={brand} className="flex items-center gap-2 py-0.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggle(selectedBrands, setSelectedBrands, brand)}
                className="accent-orange-500"
              />
              <span className="text-xs text-gray-700 hover:text-orange-500">{brand}</span>
            </label>
          ))}
      </Section>

      {/* ── 3. COLOR ── */}
      <Section title="Color">
        {colors.map((color) => (
          <label key={color} className="flex items-center gap-2 py-0.5 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedColors.includes(color)}
              onChange={() => toggle(selectedColors, setSelectedColors, color)}
              className="accent-orange-500"
            />
            <span className="text-xs text-gray-700 hover:text-orange-500">{color}</span>
          </label>
        ))}
      </Section>

      {/* ── 4. GENDER ── */}
      <Section title="Gender">
        {genders.map((g) => (
          <label key={g} className="flex items-center gap-2 py-0.5 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedGenders.includes(g)}
              onChange={() => toggle(selectedGenders, setSelectedGenders, g)}
              className="accent-orange-500"
            />
            <span className="text-xs text-gray-700 hover:text-orange-500">{g}</span>
          </label>
        ))}
      </Section>

      {/* ── 5. PRICE RANGE ── */}
      <Section title="Price (₦)">
        <div className="flex items-center gap-1 mb-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-gray-300 rounded px-1.5 py-1 text-xs outline-none focus:border-orange-400 text-center"
          />
          <span className="text-gray-400 text-xs">-</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-gray-300 rounded px-1.5 py-1 text-xs outline-none focus:border-orange-400 text-center"
          />
        </div>
        <button className="w-full bg-orange-500 text-white text-xs font-semibold py-1 rounded hover:bg-orange-600 transition-colors">
          Apply
        </button>
      </Section>

      {/* ── 6. DISCOUNT PERCENTAGE ── */}
      <Section title="Discount Percentage">
        {["50% or more", "40% or more", "30% or more", "20% or more"].map((d) => (
          <label key={d} className="flex items-center gap-2 py-0.5 cursor-pointer">
            <input
              type="radio"
              name="discount"
              value={d}
              checked={discount === d}
              onChange={() => setDiscount(d)}
              className="accent-orange-500"
            />
            <span className="text-xs text-gray-700 hover:text-orange-500">{d}</span>
          </label>
        ))}
      </Section>

      {/* ── 7. PRODUCT RATING ── */}
      <Section title="Product Rating">
        {[
          { stars: "★★★★☆", label: "4 stars and above" },
          { stars: "★★★☆☆", label: "3 stars and above" },
          { stars: "★★☆☆☆", label: "2 stars and above" },
        ].map((r) => (
          <label key={r.label} className="flex items-center gap-2 py-0.5 cursor-pointer">
            <input
              type="radio"
              name="rating"
              value={r.label}
              checked={productRating === r.label}
              onChange={() => setProductRating(r.label)}
              className="accent-orange-500"
            />
            <span className="text-orange-400 text-xs">{r.stars}</span>
            <span className="text-xs text-gray-600 hover:text-orange-500">& above</span>
          </label>
        ))}
      </Section>

      {/* ── 8. SELLER SCORE ── */}
      <Section title="Seller Score">
        {["80% and above", "60% and above", "40% and above"].map((score) => (
          <label key={score} className="flex items-center gap-2 py-0.5 cursor-pointer">
            <input
              type="radio"
              name="sellerScore"
              value={score}
              checked={sellerScore === score}
              onChange={() => setSellerScore(score)}
              className="accent-orange-500"
            />
            <span className="text-xs text-gray-700 hover:text-orange-500">{score}</span>
          </label>
        ))}
      </Section>

      {/* ── 9. EXPRESS DELIVERY ── */}
      <Section title="Express Delivery">
        <label className="flex items-center gap-2 py-0.5 cursor-pointer">
          <input
            type="checkbox"
            checked={expressOnly}
            onChange={() => setExpressOnly(!expressOnly)}
            className="accent-orange-500"
          />
          <span className="text-xs font-bold" style={{ color: "#00a650" }}>
            Jumia Express
          </span>
        </label>
      </Section>

      {/* ── 10. SIZE ── */}
      <Section title="Size">
        <label className="flex items-center gap-2 py-0.5 cursor-pointer">
          <input type="checkbox" className="accent-orange-500" />
          <span className="text-xs text-gray-700">+1.00</span>
        </label>
      </Section>

      {/* ── 11. OFFICIAL STORES ── */}
      <div className="mb-2">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Official Stores</p>
        <label className="flex items-center gap-2 py-0.5 cursor-pointer">
          <input
            type="checkbox"
            checked={officialOnly}
            onChange={() => setOfficialOnly(!officialOnly)}
            className="accent-orange-500"
          />
          <span className="text-xs text-gray-700 hover:text-orange-500">Only Official Store</span>
        </label>
      </div>

      {/* Mobile Apply Button */}
      {isMobile && (
        <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-100 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-jumia-orange hover:bg-orange-500 text-white font-bold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      )}

    </div>
  )
}

export default FilterSidebar
