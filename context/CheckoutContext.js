import { createContext, useContext, useState, useCallback } from 'react'

const CheckoutContext = createContext(null)

export function CheckoutProvider({ children, initialCart }) {
  const [cartItems, setCartItems] = useState(initialCart?.cartItems || [])
  const [shippingFee] = useState(initialCart?.shipping_fee || 50)
  const [discount] = useState(initialCart?.discount_applied || 0)
  const [shippingAddress, setShippingAddress] = useState(null)

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0
  )
  const grandTotal = subtotal + shippingFee - discount

  const updateQuantity = useCallback((productId, newQty) => {
    if (newQty < 1) return
    setCartItems(prev =>
      prev.map(item =>
        item.product_id === productId ? { ...item, quantity: newQty } : item
      )
    )
  }, [])

  const removeItem = useCallback((productId) => {
    setCartItems(prev => prev.filter(item => item.product_id !== productId))
  }, [])

  return (
    <CheckoutContext.Provider
      value={{
        cartItems,
        shippingFee,
        discount,
        subtotal,
        grandTotal,
        shippingAddress,
        setShippingAddress,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider')
  return ctx
}
