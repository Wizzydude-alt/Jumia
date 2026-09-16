// ============================================================
// APP.JSX — Main app layout & state management
// ============================================================

import { useState, useCallback, useEffect } from "react"
import { supabase } from "./supabaseClient"

import Header          from "./components/Header"
import SignIn          from "./components/SignIn"
import HeroBanner      from "./components/HeroBanner"
import FlashSales      from "./components/FlashSales"
import TopDeals        from "./components/TopDeals"
import CategoryTiles   from "./components/CategoryTiles"
import ProductSection  from "./components/ProductSection"
import ProductListingPage from "./components/ProductListingPage"
import CartDrawer      from "./components/CartDrawer"
import WishlistDrawer  from "./components/WishlistDrawer"
import CheckoutPage    from "./components/CheckoutPage"
import TrackOrder      from "./components/TrackOrder"
import AccountPage     from "./components/AccountPage"
import Toast           from "./components/Toast"
import Footer          from "./components/Footer"

// ── Product data ─────────────────────────────────────────────

const phonesProducts = [
  { id: "ph1",  name: "Xiaomi Redmi A7 Pro 6.9\" 4GB RAM 128GB ROM - Black",         newPrice: 164599, oldPrice: 185000, discount: 11, rating: 4.2, reviews: 45,  brand: "Xiaomi",   cardBg: "linear-gradient(135deg,#f0f9ff,#e0f2fe)" },
  { id: "ph2",  name: "Samsung Galaxy A26 5G 6.7\" 6GB RAM 128GB ROM - Black",        newPrice: 369716, oldPrice: 500000, discount: 26, rating: 4.6, reviews: 18,  brand: "Samsung",  cardBg: "linear-gradient(135deg,#eff6ff,#dbeafe)" },
  { id: "ph3",  name: "Infinix Note Edge 6.78\" 120Hz AMOLED 6500mAh - Shadow Black", newPrice: 498288, oldPrice: 650000, discount: 23, rating: 4.3, reviews: 210, brand: "Infinix",  cardBg: "linear-gradient(135deg,#fdf2f8,#fce7f3)" },
  { id: "ph4",  name: "Tecno Spark 30C 6.6\" 8GB RAM 128GB ROM - Gravity Black",      newPrice: 138000, oldPrice: 165000, discount: 16, rating: 4.0, reviews: 331, brand: "Tecno",    cardBg: "linear-gradient(135deg,#f0fdf4,#dcfce7)" },
  { id: "ph5",  name: "itel Power 80 7000mAh IP68 128GB+4GB Military Grade",          newPrice: 199000, oldPrice: 300000, discount: 34, rating: 5.0, reviews: 4,   brand: "itel",     cardBg: "linear-gradient(135deg,#fefce8,#fef08a)" },
  { id: "ph6",  name: "Poco C71 6.88\" 4GB RAM 64GB ROM Android 15 - Black",          newPrice: 153693, oldPrice: 175000, discount: 12, rating: 4.1, reviews: 28,  brand: "Poco",     cardBg: "linear-gradient(135deg,#fff7ed,#fed7aa)" },
  { id: "ph7",  name: "Xiaomi Redmi Note 15 6.77\" 6GB 128GB AMOLED - Black",         newPrice: 299629, oldPrice: 350000, discount: 14, rating: 4.4, reviews: 5,   brand: "Xiaomi",   cardBg: "linear-gradient(135deg,#f0f9ff,#e0f2fe)" },
  { id: "ph8",  name: "Samsung Galaxy A57 5G 8GB RAM 128GB ROM - Awesome Icyblue",    newPrice: 478705, oldPrice: 620000, discount: 23, rating: 4.2, reviews: 67,  brand: "Samsung",  cardBg: "linear-gradient(135deg,#eff6ff,#dbeafe)" },
  { id: "ph9",  name: "Blackview Wave 10C 6.88\" 4GB+128GB 5000mAh - Black",          newPrice: 142546, oldPrice: 319680, discount: 55, rating: 4.0, reviews: 4,   brand: "Blackview", cardBg: "linear-gradient(135deg,#f8fafc,#e2e8f0)" },
  { id: "ph10", name: "Hmd LUMA 4+4GB/128GB 50MP Camera Android 15 - Titanium",       newPrice: 150766, oldPrice: 200000, discount: 25, rating: 3.9, reviews: 12,  brand: "HMD",      cardBg: "linear-gradient(135deg,#f1f5f9,#cbd5e1)" },
]

