import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/UI/Layout'
import { useCheckout } from '../context/CheckoutContext'

const PAYMENT_METHODS = [
  { id: 'upi',        label: 'UPI',                  icon: '📱', desc: 'GPay, PhonePe, Paytm & more' },
  { id: 'card',       label: 'Credit / Debit Card',  icon: '💳', desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking',           icon: '🏦', desc: 'All major Indian banks' },
  { id: 'cod',        label: 'Cash on Delivery',     icon: '💵', desc: 'Pay when your order arrives' },
]

export default function PaymentPage() {
  const router = useRouter()
  const { cartItems, shippingFee, discount, subtotal, grandTotal, shippingAddress } = useCheckout()
  const [selectedMethod, setSelectedMethod] = useState('upi')
  const [isProcessing, setIsProcessing] = useState(false)
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    if (!shippingAddress) router.replace('/shipping')
  }, [shippingAddress, router])

  const handlePay = async () => {
    if (!agreed) return
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2200))
    router.push('/success')
  }

  if (!shippingAddress) return null

  return (
    <Layout currentStep={3}>
      <div className="animate-fade-up">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'Lora, Georgia, serif', color: 'var(--text-primary)' }}>
            Review & Pay
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Almost there! Confirm your order and complete payment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Delivery Address */}
            <div className="rounded-2xl border p-5 stagger-item" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold" style={{ fontFamily: 'Lora, Georgia, serif', color: 'var(--text-primary)' }}>
                  📍 Delivering to
                </h2>
                <button
                  onClick={() => router.push('/shipping')}
                  className="eco-btn text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border"
                  style={{ color: 'var(--text-muted)', background: 'var(--bg-muted)', borderColor: 'var(--border-soft)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-green)'; e.currentTarget.style.borderColor = 'var(--accent-green)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-soft)' }}
                >
                  ✏️ Edit
                </button>
              </div>
              <div className="rounded-xl p-4 text-sm space-y-1 border" style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-soft)' }}>
                <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{shippingAddress.fullName}</p>
                <p style={{ color: 'var(--text-secondary)' }}>{shippingAddress.addressLine}</p>
                <p style={{ color: 'var(--text-secondary)' }}>{shippingAddress.city}, {shippingAddress.state} — {shippingAddress.pinCode}</p>
                <p className="text-xs pt-1" style={{ color: 'var(--text-faint)' }}>
                  📧 {shippingAddress.email} · 📞 +91 {shippingAddress.phone}
                </p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="rounded-2xl border p-5 stagger-item" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)', boxShadow: 'var(--shadow-sm)', animationDelay: '60ms' }}>
              <h2 className="text-base font-bold mb-4" style={{ fontFamily: 'Lora, Georgia, serif', color: 'var(--text-primary)' }}>
                💳 Payment Method
              </h2>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(method => (
                  <label
                    key={method.id}
                    className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200"
                    style={{
                      borderColor: selectedMethod === method.id ? 'var(--accent-green)' : 'var(--border-soft)',
                      background: selectedMethod === method.id ? 'var(--bg-muted)' : 'var(--bg-card)',
                      boxShadow: selectedMethod === method.id ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    <input type="radio" name="payment" value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      style={{ accentColor: 'var(--accent-green)' }}
                    />
                    <span className="text-xl">{method.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{method.label}</p>
                      <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{method.desc}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <span
                        className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-scale-in"
                        style={{ background: 'var(--accent-green)' }}
                      >SELECTED</span>
                    )}
                  </label>
                ))}
              </div>
              {selectedMethod === 'upi' && (
                <div className="mt-3 rounded-xl p-3.5 animate-scale-in" style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)' }}>
                  <p className="text-xs font-medium" style={{ color: '#92400e' }}>
                    🔔 You'll be redirected to your UPI app to complete payment securely.
                  </p>
                </div>
              )}
            </div>

            {/* Terms */}
            <label
              className="flex items-start gap-3 cursor-pointer group rounded-2xl border p-4 stagger-item"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)', boxShadow: 'var(--shadow-sm)', animationDelay: '120ms' }}
            >
              <div className="relative mt-0.5 flex-shrink-0">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="sr-only" />
                <div
                  className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
                  style={{
                    background: agreed ? 'var(--accent-green)' : 'transparent',
                    borderColor: agreed ? 'var(--accent-green)' : 'var(--border-soft)',
                  }}
                >
                  {agreed && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                I agree to the{' '}
                <span className="underline font-medium" style={{ color: 'var(--accent-green)' }}>Terms & Conditions</span> and{' '}
                <span className="underline font-medium" style={{ color: 'var(--accent-green)' }}>Privacy Policy</span>.
                I confirm this order is for sustainable, eco-friendly products. 🌿
              </span>
            </label>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border p-5 sticky top-28" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)', boxShadow: 'var(--shadow-sm)' }}>
              <h2 className="text-base font-bold mb-4" style={{ fontFamily: 'Lora, Georgia, serif', color: 'var(--text-primary)' }}>
                🧾 Order Details
              </h2>
              <div className="space-y-3 mb-4">
                {cartItems.map(item => (
                  <div key={item.product_id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border" style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-soft)' }}>
                      <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-secondary)' }}>{item.product_name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
                      ₹{(item.product_price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2 text-sm" style={{ borderColor: 'var(--border-soft)' }}>
                <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                  <span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                  <span>Shipping</span><span>₹{shippingFee}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between" style={{ color: 'var(--accent-green)' }}>
                    <span>Discount</span><span>−₹{discount}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between" style={{ borderColor: 'var(--border-soft)' }}>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Total</span>
                  <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-center gap-1 text-xs rounded-xl py-2 border" style={{ color: 'var(--text-faint)', background: 'var(--bg-muted)', borderColor: 'var(--border-soft)' }}>
                <span>🔐 256-bit SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sticky-bar border-t" style={{ borderColor: 'var(--border-soft)', boxShadow: '0 -4px 24px rgba(0,0,0,0.08)' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="hidden sm:block text-xs">
            {!agreed && <span className="font-medium" style={{ color: '#d97706' }}>⚠ Please accept terms to continue</span>}
            {agreed && <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>✓ Ready to pay ₹{grandTotal.toLocaleString()}</span>}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => router.push('/shipping')}
              className="eco-btn btn-ghost flex-1 sm:flex-none sm:px-6 font-semibold py-3 rounded-xl text-sm"
            >← Back</button>
            <button
              onClick={handlePay}
              disabled={!agreed || isProcessing}
              className="eco-btn btn-primary flex-1 sm:flex-none sm:px-8 font-bold py-3 rounded-xl text-sm"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing…
                </span>
              ) : `🔒 Pay ₹${grandTotal.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
