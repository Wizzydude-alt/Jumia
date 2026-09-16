// ============================================================
// CHECKOUTPAGE.JSX — Professional Jumia Nigeria Checkout
//
// Features:
//   - 2-Column realistic e-commerce checkout layout
//   - Step 1: Customer Address & Contact Information (Nigerian States & Cities)
//   - Step 2: Delivery Method (Door Delivery vs. Pickup Station)
//   - Step 3: Payment Method (featuring Paystack as primary)
//   - Voucher / Promo code system (try code: JUMIA2026 or SAVE10)
//   - Interactive Paystack Gateway Modal (Card, Bank Transfer, USSD)
//   - Comprehensive Order Summary with breakdown
//   - Professional Order Receipt & Confirmation Screen
// ============================================================

import { useState } from "react"
import { NIGERIAN_STATES, NIGERIAN_LOCATIONS } from "../nigeriaLocations"

function CheckoutPage({ cartItems = [], user, onBack, onPlaceOrder, onTrackOrder }) {

  // ── Delivery & Customer State ──
  const [isCustomCity, setIsCustomCity] = useState(false)
  const [form, setForm] = useState({
    name: user ? user.name : "",
    email: user ? user.email : "",
    phone: "",
    altPhone: "",
    address: "",
    state: "Lagos",
    city: "Ikeja",
  })
  const [errors, setErrors] = useState({})

  // ── Shipping Method ──
  const [deliveryMethod, setDeliveryMethod] = useState("door")

  // ── Payment Selection ──
  const [paymentMethod, setPaymentMethod] = useState("paystack")

  // ── Voucher / Promo Code ──
  const [voucherInput, setVoucherInput] = useState("")
  const [discountAmount, setDiscountAmount] = useState(0)
  const [voucherApplied, setVoucherApplied] = useState(false)
  const [voucherError, setVoucherError] = useState("")

  // ── Paystack Modal State ──
  const [showPaystackModal, setShowPaystackModal] = useState(false)
  const [paystackChannel, setPaystackChannel] = useState("card") // "card" | "transfer" | "ussd"
  const [paystackCard, setPaystackCard] = useState({ number: "", expiry: "", cvv: "" })
  const [paystackBank, setPaystackBank] = useState("GTBank")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [transactionRef, setTransactionRef] = useState("")

  // ── Final Placed Order Receipt State ──
  const [placedOrder, setPlacedOrder] = useState(null)

  // Calculate pricing
  const subtotal = cartItems.reduce((sum, item) => sum + item.newPrice * (item.qty || 1), 0)
  const deliveryFee = deliveryMethod === "pickup"
    ? 800
    : (subtotal >= 10000 ? 0 : 1500)
  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount)

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  function handleStateChange(newState) {
    const areas = NIGERIAN_LOCATIONS[newState] || []
    const defaultCity = areas[0] || ""
    setIsCustomCity(false)
    setForm((prev) => ({
      ...prev,
      state: newState,
      city: defaultCity,
    }))
    if (errors.state) setErrors((prev) => ({ ...prev, state: "" }))
    if (errors.city) setErrors((prev) => ({ ...prev, city: "" }))
  }


  function handleApplyVoucher(e) {
    e.preventDefault()
    setVoucherError("")
    const code = voucherInput.trim().toUpperCase()
    if (!code) return

    if (code === "JUMIA2026" || code === "SAVE10" || code === "JUMIA") {
      const discount = Math.round(subtotal * 0.1) // 10% discount
      setDiscountAmount(discount)
      setVoucherApplied(true)
    } else {
      setVoucherError("Invalid or expired coupon code")
    }
  }

  function validate() {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = "Full name is required"
    if (!form.email.trim()) newErrors.email = "Email address is required"
    if (!form.phone.trim()) newErrors.phone = "Phone number is required"
    if (!form.address.trim()) newErrors.address = "Delivery address is required"
    if (!form.state) newErrors.state = "State is required"
    if (!form.city.trim()) newErrors.city = "City is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleInitiateCheckout() {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    if (paymentMethod === "paystack") {
      setShowPaystackModal(true)
    } else {
      completeOrderPlacement("Confirmed — Pay on Delivery")
    }
  }

  function completeOrderPlacement(statusNote) {
    const orderNumber = "JUM-" + Math.floor(100000 + Math.random() * 900000)
    const ref = "PSTK_" + Math.random().toString(36).substring(2, 10).toUpperCase()

    const orderData = {
      orderNumber,
      transactionRef: ref,
      items: [...cartItems],
      subtotal,
      deliveryFee,
      discountAmount,
      grandTotal,
      customer: { ...form },
      paymentMethod,
      deliveryMethod,
      date: new Date().toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      status: statusNote || "Payment Successful",
    }

    setPlacedOrder(orderData)
    if (onPlaceOrder) {
      onPlaceOrder(orderData)
    }
  }

  function handlePaystackSubmit(e) {
    e.preventDefault()
    setIsProcessingPayment(true)

    setTimeout(() => {
      setIsProcessingPayment(false)
      setPaymentSuccess(true)
      const ref = "PSTK_" + Math.random().toString(36).substring(2, 10).toUpperCase()
      setTransactionRef(ref)

      setTimeout(() => {
        setShowPaystackModal(false)
        completeOrderPlacement("Paid via Paystack")
      }, 1500)
    }, 2000)
  }

  // ════════════════════════════════════════════════════════════
  // 1. ORDER RECEIPT SCREEN
  // ════════════════════════════════════════════════════════════
  if (placedOrder) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">

          <div className="bg-jumia-orange p-6 text-white text-center">
            <h1 className="text-2xl font-black mb-1">Order Confirmed!</h1>
            <p className="text-sm opacity-90">Thank you for shopping on Jumia Nigeria</p>
            <div className="inline-block mt-3 bg-white text-jumia-orange font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
              Order #{placedOrder.orderNumber}
            </div>
          </div>

          <div className="p-6 space-y-6">

            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 text-sm flex items-center justify-between">
              <div>
                <p className="font-bold">Payment Status: {placedOrder.status}</p>
                <p className="text-xs text-green-700 mt-0.5">Reference: {placedOrder.transactionRef}</p>
              </div>
              <span className="text-xs font-semibold bg-green-200 text-green-900 px-2 py-1 rounded">
                Verified
              </span>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
                Delivery Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                <p><span className="font-medium text-gray-800">Recipient:</span> {placedOrder.customer.name}</p>
                <p><span className="font-medium text-gray-800">Phone:</span> {placedOrder.customer.phone}</p>
                <p className="sm:col-span-2">
                  <span className="font-medium text-gray-800">Address:</span> {placedOrder.customer.address}, {placedOrder.customer.city}, {placedOrder.customer.state}
                </p>
                <p><span className="font-medium text-gray-800">Method:</span> {placedOrder.deliveryMethod === "door" ? "Door Delivery" : "Pickup Station"}</p>
                <p><span className="font-medium text-gray-800">Est. Delivery:</span> 2 - 4 Business Days</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
                Items Purchased ({placedOrder.items.length})
              </h3>
              <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1">
                {placedOrder.items.map((item, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between text-sm">
                    <div className="flex-1 pr-4">
                      <p className="font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.qty || 1} × ₦ {item.newPrice.toLocaleString()}</p>
                    </div>
                    <p className="font-bold text-gray-900">
                      ₦ {((item.qty || 1) * item.newPrice).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₦ {placedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Fee</span>
                  <span>{placedOrder.deliveryFee === 0 ? "FREE" : `₦ ${placedOrder.deliveryFee.toLocaleString()}`}</span>
                </div>
                {placedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount Voucher</span>
                    <span>- ₦ {placedOrder.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total Paid</span>
                  <span className="text-jumia-orange">₦ {placedOrder.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                onClick={() => onTrackOrder && onTrackOrder(placedOrder.orderNumber)}
                className="w-full bg-jumia-orange hover:bg-orange-500 text-white font-bold py-3.5 rounded-lg transition-colors cursor-pointer text-sm shadow-md flex items-center justify-center gap-2"
              >
                Track This Order Live →
              </button>
              <button
                onClick={onBack}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition-colors cursor-pointer text-xs"
              >
                Continue Shopping on Jumia
              </button>
            </div>

          </div>
        </div>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════
  // 2. MAIN CHECKOUT PAGE
  // ════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-jumia-orange text-xs sm:text-sm font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              ← Back to Shopping
            </button>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1">
              <span className="font-black text-gray-900 text-lg sm:text-xl tracking-tight">JUMIA</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase text-gray-400 ml-1 hidden sm:inline">Secure Checkout</span>
            </div>
          </div>

          <div className="text-xs text-gray-500 hidden md:block">
            Need Help? Call <span className="font-bold text-gray-800">0201 888 1106</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: Checkout Steps (8 cols) */}
          <div className="lg:col-span-8 space-y-5">

            {/* STEP 1: CUSTOMER ADDRESS */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-jumia-orange text-white text-xs font-black flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                    Customer & Delivery Address
                  </h2>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      placeholder="e.g. Babatunde Adeleke"
                      className={`w-full border rounded px-3 py-2 text-sm text-gray-800 outline-none focus:border-jumia-orange ${
                        errors.name ? "border-red-400 bg-red-50" : "border-gray-300"
                      }`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      placeholder="e.g. adeleke@gmail.com"
                      className={`w-full border rounded px-3 py-2 text-sm text-gray-800 outline-none focus:border-jumia-orange ${
                        errors.email ? "border-red-400 bg-red-50" : "border-gray-300"
                      }`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                      placeholder="e.g. 0803 123 4567"
                      className={`w-full border rounded px-3 py-2 text-sm text-gray-800 outline-none focus:border-jumia-orange ${
                        errors.phone ? "border-red-400 bg-red-50" : "border-gray-300"
                      }`}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  {/* Additional Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Additional Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={form.altPhone}
                      onChange={(e) => updateForm("altPhone", e.target.value)}
                      placeholder="e.g. 0901 987 6543"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 outline-none focus:border-jumia-orange"
                    />
                  </div>

                  {/* Delivery Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Delivery Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => updateForm("address", e.target.value)}
                      placeholder="Street address, building name, apartment / suite number"
                      className={`w-full border rounded px-3 py-2 text-sm text-gray-800 outline-none focus:border-jumia-orange ${
                        errors.address ? "border-red-400 bg-red-50" : "border-gray-300"
                      }`}
                    />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      State / Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.state}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 outline-none focus:border-jumia-orange bg-white"
                    >
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-gray-700">
                        City / Area <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const nextState = !isCustomCity
                          setIsCustomCity(nextState)
                          if (nextState) {
                            setForm((prev) => ({ ...prev, city: "" }))
                          } else {
                            const defaultArea = (NIGERIAN_LOCATIONS[form.state] || [])[0] || ""
                            setForm((prev) => ({ ...prev, city: defaultArea }))
                          }
                        }}
                        className="text-[11px] text-jumia-orange hover:text-orange-600 font-semibold cursor-pointer underline"
                      >
                        {isCustomCity ? "Choose from list" : "+ Other area"}
                      </button>
                    </div>

                    {isCustomCity ? (
                      <div>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => updateForm("city", e.target.value)}
                          placeholder={`Enter area or town in ${form.state}`}
                          className={`w-full border rounded px-3 py-2 text-sm text-gray-800 outline-none focus:border-jumia-orange ${
                            errors.city ? "border-red-400 bg-red-50" : "border-gray-300"
                          }`}
                          autoFocus
                        />
                        <p className="text-[11px] text-gray-400 mt-1">
                          Type your town, LGA, estate, or neighborhood in {form.state}
                        </p>
                      </div>
                    ) : (
                      <select
                        value={form.city}
                        onChange={(e) => {
                          if (e.target.value === "__CUSTOM__") {
                            setIsCustomCity(true)
                            setForm((prev) => ({ ...prev, city: "" }))
                          } else {
                            updateForm("city", e.target.value)
                          }
                        }}
                        className={`w-full border rounded px-3 py-2 text-sm text-gray-800 outline-none focus:border-jumia-orange bg-white ${
                          errors.city ? "border-red-400 bg-red-50" : "border-gray-300"
                        }`}
                      >
                        <option value="" disabled>Select Area / LGA in {form.state}</option>
                        {(NIGERIAN_LOCATIONS[form.state] || []).map((area) => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                        <option value="__CUSTOM__">+ Other (Type custom area)...</option>
                      </select>
                    )}
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>

                </div>
              </div>
            </div>

            {/* STEP 2: DELIVERY METHOD */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-5 py-3.5 border-b border-gray-200 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-jumia-orange text-white text-xs font-black flex items-center justify-center">
                  2
                </span>
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                  Delivery Method
                </h2>
              </div>

              <div className="p-5 space-y-3">
                <label
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    deliveryMethod === "door"
                      ? "border-jumia-orange bg-orange-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="door"
                    checked={deliveryMethod === "door"}
                    onChange={() => setDeliveryMethod("door")}
                    className="mt-1 accent-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-900">Door Delivery</p>
                      <span className="text-xs font-bold text-gray-800">
                        {subtotal >= 10000 ? "FREE" : "₦ 1,500"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Delivered directly to your door within 2 - 4 business days.
                    </p>
                    {subtotal >= 10000 && (
                      <span className="inline-block mt-1 text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                        Qualified for Free Shipping
                      </span>
                    )}
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    deliveryMethod === "pickup"
                      ? "border-jumia-orange bg-orange-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="pickup"
                    checked={deliveryMethod === "pickup"}
                    onChange={() => setDeliveryMethod("pickup")}
                    className="mt-1 accent-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-900">Pickup Station</p>
                      <span className="text-xs font-bold text-gray-800">₦ 800</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Collect at a designated Jumia Hub in {form.city || "your area"} at your convenience.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* STEP 3: PAYMENT METHOD */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-jumia-orange text-white text-xs font-black flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                    Payment Method
                  </h2>
                </div>
                <span className="text-xs font-semibold text-gray-400">
                  Secured & Encrypted
                </span>
              </div>

              <div className="p-5 space-y-3">

                {/* PAYSTACK */}
                <label
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "paystack"
                      ? "border-jumia-orange bg-orange-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paystack"
                    checked={paymentMethod === "paystack"}
                    onChange={() => setPaymentMethod("paystack")}
                    className="mt-1 accent-orange-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-gray-900">
                          Paystack Payment Gateway
                        </p>
                        <span className="text-[10px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full uppercase">
                          Recommended
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                        <span className="px-1.5 py-0.5 border border-gray-300 rounded text-[10px]">Mastercard</span>
                        <span className="px-1.5 py-0.5 border border-gray-300 rounded text-[10px]">VISA</span>
                        <span className="px-1.5 py-0.5 border border-gray-300 rounded text-[10px]">Verve</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Instant and secure payment using your Debit Card, Bank Transfer, USSD, or QR Code.
                    </p>
                  </div>
                </label>

                {/* Pay on Delivery */}
                <label
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "cash"
                      ? "border-jumia-orange bg-orange-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                    className="mt-1 accent-orange-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">Pay on Delivery</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Pay cash or via POS machine when the rider delivers your package.
                    </p>
                  </div>
                </label>

                {/* Direct Bank Transfer */}
                <label
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "bank_transfer"
                      ? "border-jumia-orange bg-orange-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={() => setPaymentMethod("bank_transfer")}
                    className="mt-1 accent-orange-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">Direct Bank Transfer</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Send payment directly from your banking mobile app or internet banking.
                    </p>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sticky top-20 space-y-4">

              <h2 className="text-sm font-bold text-gray-900 uppercase border-b border-gray-100 pb-3">
                Order Summary ({cartItems.length} {cartItems.length === 1 ? "Item" : "Items"})
              </h2>

              <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto pr-1">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-gray-400">Qty: {item.qty || 1}</p>
                    </div>
                    <span className="font-bold text-gray-900 whitespace-nowrap">
                      ₦ {((item.qty || 1) * item.newPrice).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Voucher Code Form */}
              <form onSubmit={handleApplyVoucher} className="border-t border-gray-100 pt-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    placeholder="Coupon code (e.g. JUMIA2026)"
                    disabled={voucherApplied}
                    className="flex-1 border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-jumia-orange uppercase"
                  />
                  <button
                    type="submit"
                    disabled={voucherApplied}
                    className="bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-bold text-xs px-3 py-1.5 rounded transition-colors cursor-pointer"
                  >
                    {voucherApplied ? "Applied" : "Apply"}
                  </button>
                </div>
                {voucherError && <p className="text-xs text-red-500 mt-1">{voucherError}</p>}
                {voucherApplied && (
                  <p className="text-xs text-green-600 font-semibold mt-1">
                    Coupon applied! 10% discount subtracted.
                  </p>
                )}
              </form>

              {/* Breakdown */}
              <div className="border-t border-gray-100 pt-3 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₦ {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Amount</span>
                  <span className={`font-bold ${deliveryFee === 0 ? "text-green-600" : "text-gray-900"}`}>
                    {deliveryFee === 0 ? "FREE" : `₦ ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Discount</span>
                    <span>- ₦ {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900">Total</span>
                  <span className="text-lg font-black text-jumia-orange">
                    ₦ {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleInitiateCheckout}
                className="w-full bg-jumia-orange hover:bg-orange-500 text-white font-bold py-3.5 rounded-lg shadow-md transition-all cursor-pointer text-sm tracking-wide"
              >
                {paymentMethod === "paystack"
                  ? `PAY WITH PAYSTACK (₦ ${grandTotal.toLocaleString()})`
                  : "CONFIRM ORDER"}
              </button>

              <div className="border-t border-gray-100 pt-3 space-y-1.5 text-[11px] text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700">✓</span>
                  <span>Paystack 256-bit SSL Secure Bank Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700">✓</span>
                  <span>Free Return & Refund within 7 Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700">✓</span>
                  <span>100% Genuine and Verified Products</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ════════════════════════════════════════════════════════════
          3. PAYSTACK PAYMENT GATEWAY MODAL
      ════════════════════════════════════════════════════════════ */}
      {showPaystackModal && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-100">

            {/* Paystack Top Branding Bar */}
            <div className="bg-[#092c4c] px-4 sm:px-6 py-3 sm:py-4 text-white flex items-center justify-between flex-shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black tracking-wider text-cyan-400 text-base sm:text-lg">paystack</span>
                  <span className="text-xs text-gray-300 font-medium">| Checkout</span>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-300 mt-0.5">Paying Jumia Nigeria</p>
              </div>

              <div className="text-right">
                <p className="text-base sm:text-lg font-black text-white">₦ {grandTotal.toLocaleString()}</p>
                <p className="text-[11px] text-gray-300 truncate max-w-[120px] sm:max-w-[150px]">{form.email}</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">

              {paymentSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Payment Successful!</h3>
                  <p className="text-xs text-gray-500">
                    Ref: <span className="font-mono text-gray-700">{transactionRef}</span>
                  </p>
                  <p className="text-xs text-gray-400">Finalizing your order...</p>
                </div>
              ) : isProcessingPayment ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <h3 className="text-sm font-bold text-gray-800">Processing Payment...</h3>
                  <p className="text-xs text-gray-500">Please do not refresh or close this window.</p>
                </div>
              ) : (
                <div>

                  {/* Channel Switcher Tabs */}
                  <div className="flex border-b border-gray-200 mb-5">
                    {[
                      { id: "card", label: "Pay with Card" },
                      { id: "transfer", label: "Bank Transfer" },
                      { id: "ussd", label: "USSD" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPaystackChannel(tab.id)}
                        className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                          paystackChannel === tab.id
                            ? "border-cyan-500 text-cyan-600 bg-cyan-50/40"
                            : "border-transparent text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* TAB 1: CARD PAYMENT */}
                  {paystackChannel === "card" && (
                    <form onSubmit={handlePaystackSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          CARD NUMBER
                        </label>
                        <input
                          type="text"
                          required
                          maxLength="19"
                          placeholder="5399 0000 0000 0000"
                          value={paystackCard.number}
                          onChange={(e) => setPaystackCard({ ...paystackCard, number: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono tracking-wider outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            CARD EXPIRY
                          </label>
                          <input
                            type="text"
                            required
                            maxLength="5"
                            placeholder="MM / YY"
                            value={paystackCard.expiry}
                            onChange={(e) => setPaystackCard({ ...paystackCard, expiry: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono outline-none focus:border-cyan-500 text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            required
                            maxLength="4"
                            placeholder="123"
                            value={paystackCard.cvv}
                            onChange={(e) => setPaystackCard({ ...paystackCard, cvv: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono outline-none focus:border-cyan-500 text-center"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-2 bg-[#0ba4db] hover:bg-[#0993c5] text-white font-bold py-3 rounded text-sm transition-colors cursor-pointer shadow"
                      >
                        Pay ₦ {grandTotal.toLocaleString()}
                      </button>
                    </form>
                  )}

                  {/* TAB 2: BANK TRANSFER */}
                  {paystackChannel === "transfer" && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center space-y-1">
                        <p className="text-xs text-gray-500">Transfer exactly this amount to:</p>
                        <p className="text-xl font-black text-gray-900">₦ {grandTotal.toLocaleString()}</p>
                        <div className="pt-2">
                          <p className="text-xs font-bold text-gray-600">Bank Name</p>
                          <p className="text-sm font-extrabold text-gray-800">Wema Bank / Paystack</p>
                        </div>
                        <div className="pt-1">
                          <p className="text-xs font-bold text-gray-600">Account Number</p>
                          <p className="text-lg font-mono font-black text-cyan-700 tracking-wider">
                            9920 481 029
                          </p>
                        </div>
                        <p className="text-[11px] text-gray-400 pt-1">Account expires in 30:00 minutes</p>
                      </div>

                      <button
                        type="button"
                        onClick={handlePaystackSubmit}
                        className="w-full bg-[#0ba4db] hover:bg-[#0993c5] text-white font-bold py-3 rounded text-sm transition-colors cursor-pointer"
                      >
                        I have sent the money
                      </button>
                    </div>
                  )}

                  {/* TAB 3: USSD */}
                  {paystackChannel === "ussd" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Choose your bank to generate code
                        </label>
                        <select
                          value={paystackBank}
                          onChange={(e) => setPaystackBank(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white outline-none focus:border-cyan-500"
                        >
                          <option value="GTBank">Guaranty Trust Bank (*737#)</option>
                          <option value="Zenith">Zenith Bank (*966#)</option>
                          <option value="Access">Access Bank (*901#)</option>
                          <option value="UBA">UBA (*919#)</option>
                          <option value="Fidelity">Fidelity Bank (*770#)</option>
                          <option value="FirstBank">First Bank (*894#)</option>
                        </select>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center">
                        <p className="text-xs text-gray-500 mb-1">Dial this code on your mobile phone:</p>
                        <p className="text-base font-mono font-black text-gray-900 tracking-wider">
                          *737*50*3564#
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handlePaystackSubmit}
                        className="w-full bg-[#0ba4db] hover:bg-[#0993c5] text-white font-bold py-3 rounded text-sm transition-colors cursor-pointer"
                      >
                        I have dialed the code
                      </button>
                    </div>
                  )}

                </div>
              )}

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={() => setShowPaystackModal(false)}
                  className="hover:text-gray-700 cursor-pointer font-medium"
                >
                  Cancel payment
                </button>
                <div className="flex items-center gap-1">
                  <span>Secured by</span>
                  <span className="font-bold text-gray-600">paystack</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default CheckoutPage
