// ============================================================
// WISHLISTDRAWER.JSX — Slide-in drawer showing wishlisted items
//
// Shows when the user clicks "Wishlist" in the header.
// Features:
//   - List of all wishlisted products
//   - Price, discount, and brand details
//   - "Add to Cart" button for each item
//   - "Remove" button to take item off wishlist
//   - Empty state when nothing is wishlisted
// ============================================================

function WishlistDrawer({ isOpen, onClose, wishlistItems = [], onRemove, onAddToCart }) {

  return (
    <>
      {/* Dark backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-[100]"
          onClick={onClose}
        />
      )}

      {/* Slide-in drawer from right */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[101] shadow-2xl flex flex-col"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-red-600">
          <div className="flex items-center gap-2">
            <span className="text-white text-lg">♡</span>
            <h2 className="text-white font-black text-base">
              Wishlist ({wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white opacity-80 hover:opacity-100 text-2xl font-light leading-none"
            aria-label="Close Wishlist"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
              <span className="text-5xl text-gray-300">♡</span>
              <p className="text-gray-600 font-bold text-base">Your wishlist is empty</p>
              <p className="text-gray-400 text-sm">
                Tap the heart icon on any product to save items you love for later.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2 bg-jumia-orange text-white font-bold rounded-full text-sm hover:bg-orange-500 transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {wishlistItems.map((item) => (
                <li key={item.id} className="flex gap-3 p-4">

                  {/* Product color block */}
                  <div
                    className="w-16 h-16 flex-shrink-0 rounded-lg flex items-center justify-center p-1"
                    style={{ background: item.cardBg || "#f3f4f6" }}
                  >
                    <span className="text-[11px] font-black text-gray-600 uppercase text-center leading-tight">
                      {item.brand || item.name.split(" ")[0]}
                    </span>
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-800 font-semibold line-clamp-2 leading-tight mb-1">
                      {item.name}
                    </p>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-black text-gray-900">
                        ₦ {item.newPrice.toLocaleString()}
                      </span>
                      {item.oldPrice > item.newPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ₦ {item.oldPrice.toLocaleString()}
                        </span>
                      )}
                      {item.discount > 0 && (
                        <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded">
                          -{item.discount}%
                        </span>
                      )}
                    </div>

                    {/* Actions: Add to Cart + Remove */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onAddToCart(item)}
                        className="bg-jumia-orange hover:bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => onRemove(item)}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium ml-auto"
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
        {wishlistItems.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4 bg-white">
            <button
              onClick={() => {
                wishlistItems.forEach((item) => onAddToCart(item))
              }}
              className="w-full bg-jumia-orange text-white font-black py-3 rounded-xl hover:bg-orange-500 transition-colors text-sm tracking-wide"
            >
              ADD ALL TO CART
            </button>
            <button
              onClick={onClose}
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

export default WishlistDrawer

