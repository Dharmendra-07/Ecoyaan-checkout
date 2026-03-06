import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../components/UI/Layout'
import { useCheckout } from '../context/CheckoutContext'

function Confetti() {
  const colors = ['#3d8a44', '#5ea564', '#b07a38', '#d2b080', '#bcdcbe']
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-sm"
          style={{
            left: `${5 + i * 5.5}%`,
            top: `-${10 + (i % 5) * 8}px`,
            width: `${6 + (i % 4) * 4}px`,
            height: `${6 + (i % 3) * 4}px`,
            backgroundColor: colors[i % colors.length],
            opacity: 0.8,
            animation: `confetti-fall ${1.2 + (i % 4) * 0.3}s ease-out ${i * 0.08}s forwards`,
          }}
        />
      ))}
    </div>
  )
}

export default function SuccessPage() {
  const router = useRouter()
  const { cartItems, grandTotal, shippingAddress } = useCheckout()
  const [orderId] = useState(() => `ECO-${Date.now().toString().slice(-8)}`)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const estimatedDelivery = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 5)
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
  })()

  return (
    <div className="min-h-screen leaf-bg">
      {/* Header */}
      <header className="bg-white border-b border-forest-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2">
          <div className="w-8 h-8 bg-forest-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            🌿
          </div>
          <span
            className="text-xl font-semibold text-forest-800"
            style={{ fontFamily: 'Lora, Georgia, serif' }}
          >
            Ecoyaan
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="animate-fade-up">
          {/* Success Card */}
          <div className="bg-white rounded-3xl border border-forest-100 shadow-lg overflow-hidden relative">
            {showConfetti && <Confetti />}

            {/* Green top band */}
            <div className="bg-gradient-to-r from-forest-600 to-forest-500 px-6 pt-10 pb-12 text-center text-white relative">
              {/* Animated check */}
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    className="checkmark-path"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: 'Lora, Georgia, serif' }}
              >
                Order Successful! 🎉
              </h1>
              <p className="text-forest-100 text-sm">
                Thank you for choosing sustainability
              </p>
            </div>

            {/* Wave separator */}
            <div className="-mt-6 relative z-10">
              <svg viewBox="0 0 1200 60" xmlns="http://www.w3.org/2000/svg" className="w-full">
                <path
                  d="M0,30 C300,60 900,0 1200,30 L1200,60 L0,60 Z"
                  fill="white"
                />
              </svg>
            </div>

            <div className="px-6 pb-8 -mt-4">
              {/* Order ID */}
              <div className="text-center mb-6">
                <p className="text-xs text-forest-400 uppercase tracking-widest font-semibold">Order ID</p>
                <p className="text-forest-700 font-mono font-bold text-lg mt-0.5">{orderId}</p>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-forest-50 rounded-xl p-4">
                  <p className="text-xs text-forest-400 mb-1">Estimated Delivery</p>
                  <p className="text-sm font-semibold text-forest-700">📅 {estimatedDelivery}</p>
                </div>
                <div className="bg-forest-50 rounded-xl p-4">
                  <p className="text-xs text-forest-400 mb-1">Amount Paid</p>
                  <p className="text-sm font-semibold text-forest-700">💚 ₹{grandTotal.toLocaleString()}</p>
                </div>
              </div>

              {/* Eco impact */}
              <div className="bg-gradient-to-r from-earth-50 to-forest-50 border border-forest-100 rounded-xl p-4 mb-6">
                <p className="text-xs font-bold text-forest-700 mb-2">🌍 Your Eco Impact</p>
                <div className="flex items-center gap-4 text-xs text-forest-600">
                  <span>🌱 {(cartItems.length * 0.5).toFixed(1)} kg CO₂ offset</span>
                  <span>♻️ {cartItems.length} plastic-free item{cartItems.length > 1 ? 's' : ''}</span>
                  <span>🐋 0 ocean plastics</span>
                </div>
              </div>

              {/* Items ordered */}
              {cartItems.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-forest-600 uppercase tracking-wide mb-3">
                    Items Ordered
                  </p>
                  <div className="space-y-2">
                    {cartItems.map(item => (
                      <div
                        key={item.product_id}
                        className="flex items-center gap-3 bg-forest-50 rounded-xl p-3"
                      >
                        <img
                          src={item.image}
                          alt={item.product_name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-forest-800 truncate">
                            {item.product_name}
                          </p>
                          <p className="text-xs text-forest-400">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-xs font-bold text-forest-700">
                          ₹{(item.product_price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery address */}
              {shippingAddress && (
                <div className="mb-6 text-xs text-forest-500 bg-forest-50 rounded-xl p-3">
                  <p className="font-semibold text-forest-700 mb-0.5">📦 Shipping to:</p>
                  <p>
                    {shippingAddress.fullName} · {shippingAddress.city}, {shippingAddress.state}
                  </p>
                  <p>Confirmation will be sent to: {shippingAddress.email}</p>
                </div>
              )}

              {/* CTA */}
              <Link
                href="/"
                className="eco-btn block w-full bg-forest-600 hover:bg-forest-700 text-white font-semibold py-3.5 rounded-xl text-center transition-all duration-200 shadow-md hover:shadow-lg"
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
