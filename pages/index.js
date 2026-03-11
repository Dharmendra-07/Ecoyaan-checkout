import { useRouter } from 'next/router'
import Layout from '../components/UI/Layout'
import { useCheckout } from '../context/CheckoutContext'

function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div
      className="product-card rounded-2xl p-4 sm:p-5 flex gap-4 stagger-item"
      style={{ borderRadius: '16px' }}
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden" style={{ background: 'var(--bg-muted)' }}>
        <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
        {item.badge && (
          <span className="absolute top-1 left-1 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm"
            style={{ background: 'var(--accent-dark)' }}>
            {item.badge}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-sm sm:text-base leading-snug" style={{ fontFamily: 'Lora, Georgia, serif', color: 'var(--text-primary)' }}>
              {item.product_name}
            </h3>
            {item.description && (
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-faint)' }}>{item.description}</p>
            )}
          </div>
          <button
            onClick={() => onRemove(item.product_id)}
            className="eco-btn flex-shrink-0 p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-faint)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-faint)'; e.currentTarget.style.background = 'transparent' }}
            aria-label="Remove item"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 p-1 rounded-xl border" style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-soft)' }}>
            <button
              onClick={() => onUpdateQty(item.product_id, item.quantity - 1)}
              className="eco-btn w-7 h-7 rounded-lg flex items-center justify-center font-bold text-base"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)', color: 'var(--accent-green)' }}
            >−</button>
            <span className="w-7 text-center text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.quantity}</span>
            <button
              onClick={() => onUpdateQty(item.product_id, item.quantity + 1)}
              className="eco-btn w-7 h-7 rounded-lg flex items-center justify-center font-bold text-base"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)', color: 'var(--accent-green)' }}
            >+</button>
          </div>
          <div className="text-right">
            <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>₹{(item.product_price * item.quantity).toLocaleString()}</p>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>₹{item.product_price.toLocaleString()} each</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CartPage() {
  const router = useRouter()
  const { cartItems, shippingFee, discount, subtotal, grandTotal, updateQuantity, removeItem } = useCheckout()

  return (
    <Layout currentStep={1}>
      <div className="animate-fade-up">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'Lora, Georgia, serif', color: 'var(--text-primary)' }}>
            Your Cart
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} ready for checkout
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 animate-scale-in">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl"
              style={{ background: 'var(--bg-muted)' }}>🛒</div>
            <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Lora, Georgia, serif', color: 'var(--text-secondary)' }}>
              Your cart is empty
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-faint)' }}>Start shopping for eco-friendly products!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-3 border animate-slide-in"
                style={{ background: 'linear-gradient(to right, var(--bg-muted), var(--bg-elevated))', borderColor: 'var(--border-soft)' }}
              >
                <span className="text-lg">🌱</span>
                <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Your purchase offsets{' '}
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                    {(cartItems.length * 0.5).toFixed(1)} kg
                  </span>{' '}
                  of CO₂ emissions
                </p>
              </div>
              {cartItems.map(item => (
                <CartItem key={item.product_id} item={item} onUpdateQty={updateQuantity} onRemove={removeItem} />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div
                className="rounded-2xl border p-5 sticky top-28 animate-slide-in"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)', boxShadow: 'var(--shadow-sm)' }}
              >
                <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'Lora, Georgia, serif', color: 'var(--text-primary)' }}>
                  Order Summary
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between" style={{ color: 'var(--text-secondary)' }}>
                    <span>Shipping</span>
                    <span className="font-semibold">₹{shippingFee}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                      <span>Discount</span>
                      <span className="font-semibold" style={{ color: 'var(--accent-green)' }}>−₹{discount}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between" style={{ borderColor: 'var(--border-soft)' }}>
                    <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Grand Total</span>
                    <span className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs mt-3 rounded-xl px-3 py-2.5 border" style={{ color: 'var(--text-muted)', background: 'var(--bg-muted)', borderColor: 'var(--border-soft)' }}>
                  📦 Standard delivery in 3–5 business days
                </p>
                <div className="mt-3 flex items-center justify-center gap-3 text-xs" style={{ color: 'var(--text-faint)' }}>
                  <span>🔒 SSL Secured</span>
                  <span>·</span>
                  <span>💚 Eco Certified</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sticky-bar border-t" style={{ borderColor: 'var(--border-soft)', boxShadow: '0 -4px 24px rgba(0,0,0,0.08)' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>₹{grandTotal.toLocaleString()}</span>
            <span>· {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => window.history.back()}
              className="eco-btn btn-ghost flex-1 sm:flex-none sm:px-6 font-semibold py-3 rounded-xl text-sm"
            >
              ← Back
            </button>
            <button
              onClick={() => router.push('/shipping')}
              disabled={cartItems.length === 0}
              className="eco-btn btn-primary flex-1 sm:flex-none sm:px-8 font-bold py-3 rounded-xl text-sm"
            >
              Next: Shipping →
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const host = context.req.headers.host
    const res = await fetch(`${protocol}://${host}/api/cart`)
    const cartData = await res.json()
    return { props: { cartData } }
  } catch (error) {
    return {
      props: {
        cartData: { cartItems: [], shipping_fee: 50, discount_applied: 0 },
      },
    }
  }
}
