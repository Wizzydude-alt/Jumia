// ============================================================
// FOOTER.JSX — Full site footer matching Jumia Nigeria
//
// Sections:
//   1. Four link columns (Help, About, Make Money, International)
//   2. Payment methods row
//   3. App download badges
//   4. Copyright bar
// ============================================================

function Footer() {

  const columns = [
    {
      title: "Let Us Help You",
      links: [
        "Help Center",
        "How to Shop on Jumia",
        "Track an Order",
        "Report a Product",
        "Returns & Refunds",
        "Contact Us",
        "Store Locator",
      ],
    },
    {
      title: "About Jumia",
      links: [
        "About Us",
        "Jumia Careers",
        "Jumia Press",
        "Jumia Affiliates",
        "Our Commitments",
        "Partner with Jumia",
        "Privacy Policy",
      ],
    },
    {
      title: "Make Money with Jumia",
      links: [
        "Sell on Jumia",
        "Become a JForce Agent",
        "Jumia Delivery Service",
        "Advertise on Jumia",
        "Jumia Global Store",
        "Jumia Pay",
      ],
    },
    {
      title: "Jumia International",
      links: [
        "Jumia Ghana",
        "Jumia Kenya",
        "Jumia Egypt",
        "Jumia Ivory Coast",
        "Jumia Morocco",
        "Jumia Algeria",
        "Jumia Senegal",
      ],
    },
  ]

  const paymentMethods = [
    { label: "VISA", color: "#1a1f71" },
    { label: "MC", color: "#eb001b" },
    { label: "PayPal", color: "#003087" },
    { label: "GTB", color: "#f68b1e" },
    { label: "Access", color: "#e31837" },
    { label: "Cash", color: "#2e7d32" },
  ]

  return (
    <footer className="bg-white mt-8 border-t border-gray-200">

      {/* ── Top strip: app download + social ── */}
      <div className="bg-jumia-orange py-4 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="text-white">
            <p className="font-black text-lg">Shop on the go!</p>
            <p className="text-sm opacity-90">Download the Jumia app for exclusive deals</p>
          </div>
          <div className="flex gap-3">
            {/* App Store badge */}
            <div className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-900 transition-colors">
              <span className="text-xl"></span>
              <div>
                <p className="text-xs opacity-70 leading-none">Download on the</p>
                <p className="text-sm font-bold leading-tight">App Store</p>
              </div>
            </div>
            {/* Google Play badge */}
            <div className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-900 transition-colors">
              <span className="text-xl">▶</span>
              <div>
                <p className="text-xs opacity-70 leading-none">Get it on</p>
                <p className="text-sm font-bold leading-tight">Google Play</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Four link columns ── */}
      <div className="max-w-screen-xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wide">
              {col.title}
            </h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-jumia-orange transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-gray-100" />

      {/* ── Payment methods ── */}
      <div className="max-w-screen-xl mx-auto px-6 py-6">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-4">
          Accepted Payment Methods
        </p>
        <div className="flex flex-wrap gap-3">
          {paymentMethods.map((pm) => (
            <div
              key={pm.label}
              className="px-3 py-1.5 border border-gray-200 rounded text-xs font-bold tracking-wide"
              style={{ color: pm.color }}
            >
              {pm.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom copyright bar ── */}
      <div className="bg-gray-900 py-4 px-6 text-center space-y-1.5">
        <p className="text-gray-400 text-xs">
          © {new Date().getFullYear()} Jumia Nigeria · All rights reserved ·{" "}
          <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>{" "}
          ·{" "}
          <a href="#" className="hover:text-orange-400 transition-colors">Terms of Use</a>
        </p>
        <p className="text-xs font-bold text-jumia-orange tracking-wider uppercase">
          Designed by W!SDOM :)
        </p>
      </div>

    </footer>
  )
}

export default Footer