const beautyProducts = [
  { id: "be1", name: "NIVEA MEN Deep Body Lotion 400ml (Pack Of 2)",                 newPrice: 8700,  oldPrice: 11225, discount: 23, rating: 4.1, reviews: 5110,  brand: "NIVEA",   cardBg: "linear-gradient(135deg,#ede9fe,#ddd6fe)" },
  { id: "be2", name: "Kiki New Gain Rechargeable Wireless Hair Clipper NG-888B",     newPrice: 15153, oldPrice: 15950, discount: 5,  rating: 4.1, reviews: 10773, brand: "Kiki",    cardBg: "linear-gradient(135deg,#fef3c7,#fde68a)" },
  { id: "be3", name: "NIVEA Pearl & Beauty Anti-Perspirant Roll-on Women Pack 3",    newPrice: 4555,  oldPrice: 6125,  discount: 26, rating: 4.0, reviews: 4611,  brand: "NIVEA",   cardBg: "linear-gradient(135deg,#fdf2f8,#fce7f3)" },
  { id: "be4", name: "TOKIKE Professional Cordless Hair Clipper 240 Mins Runtime",   newPrice: 15790, oldPrice: 43373, discount: 64, rating: 4.1, reviews: 300,   brand: "TOKIKE",  cardBg: "linear-gradient(135deg,#f0fdf4,#dcfce7)" },
  { id: "be5", name: "Dou-color 2-in-1 Electric Hot Comb Hair Straightener",         newPrice: 8288,  oldPrice: 12888, discount: 36, rating: 3.9, reviews: 206,   brand: "Dou-color",cardBg: "linear-gradient(135deg,#fff7ed,#fed7aa)" },
  { id: "be6", name: "NIVEA Nourishing Cocoa Body Lotion Women 400ml Pack Of 2",     newPrice: 8070,  oldPrice: 10205, discount: 21, rating: 4.0, reviews: 6694,  brand: "NIVEA",   cardBg: "linear-gradient(135deg,#ede9fe,#ddd6fe)" },
  { id: "be7", name: "L'Oréal Absolut Repair 10-In-1 Leave In Hair Oil 90ml",        newPrice: 41225, oldPrice: 48450, discount: 15, rating: 4.7, reviews: 3,     brand: "L'Oréal", cardBg: "linear-gradient(135deg,#fefce8,#fef9c3)" },
  { id: "be8", name: "TOUPHY Men's Hair Clipper Electric Trimmer LCD Display Gold",   newPrice: 8865,  oldPrice: 18000, discount: 51, rating: 3.8, reviews: 222,   brand: "TOUPHY",  cardBg: "linear-gradient(135deg,#f1f5f9,#e2e8f0)" },
]

const electronicsProducts = [
  { id: "el1", name: "Hikers 32\" Smart HD Frameless Android 14 LED TV",              newPrice: 104400,  oldPrice: 171000,  discount: 39, rating: 4.1, reviews: 1406, brand: "Hikers",   cardBg: "linear-gradient(135deg,#eff6ff,#dbeafe)" },
  { id: "el2", name: "Royal 50\" QLED TV (RTV50QM15P) + FREE Wall Bracket",           newPrice: 319499,  oldPrice: 563333,  discount: 43, rating: 4.4, reviews: 406,  brand: "Royal",    cardBg: "linear-gradient(135deg,#f8fafc,#1e293b)" },
  { id: "el3", name: "TCL 55 Inches UHD 4K Google Smart TV + 12 Months Warranty",    newPrice: 449999,  oldPrice: 650000,  discount: 31, rating: 4.3, reviews: 888,  brand: "TCL",      cardBg: "linear-gradient(135deg,#1e3a5f,#2563eb)" },
  { id: "el4", name: "LP Soundbar 120W 2.1CH Home Theater with Subwoofer",           newPrice: 81994,   oldPrice: 158400,  discount: 48, rating: 4.0, reviews: 12,   brand: "LP Audio", cardBg: "linear-gradient(135deg,#1c1917,#57534e)" },
  { id: "el5", name: "Oraimo SpaceBuds 2 TWS 52dB Hybrid ANC AI Translation",        newPrice: 53006,   oldPrice: 86400,   discount: 39, rating: 4.5, reviews: 72,   brand: "Oraimo",   cardBg: "linear-gradient(135deg,#e0f2fe,#bae6fd)" },
  { id: "el6", name: "Mi+ 50\" VIDAA Smart 4K UHD LED TV – 12 Months Warranty",      newPrice: 293328,  oldPrice: 332803,  discount: 12, rating: 4.0, reviews: 89,   brand: "Mi+",      cardBg: "linear-gradient(135deg,#fef3c7,#fde68a)" },
  { id: "el7", name: "HITHIUM 1kWh Power Station Solar Charge for TV & Fan",         newPrice: 259999,  oldPrice: 307711,  discount: 16, rating: 4.3, reviews: 1731, brand: "HITHIUM",  cardBg: "linear-gradient(135deg,#fefce8,#fef08a)" },
  { id: "el8", name: "7-in-1 Multi Ports USB Type C Hub Splitter Adapter Dock",      newPrice: 6524,    oldPrice: 19426,   discount: 66, rating: 4.6, reviews: 49,   brand: "Generic",  cardBg: "linear-gradient(135deg,#f0fdf4,#dcfce7)" },
]

