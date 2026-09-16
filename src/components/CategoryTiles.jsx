// ============================================================
// CATEGORYTILES.JSX — Category grid, no icons
// ============================================================

function CategoryTiles({ onCategoryClick }) {

  const categories = [
    { label: "Phones & Tablets",  bg: "#FFF3E0", color: "#E65100" },
    { label: "Electronics",       bg: "#E3F2FD", color: "#1565C0" },
    { label: "Appliances",        bg: "#F3E5F5", color: "#7B1FA2" },
    { label: "Health & Beauty",   bg: "#FCE4EC", color: "#C2185B" },
    { label: "Fashion",           bg: "#E8F5E9", color: "#2E7D32" },
    { label: "Computing",         bg: "#E0F7FA", color: "#00838F" },
    { label: "Supermarket",       bg: "#FFF9C4", color: "#F9A825" },
    { label: "Sporting Goods",    bg: "#E8F5E9", color: "#388E3C" },
    { label: "Baby Products",     bg: "#FFF3E0", color: "#E65100" },
    { label: "Gaming",            bg: "#EDE7F6", color: "#512DA8" },
    { label: "Home & Office",     bg: "#EFEBE9", color: "#5D4037" },
    { label: "TV & Audio",        bg: "#E3F2FD", color: "#1976D2" },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-3 sm:mb-4 essentials-section">

      <h2 className="text-sm sm:text-base font-black text-gray-900 mb-3 sm:mb-4 essentials-heading">
        All Your Essentials in One Place
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3 essentials-grid">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => onCategoryClick && onCategoryClick(cat.label)}
            className="flex flex-col items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-xl hover:shadow-md transition-all cursor-pointer essential-tile-btn"
            style={{ backgroundColor: cat.bg }}
          >
            <p
              className="text-xs font-black text-center leading-tight essential-tile-text"
              style={{ color: cat.color }}
            >
              {cat.label}
            </p>
          </button>
        ))}
      </div>

    </div>
  )
}

export default CategoryTiles
