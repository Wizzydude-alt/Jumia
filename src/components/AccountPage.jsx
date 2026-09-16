// ============================================================
// ACCOUNTPAGE.JSX — Professional Jumia Nigeria "My Account" Page
//
// Features:
//   - Account Overview (User Profile, Default Address, Store Credit)
//   - Orders & History (Past orders, live status, track order link, buy again)
//   - Address Book (Manage shipping addresses with Nigerian states)
//   - Wishlist management
//   - Profile & Security Settings (Update name, password, preferences)
//   - Fully responsive design (collapsible tabs on mobile)
// ============================================================

import { useState } from "react"
import { NIGERIAN_STATES, NIGERIAN_LOCATIONS } from "../nigeriaLocations"

function AccountPage({
  user,
  orders = [],
  wishlist = [],
  onGoHome,
  onTrackOrder,
  onAddToCart,
  onRemoveWishlist,
  onSignOut,
  onSignInClick,
}) {
  const [activeTab, setActiveTab] = useState("overview") // "overview" | "orders" | "addresses" | "wishlist" | "settings"

  // User Profile State
  const [profileName, setProfileName] = useState(user ? user.name : "Valued Customer")
  const [profileEmail] = useState(user ? user.email : "user@example.com")
  const [profilePhone, setProfilePhone] = useState("0803 123 4567")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState("")

  // Saved Addresses State
  const [addresses, setAddresses] = useState([
    {
      id: "addr-1",
      isDefault: true,
      fullName: user ? user.name : "Chidi Adeleke",
      phone: "0803 123 4567",
      address: "Plot 14, Admiralty Way, Lekki Phase 1",
      city: "Lekki",
      state: "Lagos",
    },
  ])
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [modalCustomCity, setModalCustomCity] = useState(false)
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "Ikeja",
    state: "Lagos",
  })

  // Password Change State
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" })
  const [passwordFeedback, setPasswordFeedback] = useState({ error: "", success: "" })

  // Combined orders: user placed orders + demo past orders
  const demoOrders = [
    {
      orderNumber: "JUM-784920",
      date: "15 September 2026",
      status: "In Transit",
      statusColor: "text-orange-600 bg-orange-50 border-orange-200",
      grandTotal: 179201,
      items: [
        { name: "Xiaomi Redmi A7 Pro 6.9\" 4GB RAM 128GB ROM", qty: 1, newPrice: 164599 },
        { name: "Oraimo SpaceBuds Lite True Wireless Earbuds", qty: 1, newPrice: 14602 },
      ],
    },
    {
      orderNumber: "JUM-619402",
      date: "28 August 2026",
      status: "Delivered",
      statusColor: "text-green-600 bg-green-50 border-green-200",
      grandTotal: 18000,
      items: [
        { name: "Women's Vintage Monogram Tote Bag Brown Beige", qty: 1, newPrice: 18000 },
      ],
    },
  ]

  const allOrders = orders.length > 0 ? [...orders, ...demoOrders] : demoOrders

  function handleSaveProfile(e) {
    e.preventDefault()
    setIsEditingProfile(false)
    setProfileMessage("Profile details updated successfully.")
    setTimeout(() => setProfileMessage(""), 3000)
  }

  function handleAddAddress(e) {
    e.preventDefault()
    if (!newAddress.fullName || !newAddress.phone || !newAddress.address || !newAddress.city) {
      return
    }
    const created = {
      id: "addr-" + Date.now(),
      isDefault: addresses.length === 0,
      ...newAddress,
    }
    setAddresses((prev) => [...prev, created])
    setNewAddress({ fullName: "", phone: "", address: "", city: "Ikeja", state: "Lagos" })
    setModalCustomCity(false)
    setShowAddressModal(false)
  }

  function handleSetDefaultAddress(id) {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    )
  }

  function handleDeleteAddress(id) {
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  function handlePasswordChange(e) {
    e.preventDefault()
    setPasswordFeedback({ error: "", success: "" })
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      setPasswordFeedback({ error: "Please fill in all password fields.", success: "" })
      return
    }
    if (passwords.next.length < 6) {
      setPasswordFeedback({ error: "New password must be at least 6 characters.", success: "" })
      return
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordFeedback({ error: "New passwords do not match.", success: "" })
      return
    }
    setPasswordFeedback({ error: "", success: "Password changed successfully." })
    setPasswords({ current: "", next: "", confirm: "" })
    setTimeout(() => setPasswordFeedback({ error: "", success: "" }), 3000)
  }

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center max-w-lg mx-auto my-8">
        <h2 className="text-xl font-black text-gray-900 mb-2">My Account</h2>
        <p className="text-sm text-gray-500 mb-6">
          Please sign in to view your orders, saved addresses, and manage your account details.
        </p>
        <button
          onClick={onSignInClick}
          className="bg-jumia-orange hover:bg-orange-500 text-white font-bold px-8 py-3 rounded-xl transition-colors cursor-pointer text-sm"
        >
          Sign In / Register
        </button>
      </div>
    )
  }

  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0]

  return (
    <div className="space-y-4">

      {/* Breadcrumb Navigation */}
      <div className="bg-white rounded-lg shadow-sm px-4 py-3 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 text-gray-500">
          <button
            onClick={onGoHome}
            className="text-jumia-orange font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            ← Home
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-semibold">My Account</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 capitalize">{activeTab}</span>
        </div>
        <button
          onClick={onGoHome}
          className="text-xs text-gray-500 hover:text-jumia-orange font-medium cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>

      {/* Main Account Layout: Sidebar Tabs + Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ── LEFT SIDEBAR (Desktop) / TOP TABS (Mobile) ── */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          {/* User Profile Pill at top of sidebar */}
          <div className="p-4 bg-orange-50/70 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-jumia-orange text-white font-black text-base flex items-center justify-center flex-shrink-0">
              {profileName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 truncate">{profileName}</p>
              <p className="text-xs text-gray-500 truncate">{profileEmail}</p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <nav className="flex lg:flex-col overflow-x-auto p-1.5 lg:p-2 gap-1 text-xs sm:text-sm font-semibold">
            {[
              { id: "overview", label: "Account Overview" },
              { id: "orders", label: `Orders (${allOrders.length})` },
              { id: "addresses", label: "Address Book" },
              { id: "wishlist", label: `Saved Wishlist (${wishlist.length})` },
              { id: "settings", label: "Settings & Security" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 lg:flex-none text-left px-3.5 py-2.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-orange-50 text-jumia-orange font-bold border-b-2 lg:border-b-0 lg:border-l-4 border-jumia-orange"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}

            <div className="hidden lg:block border-t border-gray-100 my-1 pt-1">
              <button
                onClick={onSignOut}
                className="w-full text-left px-3.5 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors font-bold cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </nav>
        </div>

        {/* ── RIGHT MAIN CONTENT AREA ── */}
        <div className="lg:col-span-9 space-y-4">

          {/* ════════════════════════════════════════════════
              1. TAB: ACCOUNT OVERVIEW
          ════════════════════════════════════════════════ */}
          {activeTab === "overview" && (
            <div className="space-y-4">

              {profileMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg p-3 font-medium">
                  {profileMessage}
                </div>
              )}

              {/* 3 Summary Cards: Details, Address, Store Credit */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Card 1: Account Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Account Details
                      </h3>
                      <button
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="text-xs text-jumia-orange font-bold hover:underline cursor-pointer"
                      >
                        {isEditingProfile ? "Cancel" : "Edit"}
                      </button>
                    </div>

                    {!isEditingProfile ? (
                      <div className="space-y-1 text-sm text-gray-800">
                        <p className="font-bold text-gray-900">{profileName}</p>
                        <p className="text-xs text-gray-500">{profileEmail}</p>
                        <p className="text-xs text-gray-500">{profilePhone}</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSaveProfile} className="space-y-2 pt-1">
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          placeholder="Full Name"
                          className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs outline-none focus:border-jumia-orange"
                          required
                        />
                        <input
                          type="tel"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          placeholder="Phone Number"
                          className="w-full border border-gray-300 rounded px-2.5 py-1 text-xs outline-none focus:border-jumia-orange"
                        />
                        <button
                          type="submit"
                          className="w-full bg-jumia-orange text-white text-xs font-bold py-1.5 rounded hover:bg-orange-500 transition-colors cursor-pointer"
                        >
                          Save
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Card 2: Address Book */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Default Address
                      </h3>
                      <button
                        onClick={() => setActiveTab("addresses")}
                        className="text-xs text-jumia-orange font-bold hover:underline cursor-pointer"
                      >
                        Manage
                      </button>
                    </div>

                    {defaultAddr ? (
                      <div className="space-y-1 text-xs text-gray-700">
                        <p className="font-bold text-gray-900">{defaultAddr.fullName}</p>
                        <p className="line-clamp-2">{defaultAddr.address}</p>
                        <p className="text-gray-500">{defaultAddr.city}, {defaultAddr.state}</p>
                        <p className="text-gray-500">{defaultAddr.phone}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">No address saved yet.</p>
                    )}
                  </div>
                </div>

                {/* Card 3: Jumia Store Credit / Wallet */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Jumia Store Credit
                    </h3>
                    <div className="space-y-1">
                      <p className="text-2xl font-black text-gray-900">₦ 0.00</p>
                      <p className="text-[11px] text-gray-500">
                        Use store credit to checkout instantly on any order.
                      </p>
                    </div>
                  </div>
                  <div className="pt-3">
                    <span className="inline-block text-[10px] bg-orange-100 text-jumia-orange font-bold px-2 py-0.5 rounded">
                      Promo code JUMIA2026 available
                    </span>
                  </div>
                </div>

              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                    Recent Orders
                  </h2>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-jumia-orange hover:underline cursor-pointer"
                  >
                    View All ({allOrders.length}) →
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {allOrders.slice(0, 2).map((order) => (
                    <div key={order.orderNumber} className="p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-900">
                            #{order.orderNumber}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              order.status === "Delivered"
                                ? "text-green-600 bg-green-50 border-green-200"
                                : "text-orange-600 bg-orange-50 border-orange-200"
                            }`}
                          >
                            {order.status || "In Transit"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Placed on {order.date} · {order.items ? order.items.length : 1} items
                        </p>
                        <p className="text-xs font-bold text-gray-900">
                          ₦ {order.grandTotal ? order.grandTotal.toLocaleString() : "0"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onTrackOrder && onTrackOrder(order.orderNumber)}
                          className="bg-jumia-orange hover:bg-orange-500 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          Track Package
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ════════════════════════════════════════════════
              2. TAB: ORDERS & HISTORY
          ════════════════════════════════════════════════ */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-base font-black text-gray-900">
                    Order History ({allOrders.length})
                  </h2>
                  <p className="text-xs text-gray-500">
                    Track existing shipments, check package details, or reorder items.
                  </p>
                </div>
              </div>

              {allOrders.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <p className="text-gray-500 font-bold text-sm">You haven't placed any orders yet.</p>
                  <button
                    onClick={onGoHome}
                    className="bg-jumia-orange text-white text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-orange-500 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {allOrders.map((order) => (
                    <div key={order.orderNumber} className="p-4 sm:p-5 space-y-3">

                      <div className="flex items-start justify-between flex-wrap gap-2 pb-2 border-b border-gray-50">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs sm:text-sm font-black text-gray-900">
                              #{order.orderNumber}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                order.status === "Delivered"
                                  ? "text-green-600 bg-green-50 border-green-200"
                                  : "text-orange-600 bg-orange-50 border-orange-200"
                              }`}
                            >
                              {order.status || "In Transit"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">Placed on {order.date}</p>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-gray-500 block">Order Total</span>
                          <span className="text-sm sm:text-base font-black text-jumia-orange">
                            ₦ {order.grandTotal ? order.grandTotal.toLocaleString() : "0"}
                          </span>
                        </div>
                      </div>

                      {/* Item list */}
                      <div className="space-y-2">
                        {order.items && order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-gray-700">
                            <span className="truncate max-w-xs sm:max-w-md font-medium">
                              {item.name}
                            </span>
                            <span className="text-gray-500 flex-shrink-0 ml-2">
                              Qty: {item.qty || 1} × ₦ {item.newPrice ? item.newPrice.toLocaleString() : "0"}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                        <button
                          onClick={() => onTrackOrder && onTrackOrder(order.orderNumber)}
                          className="bg-jumia-orange hover:bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          Track Live Order →
                        </button>

                        <button
                          onClick={() => {
                            if (order.items && order.items[0]) {
                              onAddToCart && onAddToCart(order.items[0])
                            }
                          }}
                          className="text-xs font-semibold text-gray-600 hover:text-jumia-orange border border-gray-200 px-3 py-1.5 rounded-lg hover:border-jumia-orange transition-colors cursor-pointer"
                        >
                          Buy Again
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════
              3. TAB: ADDRESS BOOK
          ════════════════════════════════════════════════ */}
          {activeTab === "addresses" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-gray-100 pb-3">
                <div>
                  <h2 className="text-base font-black text-gray-900">Address Book</h2>
                  <p className="text-xs text-gray-500">
                    Manage delivery addresses for quicker checkout.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="bg-jumia-orange hover:bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  + Add New Address
                </button>
              </div>

              {/* Address Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`rounded-xl border p-4 space-y-2 relative transition-all ${
                      addr.isDefault
                        ? "border-jumia-orange bg-orange-50/20"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {addr.isDefault && (
                      <span className="text-[10px] bg-jumia-orange text-white font-bold px-2 py-0.5 rounded-full">
                        DEFAULT
                      </span>
                    )}
                    <p className="text-sm font-bold text-gray-900">{addr.fullName}</p>
                    <p className="text-xs text-gray-700">{addr.address}</p>
                    <p className="text-xs text-gray-500">{addr.city}, {addr.state}</p>
                    <p className="text-xs text-gray-500">Phone: {addr.phone}</p>

                    <div className="pt-2 flex items-center justify-between border-t border-gray-100 text-xs font-semibold">
                      {!addr.isDefault ? (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-jumia-orange hover:underline cursor-pointer"
                        >
                          Set as Default
                        </button>
                      ) : (
                        <span className="text-gray-400 text-[11px]">Primary Shipping</span>
                      )}
                      {addresses.length > 1 && (
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-red-500 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal for New Address */}
              {showAddressModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <h3 className="text-sm font-bold text-gray-900">Add New Address</h3>
                      <button
                        onClick={() => setShowAddressModal(false)}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer text-base"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleAddAddress} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newAddress.fullName}
                          onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-jumia-orange"
                          placeholder="e.g. Chidi Adeleke"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-jumia-orange"
                          placeholder="e.g. 0803 123 4567"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-jumia-orange"
                          placeholder="Building, street, apartment"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                          <select
                            value={newAddress.state}
                            onChange={(e) => {
                              const nextState = e.target.value
                              const defaultCity = (NIGERIAN_LOCATIONS[nextState] || [])[0] || ""
                              setModalCustomCity(false)
                              setNewAddress({ ...newAddress, state: nextState, city: defaultCity })
                            }}
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-jumia-orange bg-white"
                          >
                            {NIGERIAN_STATES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-gray-700">City / Area</label>
                            <button
                              type="button"
                              onClick={() => {
                                const next = !modalCustomCity
                                setModalCustomCity(next)
                                if (next) {
                                  setNewAddress((prev) => ({ ...prev, city: "" }))
                                } else {
                                  setNewAddress((prev) => ({
                                    ...prev,
                                    city: (NIGERIAN_LOCATIONS[prev.state] || [])[0] || "",
                                  }))
                                }
                              }}
                              className="text-[10px] text-jumia-orange underline font-semibold cursor-pointer"
                            >
                              {modalCustomCity ? "List" : "+ Custom"}
                            </button>
                          </div>
                          {modalCustomCity ? (
                            <input
                              type="text"
                              required
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                              className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-jumia-orange"
                              placeholder={`Area in ${newAddress.state}`}
                              autoFocus
                            />
                          ) : (
                            <select
                              value={newAddress.city}
                              onChange={(e) => {
                                if (e.target.value === "__CUSTOM__") {
                                  setModalCustomCity(true)
                                  setNewAddress({ ...newAddress, city: "" })
                                } else {
                                  setNewAddress({ ...newAddress, city: e.target.value })
                                }
                              }}
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-jumia-orange bg-white"
                            >
                              <option value="" disabled>Select Area</option>
                              {(NIGERIAN_LOCATIONS[newAddress.state] || []).map((area) => (
                                <option key={area} value={area}>{area}</option>
                              ))}
                              <option value="__CUSTOM__">+ Other area...</option>
                            </select>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 bg-jumia-orange hover:bg-orange-500 text-white font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          Save Address
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddressModal(false)}
                          className="bg-gray-100 text-gray-600 font-semibold px-4 py-2 rounded-lg text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ════════════════════════════════════════════════
              4. TAB: SAVED WISHLIST
          ════════════════════════════════════════════════ */}
          {activeTab === "wishlist" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 space-y-4">
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-gray-900">
                    Saved Wishlist ({wishlist.length})
                  </h2>
                  <p className="text-xs text-gray-500">Items you have bookmarked for later purchase.</p>
                </div>
              </div>

              {wishlist.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <span className="text-4xl text-gray-300">♡</span>
                  <p className="text-gray-500 font-bold text-sm">Your wishlist is currently empty.</p>
                  <button
                    onClick={onGoHome}
                    className="bg-jumia-orange text-white text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-orange-500 transition-colors"
                  >
                    Discover Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-xl p-3 flex gap-3 items-center justify-between"
                    >
                      <div
                        className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: item.cardBg || "#f3f4f6" }}
                      >
                        <span className="text-[10px] font-bold text-gray-500">
                          {item.brand || "JUMIA"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.name}</p>
                        <p className="text-sm font-black text-jumia-orange mt-0.5">
                          ₦ {item.newPrice.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => {
                            onAddToCart && onAddToCart(item)
                            onRemoveWishlist && onRemoveWishlist(item)
                          }}
                          className="bg-jumia-orange hover:bg-orange-500 text-white font-bold text-xs px-3 py-1.5 rounded transition-colors cursor-pointer"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => onRemoveWishlist && onRemoveWishlist(item)}
                          className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════
              5. TAB: SETTINGS & SECURITY
          ════════════════════════════════════════════════ */}
          {activeTab === "settings" && (
            <div className="space-y-4">

              {/* Password Change Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
                <h2 className="text-base font-black text-gray-900 mb-1">Security & Password</h2>
                <p className="text-xs text-gray-500 mb-4">
                  Ensure your account uses a secure password.
                </p>

                {passwordFeedback.error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg p-2.5 mb-3 font-medium">
                    {passwordFeedback.error}
                  </div>
                )}
                {passwordFeedback.success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg p-2.5 mb-3 font-medium">
                    {passwordFeedback.success}
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-xs outline-none focus:border-jumia-orange"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={passwords.next}
                      onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-xs outline-none focus:border-jumia-orange"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-xs outline-none focus:border-jumia-orange"
                      placeholder="Repeat new password"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gray-900 hover:bg-black text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Update Password
                  </button>
                </form>
              </div>

              {/* Notification Preferences */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
                <h2 className="text-base font-black text-gray-900 mb-1">Notifications & Communications</h2>
                <p className="text-xs text-gray-500 mb-4">
                  Manage how Jumia contacts you about discounts and order updates.
                </p>

                <div className="space-y-2.5">
                  <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-jumia-orange" />
                    <span>Receive SMS and WhatsApp alerts for live delivery tracking</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-jumia-orange" />
                    <span>Receive weekly promotional emails and flash sales discounts</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" className="accent-jumia-orange" />
                    <span>Subscribe to Jumia Prime exclusive deal previews</span>
                  </label>
                </div>
              </div>

              {/* Danger Zone: Sign Out */}
              <div className="bg-white rounded-xl shadow-sm border border-red-100 p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Sign Out of All Devices</h3>
                  <p className="text-xs text-gray-500">Safely log out from your current browsing session.</p>
                </div>
                <button
                  onClick={onSignOut}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default AccountPage

