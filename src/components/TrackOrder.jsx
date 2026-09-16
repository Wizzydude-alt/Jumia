// ============================================================
// TRACKORDER.JSX — Live Order Tracking Experience
//
// Features:
//   - Order Number lookup bar with instant search
//   - Quick selector for user's past and recent orders
//   - Multi-step live tracking timeline:
//       1. Order Placed & Confirmed (Paystack verified)
//       2. Processing at Warehouse (Jumia Ikeja Fulfillment Center)
//       3. In Transit with Courier (Jumia Express Logistics)
//       4. Out for Delivery to destination
//       5. Delivered
//   - Courier & Rider details with contact option
//   - Itemized package breakdown and delivery address
//   - Clean design matching Jumia's official styling (no random emojis)
// ============================================================

import { useState, useEffect } from "react"

function TrackOrder({ orders = [], selectedOrderNumber = "", onGoHome }) {

  // Search input state
  const [searchInput, setSearchInput] = useState(selectedOrderNumber || "")
  const [activeOrder, setActiveOrder] = useState(null)
  const [lookupError, setLookupError] = useState("")

  // Default demo order if user hasn't made any order yet
  const defaultDemoOrder = {
    orderNumber: "JUM-784920",
    transactionRef: "PSTK_98AB41X",
    date: "15 September 2026",
    status: "In Transit — Out with Courier",
    progressStep: 3, // 1 to 5
    estimatedDelivery: "Tomorrow, by 2:00 PM",
    courier: {
      name: "Jumia Express Logistics",
      riderName: "Emeka Okonkwo",
      riderPhone: "0803 456 7890",
      trackingCode: "JUM-EXP-LAG-9921",
    },
    customer: {
      name: "Chidi Adeleke",
      phone: "0801 234 5678",
      address: "Plot 14, Admiralty Way, Lekki Phase 1",
      city: "Lekki",
      state: "Lagos",
    },
    deliveryMethod: "Door Delivery",
    paymentMethod: "Paystack Payment Gateway",
    items: [
      {
        name: "Xiaomi Redmi A7 Pro 6.9\" 4GB RAM 128GB ROM - Black",
        qty: 1,
        newPrice: 164599,
        cardBg: "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
      },
      {
        name: "Oraimo SpaceBuds Lite True Wireless Earbuds",
        qty: 1,
        newPrice: 14602,
        cardBg: "linear-gradient(135deg,#e0f2fe,#bae6fd)",
      },
    ],
    subtotal: 179201,
    deliveryFee: 0,
    grandTotal: 179201,
    timeline: [
      {
        title: "Order Placed & Payment Verified",
        desc: "Payment authorized and verified via Paystack Gateway.",
        time: "15 Sep, 09:30 AM",
        completed: true,
      },
      {
        title: "Order Processed & Packaged",
        desc: "Item inspected, quality verified, and packed at Jumia Ikeja Fulfillment Center.",
        time: "15 Sep, 11:45 AM",
        completed: true,
      },
      {
        title: "Handed over to Jumia Express Courier",
        desc: "Package dispatched from Central Hub. Rider Emeka O. has picked up the package.",
        time: "15 Sep, 01:15 PM",
        completed: true,
      },
      {
        title: "Out for Delivery",
        desc: "Package is on the vehicle heading towards your delivery address.",
        time: "Estimated: Tomorrow morning",
        completed: false,
      },
      {
        title: "Delivered to Customer",
        desc: "Package delivered and signed at destination address.",
        time: "Estimated: Tomorrow by 2:00 PM",
        completed: false,
      },
    ],
  }

  // Determine initial order to display
  useEffect(() => {
    if (selectedOrderNumber) {
      const found = orders.find((o) => o.orderNumber.toUpperCase() === selectedOrderNumber.toUpperCase())
      if (found) {
        formatAndSetOrder(found)
        setSearchInput(found.orderNumber)
        return
      }
    }

    if (orders.length > 0) {
      formatAndSetOrder(orders[0])
      setSearchInput(orders[0].orderNumber)
    } else {
      setActiveOrder(defaultDemoOrder)
      setSearchInput(defaultDemoOrder.orderNumber)
    }
  }, [orders, selectedOrderNumber])

  // Helper to format placed order into tracking view with realistic timeline
  function formatAndSetOrder(order) {
    const formattedTimeline = [
      {
        title: "Order Placed & Payment Verified",
        desc: `Order received and confirmed via ${order.paymentMethod === "paystack" ? "Paystack Gateway" : "Jumia Payment System"}.`,
        time: `${order.date}, Just now`,
        completed: true,
      },
      {
        title: "Processing at Jumia Fulfillment Center",
        desc: "Goods prepared, scanned, and placed into safe transit packaging.",
        time: "In progress at Hub",
        completed: true,
      },
      {
        title: "Dispatched with Jumia Express Courier",
        desc: "Assigned to delivery route with courier agent.",
        time: "Today",
        completed: true,
      },
      {
        title: "Out for Delivery",
        desc: `En route to ${order.customer ? order.customer.address : "your address"}.`,
        time: "Estimated: Within 24-48 hrs",
        completed: false,
      },
      {
        title: "Delivered to Recipient",
        desc: "Package handed over and customer sign-off.",
        time: "Pending delivery",
        completed: false,
      },
    ]

    setActiveOrder({
      ...order,
      progressStep: 3,
      estimatedDelivery: "2 - 4 Business Days",
      courier: {
        name: "Jumia Express Courier",
        riderName: "Musa Ibrahim",
        riderPhone: "0802 888 4400",
        trackingCode: "JUM-TRK-" + (order.orderNumber ? order.orderNumber.replace("JUM-", "") : "8812"),
      },
      timeline: formattedTimeline,
    })
    setLookupError("")
  }

  function handleSearch(e) {
    e.preventDefault()
    const query = searchInput.trim().toUpperCase()
    if (!query) {
      setLookupError("Please enter an Order Number (e.g. JUM-784920)")
      return
    }

    // Check user's orders
    const matched = orders.find(
      (o) => o.orderNumber.toUpperCase() === query || o.orderNumber.toUpperCase().includes(query)
    )

    if (matched) {
      formatAndSetOrder(matched)
      setLookupError("")
    } else if (query === defaultDemoOrder.orderNumber.toUpperCase() || query.includes("784920")) {
      setActiveOrder(defaultDemoOrder)
      setLookupError("")
    } else {
      setLookupError(`No order found matching "${searchInput}". Please verify your Order Number.`)
    }
  }

  return (
    <div className="space-y-6">

      {/* Breadcrumbs */}
      <div className="bg-white rounded-lg shadow-sm px-4 py-3 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 text-gray-500">
          <button
            onClick={onGoHome}
            className="text-jumia-orange font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            ← Home
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800 font-semibold">Package & Order Tracking</span>
        </div>
        <button
          onClick={onGoHome}
          className="text-xs text-gray-500 hover:text-jumia-orange font-medium cursor-pointer"
        >
          Return to Shopping
        </button>
      </div>

      {/* Search Header Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Track Your Jumia Order
          </h1>
          <p className="text-xs text-gray-500">
            Enter your order tracking number to check live shipping status, courier details, and estimated delivery.
          </p>

          {/* Search Input Form */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto pt-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value)
                setLookupError("")
              }}
              placeholder="e.g. JUM-784920"
              className="flex-1 min-w-0 border-2 border-gray-300 focus:border-jumia-orange rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-mono uppercase tracking-wider outline-none"
            />
            <button
              type="submit"
              className="bg-jumia-orange hover:bg-orange-500 text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm flex-shrink-0"
            >
              Track Order
            </button>
          </form>

          {lookupError && (
            <p className="text-xs text-red-500 font-semibold mt-1">{lookupError}</p>
          )}

          {/* Quick Select Buttons for Existing Orders */}
          {orders.length > 0 && (
            <div className="pt-2 flex items-center justify-center gap-2 flex-wrap text-xs">
              <span className="text-gray-400">Your recent orders:</span>
              {orders.map((ord) => (
                <button
                  key={ord.orderNumber}
                  type="button"
                  onClick={() => {
                    setSearchInput(ord.orderNumber)
                    formatAndSetOrder(ord)
                  }}
                  className={`px-2.5 py-1 rounded-full border text-xs font-mono font-bold cursor-pointer transition-colors ${
                    activeOrder && activeOrder.orderNumber === ord.orderNumber
                      ? "bg-orange-50 border-jumia-orange text-jumia-orange"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  #{ord.orderNumber}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Order Tracking View */}
      {activeOrder && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT: Live Status & Progress Stepper (8 cols) */}
          <div className="lg:col-span-8 space-y-5">

            {/* Current Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">

              <div className="flex items-start justify-between flex-wrap gap-3 sm:gap-4 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                      Tracking Number
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                      #{activeOrder.orderNumber}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-green-600 mt-1">
                    {activeOrder.status || "In Transit"}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Estimated Delivery: <strong className="text-gray-800">{activeOrder.estimatedDelivery || "2 - 4 Days"}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] sm:text-xs text-gray-400 block">Placed on</span>
                  <span className="text-xs font-bold text-gray-800">{activeOrder.date}</span>
                  {activeOrder.transactionRef && (
                    <span className="text-[10px] sm:text-[11px] font-mono text-gray-400 block mt-0.5">
                      Ref: {activeOrder.transactionRef}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar Line */}
              <div className="pt-6 pb-2">
                <div className="relative">
                  {/* Background Track */}
                  <div className="h-2 bg-gray-100 rounded-full w-full overflow-hidden">
                    <div
                      className="h-full bg-jumia-orange transition-all duration-500 rounded-full"
                      style={{ width: `${(activeOrder.progressStep / 5) * 100}%` }}
                    />
                  </div>

                  {/* 5 Milestone Dots */}
                  <div className="flex justify-between -mt-2.5">
                    {[1, 2, 3, 4, 5].map((step) => {
                      const isPast = step <= activeOrder.progressStep
                      const isCurrent = step === activeOrder.progressStep
                      return (
                        <div
                          key={step}
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                            isCurrent
                              ? "bg-jumia-orange border-white ring-2 ring-orange-300 text-white"
                              : isPast
                              ? "bg-jumia-orange border-white text-white"
                              : "bg-white border-gray-300 text-gray-400"
                          }`}
                        >
                          {isPast ? "✓" : step}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 5 Milestone Labels */}
                <div className="grid grid-cols-5 text-[9px] sm:text-[11px] font-semibold text-gray-500 mt-3 text-center leading-tight">
                  <span className={activeOrder.progressStep >= 1 ? "text-jumia-orange font-bold" : ""}>Confirmed</span>
                  <span className={activeOrder.progressStep >= 2 ? "text-jumia-orange font-bold" : ""}>Processed</span>
                  <span className={activeOrder.progressStep >= 3 ? "text-jumia-orange font-bold" : ""}>In Transit</span>
                  <span className={activeOrder.progressStep >= 4 ? "text-jumia-orange font-bold" : ""}>Out for Delivery</span>
                  <span className={activeOrder.progressStep >= 5 ? "text-jumia-orange font-bold" : ""}>Delivered</span>
                </div>
              </div>

            </div>

            {/* Detailed Timeline Steps */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-5">
                Shipment History & Milestones
              </h3>

              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {activeOrder.timeline && activeOrder.timeline.map((item, idx) => (
                  <div key={idx} className="relative">
                    {/* Node circle */}
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 ${
                        item.completed
                          ? "bg-green-500 border-white ring-2 ring-green-200"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    <div className="flex items-start justify-between flex-wrap gap-1">
                      <p className={`text-sm font-bold ${item.completed ? "text-gray-900" : "text-gray-400"}`}>
                        {item.title}
                      </p>
                      <span className="text-xs text-gray-400 tabular-nums font-mono">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Courier / Delivery Dispatch Card */}
            {activeOrder.courier && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">
                  Courier & Delivery Agent
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block">Logistics Partner</span>
                    <span className="font-bold text-gray-800 text-sm">{activeOrder.courier.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Assigned Rider</span>
                    <span className="font-bold text-gray-800 text-sm">{activeOrder.courier.riderName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Contact Courier</span>
                    <span className="font-bold text-jumia-orange text-sm font-mono">
                      {activeOrder.courier.riderPhone}
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT: Order Summary & Customer Address (4 cols) */}
          <div className="lg:col-span-4 space-y-5">

            {/* Delivery Address Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2.5">
                Delivery Address
              </h3>
              {activeOrder.customer && (
                <div className="text-xs text-gray-600 space-y-1.5 leading-relaxed">
                  <p className="font-bold text-gray-900 text-sm">{activeOrder.customer.name}</p>
                  <p>{activeOrder.customer.address}</p>
                  <p>{activeOrder.customer.city}, {activeOrder.customer.state}</p>
                  <p className="font-mono text-gray-800 pt-1 font-semibold">
                    Phone: {activeOrder.customer.phone}
                  </p>
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                    <span>Delivery Option:</span>
                    <span className="font-bold text-gray-800">{activeOrder.deliveryMethod || "Door Delivery"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Package Contents Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2.5">
                Package Items ({activeOrder.items ? activeOrder.items.length : 0})
              </h3>

              <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
                {activeOrder.items && activeOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex-1 pr-3">
                      <p className="font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-gray-400">Qty: {item.qty || 1}</p>
                    </div>
                    <span className="font-bold text-gray-900 whitespace-nowrap">
                      ₦ {((item.qty || 1) * item.newPrice).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₦ {activeOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{activeOrder.deliveryFee === 0 ? "FREE" : `₦ ${activeOrder.deliveryFee.toLocaleString()}`}</span>
                </div>
                {activeOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount</span>
                    <span>- ₦ {activeOrder.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total Amount</span>
                  <span className="text-jumia-orange">₦ {activeOrder.grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Need Help Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => alert(`Support ticket opened for Order #${activeOrder.orderNumber}. Our representative will contact ${activeOrder.customer ? activeOrder.customer.phone : "you"} shortly.`)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2.5 rounded transition-colors cursor-pointer"
                >
                  Need Help with this Order?
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default TrackOrder
