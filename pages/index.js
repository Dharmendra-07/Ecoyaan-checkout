import { useRouter } from 'next/router'
import Image from 'next/image'
import Layout from '../components/UI/Layout'
import { useCheckout } from '../context/CheckoutContext'

function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div className="product-card bg-white rounded-2xl p-4 sm:p-5 flex gap-4 border border-forest-100">
      {/* Product Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-forest-50">
        <img
          src={item.image}
          alt={item.product_name}
          className="w-full h-full object-cover"
        />
        {item.badge && (
          <span className="absolute top-1 left-1 bg-forest-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3
              className="text-forest-800 font-semibold text-sm sm:text-base leading-snug"
              style={{ fontFamily: 'Lora, Georgia, serif' }}
            >
              {item.product_name}
            </h3>
            {item.description && (
              <p className="text-forest-400 text-xs mt-0.5">{item.description}</p>
            )}
          </div>
          <button
            onClick={() => onRemove(item.product_id)}
            className="text-forest-300 hover:text-red-400 transition-colors flex-shrink-0 p-1"
            aria-label="Remove item"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-forest-50 rounded-xl p-1">
            <button
              onClick={() => onUpdateQty(item.product_id, item.quantity - 1)}
              className="w-7 h-7 rounded-lg bg-white border border-forest-200 flex items-center justify-center text-forest-600 hover:bg-forest-100 transition-colors shadow-sm"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-semibold text-forest-700">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQty(item.product_id, item.quantity + 1)}
              className="w-7 h-7 rounded-lg bg-white border border-forest-200 flex items-center justify-center text-forest-600 hover:bg-forest-100 transition-colors shadow-sm"
            >
              +
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-forest-800 font-bold text-base">
              ₹{(item.product_price * item.quantity).toLocaleString()}
            </p>
            <p className="text-forest-400 text-xs">
              ₹{item.product_price} each
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CartPage() {
  const router = useRouter()
  const { cartItems, shippingFee, discount, subtotal, grandTotal, updateQuantity, removeItem } =
    useCheckout()

  return (
    <Layout currentStep={1}>
      <div className="animate-fade-up">
        <div className="mb-6">
          <h1
            className="text-2xl sm:text-3xl font-bold text-forest-800"
            style={{ fontFamily: 'Lora, Georgia, serif' }}
          >
            Your Cart
          </h1>
          <p className="text-forest-500 text-sm mt-1">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} ready for checkout
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-forest-700 mb-2">Your cart is empty</h2>
            <p className="text-forest-400 text-sm">Start shopping for eco-friendly products!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {/* Eco Badge */}
              <div className="flex items-center gap-2 bg-forest-50 border border-forest-200 rounded-xl px-4 py-2.5">
                <span className="text-sm">🌱</span>
                <p className="text-xs text-forest-600 font-medium">
                  Your purchase offsets{' '}
                  <span className="font-bold">
                    {(cartItems.length * 0.5).toFixed(1)} kg
                  </span>{' '}
                  of CO₂ emissions
                </p>
              </div>

              {cartItems.map(item => (
                <CartItem
                  key={item.product_id}
                  item={item}
                  onUpdateQty={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-forest-100 p-5 sticky top-28">
                <h2
                  className="text-lg font-bold text-forest-800 mb-4"
                  style={{ fontFamily: 'Lora, Georgia, serif' }}
                >
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-forest-600">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-forest-600">
                    <span>Shipping</span>
                    <span className="font-medium">₹{shippingFee}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-forest-500">
                      <span>Discount</span>
                      <span className="font-medium text-forest-600">−₹{discount}</span>
                    </div>
                  )}

                  <div className="border-t border-forest-100 pt-3 flex justify-between">
                    <span className="font-bold text-forest-800 text-base">Grand Total</span>
                    <span className="font-bold text-forest-800 text-base">
                      ₹{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Shipping note */}
                <p className="text-xs text-forest-400 mt-3 bg-earth-50 rounded-lg px-3 py-2">
                  📦 Standard delivery in 3–5 business days
                </p>

                <button
                  onClick={() => router.push('/shipping')}
                  className="eco-btn w-full mt-4 bg-forest-600 hover:bg-forest-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg animate-pulse-green"
                >
                  Proceed to Checkout →
                </button>

                <div className="mt-3 flex items-center justify-center gap-3 text-xs text-forest-400">
                  <span>🔒 SSL Secured</span>
                  <span>·</span>
                  <span>💚 Eco Certified</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

// SSR: Fetch cart data from mock API
export async function getServerSideProps(context) {
  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const host = context.req.headers.host
    const res = await fetch(`${protocol}://${host}/api/cart`)
    const cartData = await res.json()

    return {
      props: { cartData },
    }
  } catch (error) {
    console.error('Failed to fetch cart data:', error)
    return {
      props: {
        cartData: {
          cartItems: [],
          shipping_fee: 50,
          discount_applied: 0,
        },
      },
    }
  }
}
