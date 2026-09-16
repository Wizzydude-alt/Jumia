// ============================================================
// CARTDRAWER.JSX — No icons except the cart header
// ============================================================

function CartDrawer({ isOpen, onClose, cartItems, onRemove, onUpdateQty, onCheckout }) {

  const total    = cartItems.reduce((sum, item) => sum + item.newPrice * (item.qty || 1), 0)
  const delivery = total >= 5000 ? 0 : 1500

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-[100]" onClick={onClose} />
      )}

      <div
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[101] shadow-2xl flex flex-col"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-jumia-orange">
          <h2 className="text-white font-black text-base">
            Cart ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
          </h2>
          <button onClick={onClose} className="text-white opacity-80 hover:opacity-100 text-2xl font-light leading-none">
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
              <p className="text-gray-500 font-semibold text-base">Your cart is empty</p>
              <p className="text-gray-400 text-sm">Browse our products and add items to your cart.</p>
              <button onClick={onClose}
                className="mt-2 px-6 py-2 bg-jumia-orange text-white font-bold rounded-full text-sm hover:bg-orange-500 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {cartItems.map((item, index) => (
                <li key={`${item.id}-${index}`} className="flex gap-3 p-4">
                  <div
                    className="w-16 h-16 flex-shrink-0 rounded-lg"
                    style={{ background: item.cardBg || "#f3f4f6" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-800 font-semibold line-clamp-2 leading-tight mb-1">
                      {item.name}
                    </p>
                    <p className="text-sm font-black text-jumia-orange">
                      ₦ {item.newPrice.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => onUpdateQty(index, (item.qty || 1) - 1)}
                        className="w-6 h-6 border border-gray-300 rounded text-gray-600 text-sm font-bold hover:border-jumia-orange hover:text-jumia-orange transition-colors flex items-center justify-center"
                      >−</button>
                      <span className="text-sm font-bold text-gray-900 min-w-[20px] text-center">
                        {item.qty || 1}
                      </span>
                      <button onClick={() => onUpdateQty(index, (item.qty || 1) + 1)}
                        className="w-6 h-6 border border-gray-300 rounded text-gray-600 text-sm font-bold hover:border-jumia-orange hover:text-jumia-orange transition-colors flex items-center justify-center"
                      >+</button>
                      <button onClick={() => onRemove(index)}
                        className="ml-auto text-xs text-red-400 hover:text-red-600 transition-colors font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4 bg-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-base font-black text-gray-900">₦ {total.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Delivery</span>
              <span className={`text-sm font-semibold ${delivery === 0 ? "text-green-600" : "text-gray-700"}`}>
                {delivery === 0 ? "FREE" : `₦ ${delivery.toLocaleString()}`}
              </span>
            </div>
            <button
              onClick={() => { onClose(); onCheckout() }}
              className="w-full bg-jumia-orange text-white font-black py-3 rounded-xl hover:bg-orange-500 transition-colors text-sm tracking-wide"
            >
              PROCEED TO CHECKOUT
            </button>
            <button onClick={onClose}
              className="w-full mt-2 text-sm text-gray-500 hover:text-jumia-orange transition-colors py-1"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDrawer
