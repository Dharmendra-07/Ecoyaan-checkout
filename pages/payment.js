import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/UI/Layout'
import { useCheckout } from '../context/CheckoutContext'

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: '📱', desc: 'Pay via GPay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major Indian banks' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
]

export default function PaymentPage() {
  const router = useRouter()
  const { cartItems, shippingFee, discount, subtotal, grandTotal, shippingAddress } = useCheckout()
  const [selectedMethod, setSelectedMethod] = useState('upi')
  const [isProcessing, setIsProcessing] = useState(false)
  const [agreed, setAgreed] = useState(false)

  // Redirect if no address
  useEffect(() => {
    if (!shippingAddress) {
      router.replace('/shipping')
    }
  }, [shippingAddress, router])

  const handlePay = async () => {
    if (!agreed) return
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2200))
    router.push('/success')
  }

  if (!shippingAddress) return null

  return (
    <Layout currentStep={3}>
      <div className="animate-fade-up">
        <div className="mb-6">
          <h1
            className="text-2xl sm:text-3xl font-bold text-forest-800"
            style={{ fontFamily: 'Lora, Georgia, serif' }}
          >
            Review & Pay
          </h1>
          <p className="text-forest-500 text-sm mt-1">
            Almost there! Confirm your order and complete payment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Payment Method + Address Review */}
          <div className="lg:col-span-2 space-y-5">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-forest-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2
                  className="text-base font-bold text-forest-800"
                  style={{ fontFamily: 'Lora, Georgia, serif' }}
                >
                  📍 Delivering to
                </h2>
                <button
                  onClick={() => router.push('/shipping')}
                  className="text-xs text-forest-500 hover:text-forest-700 underline transition-colors"
                >
                  Edit
                </button>
              </div>
              <div className="bg-forest-50 rounded-xl p-4 text-sm text-forest-700 space-y-0.5">
                <p className="font-semibold text-forest-800">{shippingAddress.fullName}</p>
                <p>{shippingAddress.addressLine}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} — {shippingAddress.pinCode}</p>
                <p className="text-forest-500 pt-1">
                  📧 {shippingAddress.email} · 📞 +91 {shippingAddress.phone}
                </p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl border border-forest-100 p-5">
              <h2
                className="text-base font-bold text-forest-800 mb-4"
                style={{ fontFamily: 'Lora, Georgia, serif' }}
              >
                💳 Payment Method
              </h2>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(method => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                      ${selectedMethod === method.id
                        ? 'border-forest-500 bg-forest-50'
                        : 'border-forest-100 hover:border-forest-200 bg-white'
                      }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={() => setSelectedMethod(method.id)}
                      className="accent-forest-600"
                    />
                    <span className="text-xl">{method.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-forest-800">{method.label}</p>
                      <p className="text-xs text-forest-400">{method.desc}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <span className="ml-auto bg-forest-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        SELECTED
                      </span>
                    )}
                  </label>
                ))}
              </div>

              {/* UPI hint */}
              {selectedMethod === 'upi' && (
                <div className="mt-3 bg-earth-50 border border-earth-200 rounded-xl p-3">
                  <p className="text-xs text-earth-700 font-medium">
                    🔔 You'll be redirected to your UPI app to complete the payment securely.
                  </p>
                </div>
              )}
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                    ${agreed ? 'bg-forest-600 border-forest-600' : 'border-forest-300 group-hover:border-forest-400'}`}
                >
                  {agreed && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-forest-500 leading-relaxed">
                I agree to the{' '}
                <span className="text-forest-700 underline">Terms & Conditions</span> and{' '}
                <span className="text-forest-700 underline">Privacy Policy</span>.
                I confirm this order is for sustainable, eco-friendly products. 🌿
              </span>
            </label>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-forest-100 p-5 sticky top-28">
              <h2
                className="text-base font-bold text-forest-800 mb-4"
                style={{ fontFamily: 'Lora, Georgia, serif' }}
              >
                🧾 Order Details
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {cartItems.map(item => (
                  <div key={item.product_id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-forest-50">
                      <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-forest-700 truncate">{item.product_name}</p>
                      <p className="text-xs text-forest-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-forest-800 flex-shrink-0">
                      ₹{(item.product_price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="border-t border-forest-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-forest-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-forest-600">
                  <span>Shipping</span>
                  <span>₹{shippingFee}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-forest-500">
                    <span>Discount</span>
                    <span>−₹{discount}</span>
                  </div>
                )}
                <div className="border-t border-forest-100 pt-2 flex justify-between">
                  <span className="font-bold text-forest-800">Total</span>
                  <span className="font-bold text-forest-800 text-lg">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePay}
                disabled={!agreed || isProcessing}
                className={`eco-btn w-full mt-4 font-bold py-4 rounded-xl text-white transition-all duration-200 text-sm
                  ${agreed && !isProcessing
                    ? 'bg-forest-600 hover:bg-forest-700 shadow-md hover:shadow-lg'
                    : 'bg-forest-200 cursor-not-allowed'
                  }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `🔒 Pay ₹${grandTotal.toLocaleString()} Securely`
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-forest-400">
                <span>🔐 256-bit SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back button */}
        <div className="mt-4">
          <button
            onClick={() => router.push('/shipping')}
            className="text-sm text-forest-500 hover:text-forest-700 transition-colors"
          >
            ← Back to Shipping
          </button>
        </div>
      </div>
    </Layout>
  )
}