// ── Toast helper ──────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState({ message: "", type: "cart" })
  const showToast = useCallback((message, type = "cart") => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: "", type }), 2200)
  }, [])
  return { toast, showToast }
}

// ── Main App ──────────────────────────────────────────────────
function App() {

  // Pages: "home" | "signin" | "category" | "checkout" | "track-order"
  const [page, setPage] = useState("home")
  const [currentCategory, setCurrentCategory] = useState("Women Handbags & Wallets")
  const [searchKeyword, setSearchKeyword]     = useState("")

  const [user, setUser]                 = useState(null)
  const [cartItems, setCartItems]       = useState([])
  const [cartOpen, setCartOpen]         = useState(false)
  const [wishlist, setWishlist]         = useState([])
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [orders, setOrders]             = useState([])
  const [activeTrackingNumber, setActiveTrackingNumber] = useState("")
  const { toast, showToast }            = useToast()

  // ── Navigation routing helpers ──
  function goToHome() {
    setPage("home")
    setSearchKeyword("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleSearch(query) {
    setSearchKeyword(query)
    setCurrentCategory(query ? `Search results for "${query}"` : "All Products")
    setPage("category")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleSelectCategory(catName) {
    setCurrentCategory(catName)
    setSearchKeyword("")
    setPage("category")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function goToTrackOrder(orderNumber = "") {
    if (orderNumber) {
      setActiveTrackingNumber(orderNumber)
    }
    setPage("track-order")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleOrderPlaced(orderData) {
    setCartItems([])
    if (orderData) {
      setOrders((prev) => [orderData, ...prev])
      setActiveTrackingNumber(orderData.orderNumber)
    }
  }

  // ── Cart handlers ──
  function addToCart(product) {
    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id)
      if (idx !== -1) {
        return prev.map((item, i) =>
          i === idx ? { ...item, qty: (item.qty || 1) + 1 } : item
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
    showToast("Added to cart!", "cart")
  }

  function removeFromCart(index) {
    setCartItems((prev) => prev.filter((_, i) => i !== index))
  }

  function updateCartQty(index, qty) {
    if (qty < 1) { removeFromCart(index); return }
    setCartItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, qty } : item))
    )
  }

  // ── Wishlist handlers ──
  function toggleWishlist(product) {
    const inList = wishlist.some((w) => w.id === product.id)
    if (inList) {
      setWishlist((prev) => prev.filter((w) => w.id !== product.id))
      showToast("Removed from wishlist", "info")
    } else {
      setWishlist((prev) => [...prev, product])
      showToast("Added to wishlist!", "wishlist")
    }
  }

  // ── Restore active Supabase session on mount ──
  useEffect(() => {
    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession()
        if (data && data.session && data.session.user) {
          const u = data.session.user
          const name = (u.user_metadata && u.user_metadata.name) || u.email.split("@")[0]
          setUser({ name, email: u.email, id: u.id })
        }
      } catch (err) {
        // Ignore session read error
      }
    }
    checkSession()

    // Listen to Supabase auth events
    const { data: authSub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session && session.user) {
        const u = session.user
        const name = (u.user_metadata && u.user_metadata.name) || u.email.split("@")[0]
        setUser({ name, email: u.email, id: u.id })
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    return () => {
      if (authSub && authSub.subscription) {
        authSub.subscription.unsubscribe()
      }
    }
  }, [])

  // ── Auth handlers ──
  function handleLogin(userInfo) {
    setUser(userInfo)
    setPage("home")
    showToast(`Welcome back, ${userInfo.name}!`, "info")
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      // Ignore signout error
    }
    setUser(null)
    showToast("Signed out successfully", "info")
  }

  // ── Shared Header Props ──
  const headerProps = {
    cartCount:         cartItems.reduce((s, i) => s + (i.qty || 1), 0),
    wishlistCount:     wishlist.length,
    onCartOpen:        () => setCartOpen(true),
    onWishlistOpen:    () => setWishlistOpen(true),
    user,
    onSignInClick:     () => setPage("signin"),
    onSignOut:         handleLogout,
    onGoHome:          goToHome,
    onSearch:          handleSearch,
    onSelectCategory:  handleSelectCategory,
    onTrackOrderClick: () => goToTrackOrder(),
    onMyAccountClick:  () => { setPage("account"); window.scrollTo({ top: 0, behavior: "smooth" }) },
    currentPage:       page,
    activeCategory:    currentCategory,
  }

  const productProps = {
    onAddToCart: addToCart,
    onWishlist:  toggleWishlist,
    wishlist,
  }

  // ── Overlays: Cart, Wishlist, Toast ──
  const overlays = (
    <>
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemove={removeFromCart}
        onUpdateQty={updateCartQty}
        onCheckout={() => { setCartOpen(false); setPage("checkout") }}
      />
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistItems={wishlist}
        onRemove={toggleWishlist}
        onAddToCart={addToCart}
      />
      <Toast message={toast.message} type={toast.type} />
    </>
  )

  // ── Sign In page ──
  if (page === "signin") {
    return (
      <SignIn
        onLogin={handleLogin}
        onClose={goToHome}
      />
    )
  }

  // ── Checkout page ──
  if (page === "checkout") {
    return (
      <>
        <CheckoutPage
          cartItems={cartItems}
          user={user}
          onBack={goToHome}
          onPlaceOrder={handleOrderPlaced}
          onTrackOrder={(num) => goToTrackOrder(num)}
        />
        <Toast message={toast.message} type={toast.type} />
      </>
    )
  }

  // ── Track Order page ──
  if (page === "track-order") {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
        <Header {...headerProps} />
        <main className="max-w-screen-xl mx-auto px-2.5 sm:px-4 py-3 sm:py-4 flex-1 w-full">
          <TrackOrder
            orders={orders}
            selectedOrderNumber={activeTrackingNumber}
            onGoHome={goToHome}
          />
        </main>
        <Footer />
        {overlays}
      </div>
    )
  }

  // ── My Account page ──
  if (page === "account") {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
        <Header {...headerProps} />
        <main className="max-w-screen-xl mx-auto px-2.5 sm:px-4 py-3 sm:py-4 flex-1 w-full">
          <AccountPage
            user={user}
            orders={orders}
            wishlist={wishlist}
            onGoHome={goToHome}
            onTrackOrder={(num) => goToTrackOrder(num)}
            onAddToCart={addToCart}
            onRemoveWishlist={toggleWishlist}
            onSignOut={handleLogout}
            onSignInClick={() => setPage("signin")}
          />
        </main>
        <Footer />
        {overlays}
      </div>
    )
  }

  // ── Category / Product Listing page ──
  if (page === "category") {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
        <Header {...headerProps} />
        <main className="max-w-screen-xl mx-auto px-2.5 sm:px-4 py-3 sm:py-4 flex-1 w-full">
          <ProductListingPage
            onAddToCart={addToCart}
            onGoHome={goToHome}
            categoryTitle={currentCategory}
            searchQuery={searchKeyword}
          />
        </main>
        <Footer />
        {overlays}
      </div>
    )
  }

  // ── Home page ──
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">

      <Header {...headerProps} />

      <main className="max-w-screen-xl mx-auto px-2.5 sm:px-4 py-3 sm:py-4 flex-1 w-full">

        {/* Welcome banner when logged in */}
        {user && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
            <span>Welcome back, <strong>{user.name}</strong>! Great deals are waiting for you.</span>
          </div>
        )}

        {/* ① Hero Banner */}
        <HeroBanner onShopNow={() => handleSelectCategory("Featured Deals")} />

        {/* ② Flash Sales */}
        <FlashSales
          onSeeAll={() => handleSelectCategory("Flash Sales Deals")}
          {...productProps}
        />

        {/* ③ Category Tiles Grid */}
        <CategoryTiles onCategoryClick={(cat) => handleSelectCategory(cat)} />

        {/* ④ Phones & Tablets */}
        <ProductSection
          title="Phones & Tablets"
          badge="Best Deals on Smartphones"
          products={phonesProducts}
          onSeeAll={() => handleSelectCategory("Phones & Tablets")}
          {...productProps}
        />

        {/* ⑤ Top Deals (bags) */}
        <TopDeals
          onSeeAll={() => handleSelectCategory("Women Handbags & Wallets")}
          {...productProps}
        />

        {/* ⑥ Electronics & TV */}
        <ProductSection
          title="Electronics & TV"
          badge="Up to 48% Off"
          products={electronicsProducts}
          onSeeAll={() => handleSelectCategory("Electronics & TV")}
          {...productProps}
        />

        {/* ⑦ Health & Beauty */}
        <ProductSection
          title="Health & Beauty"
          badge="Top Beauty Picks"
          products={beautyProducts}
          onSeeAll={() => handleSelectCategory("Health & Beauty")}
          {...productProps}
        />

      </main>

      <Footer />
      {overlays}

    </div>
  )
}

export default App
