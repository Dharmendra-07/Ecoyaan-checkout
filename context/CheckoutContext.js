import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const CheckoutContext = createContext(null)

const STORAGE_KEY = 'ecoyaan_checkout'

function loadFromStorage() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveToStorage(data) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export function CheckoutProvider({ children, initialCart }) {
  const [cartItems, setCartItems] = useState(initialCart?.cartItems || [])
  const [shippingFee] = useState(initialCart?.shipping_fee || 50)
  const [discount] = useState(initialCart?.discount_applied || 0)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [shippingAddress, setShippingAddressState] = useState(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = loadFromStorage()
    if (stored) {
      if (stored.savedAddresses) setSavedAddresses(stored.savedAddresses)
      if (stored.selectedAddressId) setSelectedAddressId(stored.selectedAddressId)
      if (stored.shippingAddress) setShippingAddressState(stored.shippingAddress)
      if (stored.cartItems && stored.cartItems.length > 0) setCartItems(stored.cartItems)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveToStorage({ savedAddresses, selectedAddressId, shippingAddress, cartItems })
  }, [savedAddresses, selectedAddressId, shippingAddress, cartItems, hydrated])

  const subtotal = cartItems.reduce((sum, item) => sum + item.product_price * item.quantity, 0)
  const grandTotal = subtotal + shippingFee - discount

  const updateQuantity = useCallback((productId, newQty) => {
    if (newQty < 1) return
    setCartItems(prev => prev.map(item => item.product_id === productId ? { ...item, quantity: newQty } : item))
  }, [])

  const removeItem = useCallback((productId) => {
    setCartItems(prev => prev.filter(item => item.product_id !== productId))
  }, [])

  const setShippingAddress = useCallback((address) => {
    setShippingAddressState(address)
  }, [])

  const addAddress = useCallback((address) => {
    const id = `addr_${Date.now()}`
    const newAddr = { ...address, id }
    setSavedAddresses(prev => [...prev, newAddr])
    setSelectedAddressId(id)
    setShippingAddressState(newAddr)
    return id
  }, [])

  const updateAddress = useCallback((id, address) => {
    const updated = { ...address, id }
    setSavedAddresses(prev => prev.map(a => a.id === id ? updated : a))
    setSelectedAddressId(prev => {
      if (prev === id) setShippingAddressState(updated)
      return prev
    })
  }, [])

  const deleteAddress = useCallback((id) => {
    setSavedAddresses(prev => {
      const remaining = prev.filter(a => a.id !== id)
      if (selectedAddressId === id) {
        const next = remaining[0] || null
        setSelectedAddressId(next ? next.id : null)
        setShippingAddressState(next)
      }
      return remaining
    })
  }, [selectedAddressId])

  const selectAddress = useCallback((id) => {
    setSelectedAddressId(id)
    setSavedAddresses(prev => {
      const found = prev.find(a => a.id === id)
      if (found) setShippingAddressState(found)
      return prev
    })
  }, [])

  return (
    <CheckoutContext.Provider value={{
      cartItems, shippingFee, discount, subtotal, grandTotal,
      shippingAddress, setShippingAddress,
      savedAddresses, selectedAddressId,
      addAddress, updateAddress, deleteAddress, selectAddress,
      updateQuantity, removeItem,
    }}>
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider')
  return ctx
}
