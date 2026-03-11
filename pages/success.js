import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useTheme } from '../context/ThemeContext'
import { useCheckout } from '../context/CheckoutContext'

function Confetti() {
  const colors = ['#3d8a44','#5ea564','#b07a38','#d2b080','#bcdcbe','#7bbf80']
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 22 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-sm"
          style={{
            left: `${4 + i * 4.5}%`,
            top: `-${8 + (i % 5) * 8}px`,
            width: `${6 + (i % 4) * 4}px`,
            height: `${6 + (i % 3) * 4}px`,
            backgroundColor: colors[i % colors.length],
            opacity: 0.85,
            animation: `confetti-fall ${1.2 + (i % 4) * 0.3}s ease-out ${i * 0.07}s forwards`,
          }}
        />
      ))}
    </div>
  )
}

function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()
  if (!mounted) return null
  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle eco-btn"
      aria-label="Toggle dark mode"
    >
      <span className="theme-toggle-knob">{theme === 'dark' ? '🌙' : '☀️'}</span>
    </button>
  )
}

export default function SuccessPage() {
  const { cartItems, grandTotal, shippingAddress } = useCheckout()
  const [orderId] = useState(() => `ECO-${Date.now().toString().slice(-8)}`)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3500)
    return () => clearTimeout(timer)
  }, [])

  const estimatedDelivery = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 5)
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
  })()

  return (
    <div className="min-h-screen leaf-bg">
      <header className="glass-header border-b sticky top-0 z-50" style={{ borderColor: 'var(--border-soft)' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md"
              style={{ background: 'linear-gradient(135deg, var(--accent-green), var(--accent-dark))' }}
            >🌿</div>
            <span className="text-xl font-semibold" style={{ fontFamily: 'Lora, Georgia, serif', color: 'var(--text-primary)' }}>
              Ecoyaan
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="animate-fade-up">
          <div
            className="rounded-3xl border overflow-hidden relative"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)', boxShadow: 'var(--shadow-lg)' }}
          >
            {showConfetti && <Confetti />}

            {/* Green header band */}
            <div
              className="px-6 pt-10 pb-12 text-center text-white relative"
              style={{ background: 'linear-gradient(135deg, var(--accent-dark) 0%, var(--accent-green) 60%, var(--accent-light) 100%)' }}
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10" style={{ color: 'var(--accent-green)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path className="checkmark-path" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Lora, Georgia, serif' }}>
                Order Successful! 🎉
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px' }}>
                Thank you for choosing sustainability
              </p>
            </div>

            {/* Wave separator */}
            <div className="-mt-6 relative z-10">
              <svg viewBox="0 0 1200 60" xmlns="http://www.w3.org/2000/svg" className="w-full">
                <path d="M0,30 C300,60 900,0 1200,30 L1200,60 L0,60 Z" fill="var(--bg-card)" />
              </svg>
            </div>

            <div className="px-6 pb-8 -mt-4">
              {/* Order ID */}
              <div className="text-center mb-6">
                <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--text-faint)' }}>Order ID</p>
                <p className="font-mono font-bold text-lg mt-0.5" style={{ color: 'var(--text-secondary)' }}>{orderId}</p>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-xl p-4" style={{ background: 'var(--bg-muted)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-faint)' }}>Estimated Delivery</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>📅 {estimatedDelivery}</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: 'var(--bg-muted)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-faint)' }}>Amount Paid</p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>💚 ₹{grandTotal.toLocaleString()}</p>
                </div>
              </div>

              {/* Eco impact */}
              <div className="rounded-xl p-4 mb-6 border" style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-soft)' }}>
                <p className="text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>🌍 Your Eco Impact</p>
                <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: 'var(--text-muted)' }}>
                  <span>🌱 {(cartItems.length * 0.5).toFixed(1)} kg CO₂ offset</span>
                  <span>♻️ {cartItems.length} plastic-free item{cartItems.length > 1 ? 's' : ''}</span>
                  <span>🐋 0 ocean plastics</span>
                </div>
              </div>

              {/* Items */}
              {cartItems.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
                    Items Ordered
                  </p>
                  <div className="space-y-2">
                    {cartItems.map(item => (
                      <div
                        key={item.product_id}
                        className="flex items-center gap-3 rounded-xl p-3"
                        style={{ background: 'var(--bg-muted)' }}
                      >
                        <img src={item.image} alt={item.product_name} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                            {item.product_name}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Qty: {item.quantity}</p>
                        </div>
                        <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
                          ₹{(item.product_price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Address */}
              {shippingAddress && (
                <div className="mb-6 text-xs rounded-xl p-3 border" style={{ color: 'var(--text-muted)', background: 'var(--bg-muted)', borderColor: 'var(--border-soft)' }}>
                  <p className="font-semibold mb-0.5" style={{ color: 'var(--text-secondary)' }}>📦 Shipping to:</p>
                  <p>{shippingAddress.fullName} · {shippingAddress.city}, {shippingAddress.state}</p>
                  <p>Confirmation sent to: {shippingAddress.email}</p>
                </div>
              )}

              {/* CTA */}
              <Link
                href="/"
                className="eco-btn btn-primary block w-full font-semibold py-3.5 rounded-xl text-center text-sm"
              >
                Continue Shopping 🌿
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
