// ============================================================
// HEADER COMPONENT
// ============================================================

import { useState } from "react"

function Header({
  cartCount,
  wishlistCount,
  onCartOpen,
  onWishlistOpen,
  user,
  onSignInClick,
  onSignOut,
  onGoHome,
  onSearch,
  onSelectCategory,
  onTrackOrderClick,
  onMyAccountClick,
  currentPage = "home",
  activeCategory = "",
}) {

  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false)
  const [searchInput, setSearchInput] = useState("")

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchInput.trim())
    }
  }

  const hamburgerCategories = [
    "Official Store", "Phones & Tablets", "Appliances", "Health & Beauty",
    "Electronics", "Fashion", "Home & Office", "Supermarket",
    "Computing", "Baby Products", "Gaming", "Other Categories",
  ]

  const navCategories = [
    "Phones & Tablets", "Electronics", "Supermarket", "Fashion",
    "Computing", "Appliances", "Health & Beauty", "Home & Office",
    "Sporting Goods", "Gaming", "Baby Products",
  ]

  return (
    <header className="w-full sticky top-0 z-50">

      {/* Top utility bar */}
      <div className="bg-gray-50 border-b border-gray-200 hidden md:block">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between py-1.5 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <button
              onClick={onGoHome}
              className="text-jumia-orange font-semibold hover:underline cursor-pointer"
            >
              Welcome to Jumia Nigeria
            </button>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-jumia-orange transition-colors">Sell on Jumia</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:text-jumia-orange transition-colors">Help Center</a>
            <span className="text-gray-300">|</span>
            <button
              onClick={onTrackOrderClick}
              className="hover:text-jumia-orange transition-colors cursor-pointer font-medium"
            >
              Track Order
            </button>
            {user && (
              <>
                <span className="text-gray-300">|</span>
                <button
                  onClick={onMyAccountClick}
                  className="hover:text-jumia-orange transition-colors cursor-pointer font-medium text-gray-700"
                >
                  My Account
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main header bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="max-w-screen-xl mx-auto">

          {/* Desktop & Tablet Row (md and up) / Mobile Top Row */}
          <div className="flex items-center justify-between gap-3 sm:gap-4">

            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Hamburger button with tap toggle & hover */}
              <div
                className="relative"
                onMouseEnter={() => setShowHamburgerMenu(true)}
                onMouseLeave={() => setShowHamburgerMenu(false)}
              >
                <button
                  type="button"
                  onClick={() => setShowHamburgerMenu((prev) => !prev)}
                  className="text-gray-800 text-xl font-bold hover:text-jumia-orange transition-colors p-1 cursor-pointer flex items-center justify-center"
                  aria-label="Categories Menu"
                >
                  ☰
                </button>

                {showHamburgerMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-xl rounded-lg w-56 z-50 py-1 max-h-[80vh] overflow-y-auto">
                    <button
                      onClick={() => {
                        setShowHamburgerMenu(false)
                        onGoHome && onGoHome()
                      }}
                      className="w-full text-left block px-4 py-2.5 text-sm font-bold text-jumia-orange hover:bg-orange-50 transition-colors border-b border-gray-100 cursor-pointer"
                    >
                      Home Page
                    </button>
                    <button
                      onClick={() => {
                        setShowHamburgerMenu(false)
                        onTrackOrderClick && onTrackOrderClick()
                      }}
                      className="w-full text-left block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-orange-50 hover:text-jumia-orange transition-colors border-b border-gray-100 cursor-pointer"
                    >
                      Track My Order
                    </button>
                    {user && (
                      <button
                        onClick={() => {
                          setShowHamburgerMenu(false)
                          onMyAccountClick && onMyAccountClick()
                        }}
                        className="w-full text-left block px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-orange-50 hover:text-jumia-orange transition-colors border-b border-gray-100 cursor-pointer"
                      >
                        My Account
                      </button>
                    )}
                    <div className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50">
                      Categories
                    </div>
                    {hamburgerCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setShowHamburgerMenu(false)
                          onSelectCategory && onSelectCategory(cat)
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-jumia-orange transition-colors border-b border-gray-50 last:border-b-0 cursor-pointer"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Logo — Always navigates back to Home */}
              <button
                onClick={onGoHome}
                className="flex items-center cursor-pointer focus:outline-none"
                title="Go to Home"
              >
                <span className="font-black text-gray-900 text-xl sm:text-2xl tracking-tight">JUMIA</span>
              </button>
            </div>

            {/* Desktop Search bar (centered / flex-1) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 items-center border-2 border-jumia-orange rounded-full overflow-hidden max-w-xl mx-4"
            >
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products, brands and categories (e.g. bags, phones)"
                className="flex-1 px-4 py-2 text-sm text-gray-700 outline-none bg-white"
              />
              <button
                type="submit"
                className="bg-jumia-orange text-white text-sm font-semibold px-5 py-2 hover:bg-orange-500 transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Right side navigation actions (both mobile & desktop) */}
            <div className="flex items-center gap-3 sm:gap-5 ml-auto flex-shrink-0">

              {/* 1. Sign In / Account */}
              {!user ? (
                <button
                  onClick={onSignInClick}
                  className="text-xs sm:text-sm font-bold text-gray-700 hover:text-jumia-orange transition-colors px-1 py-1 cursor-pointer whitespace-nowrap"
                >
                  Sign In
                </button>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                    className="flex items-center gap-1 text-xs sm:text-sm font-bold text-gray-700 hover:text-jumia-orange transition-colors px-1 py-1 cursor-pointer"
                  >
                    <span className="max-w-[70px] sm:max-w-[120px] truncate">Hi, {user.name.split(" ")[0]}</span>
                    <span className="text-xs">▾</span>
                  </button>

                  {showAccountMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl w-48 z-50 py-1">
                      <div className="px-4 py-3 border-b border-gray-100 bg-orange-50 rounded-t-xl">
                        <p className="text-xs font-black text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowAccountMenu(false)
                          onMyAccountClick && onMyAccountClick()
                        }}
                        className="w-full text-left block px-4 py-2.5 text-sm font-bold text-gray-800 hover:bg-orange-50 hover:text-jumia-orange cursor-pointer transition-colors"
                      >
                        My Account
                      </button>
                      <button
                        onClick={() => {
                          setShowAccountMenu(false)
                          onTrackOrderClick && onTrackOrderClick()
                        }}
                        className="w-full text-left block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        My Orders / Track
                      </button>
                      <button
                        onClick={() => {
                          setShowAccountMenu(false)
                          onWishlistOpen && onWishlistOpen()
                        }}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left cursor-pointer"
                      >
                        <span>My Wishlist</span>
                        {wishlistCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {wishlistCount}
                          </span>
                        )}
                      </button>

                      <div className="border-t border-gray-100 mt-1">
                        <button
                          onClick={() => {
                            onSignOut()
                            setShowAccountMenu(false)
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Cart — text-only, with item count badge */}
              <button
                onClick={onCartOpen}
                className="relative text-xs sm:text-sm font-bold text-gray-700 hover:text-jumia-orange transition-colors px-1 py-1 cursor-pointer flex items-center"
              >
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-3 bg-jumia-orange text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* 3. Wishlist — with ♡ icon and count badge */}
              <button
                onClick={onWishlistOpen}
                className="relative flex flex-col items-center text-gray-600 hover:text-red-500 transition-colors cursor-pointer px-1"
                title="Wishlist"
              >
                <span className="text-lg sm:text-xl leading-none">♡</span>
                <span className="text-[10px] sm:text-xs font-medium leading-tight">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 sm:-right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {wishlistCount}
                  </span>
                )}
              </button>

            </div>
          </div>

          {/* Dedicated Full-Width Mobile Search Bar (under 768px) */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex md:hidden items-center border-2 border-jumia-orange rounded-full overflow-hidden w-full mt-2.5"
          >
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products, brands and categories"
              className="flex-1 px-3 py-1.5 text-xs text-gray-800 outline-none bg-white min-w-0"
            />
            <button
              type="submit"
              className="bg-jumia-orange text-white text-xs font-bold px-4 py-2 hover:bg-orange-500 transition-colors cursor-pointer flex-shrink-0"
            >
              Search
            </button>
          </form>

        </div>
      </div>

      {/* Category nav bar with prominent "Home" button */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div
          className="flex items-center overflow-x-auto px-3 sm:px-4 max-w-screen-xl mx-auto scroll-smooth"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {/* Home button */}
          <button
            onClick={onGoHome}
            className={`text-xs font-bold px-3 py-2 sm:py-2.5 whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
              currentPage === "home"
                ? "text-jumia-orange border-b-2 border-jumia-orange"
                : "text-gray-700 hover:text-jumia-orange"
            }`}
          >
            Home
          </button>

          {/* Category buttons */}
          {navCategories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory && onSelectCategory(category)}
              className={`text-xs font-medium px-3 py-2 sm:py-2.5 whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                activeCategory === category
                  ? "text-jumia-orange border-b-2 border-jumia-orange font-bold"
                  : "text-gray-700 hover:text-jumia-orange hover:border-b-2 hover:border-jumia-orange"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Backdrops for closing popups */}
      {showHamburgerMenu && (
        <div className="fixed inset-0 z-40 bg-black/20 md:hidden" onClick={() => setShowHamburgerMenu(false)} />
      )}
      {showAccountMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowAccountMenu(false)} />
      )}

    </header>
  )
}

export default Header
