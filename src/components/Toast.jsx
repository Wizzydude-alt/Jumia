// ============================================================
// TOAST.JSX — Slide-in notification (no icons)
// ============================================================

function Toast({ message, type = "cart" }) {
  if (!message) return null

  const bg = type === "wishlist" ? "#ef4444" : type === "info" ? "#F68B1E" : "#22c55e"

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-semibold"
      style={{ background: bg, animation: "slideInRight 0.3s ease-out", minWidth: 220 }}
    >
      {message}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

export default Toast
