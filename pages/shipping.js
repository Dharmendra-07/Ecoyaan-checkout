import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/UI/Layout'
import { useCheckout } from '../context/CheckoutContext'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
]

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  pinCode: '',
  city: '',
  state: '',
  addressLine: '',
}

const initialErrors = Object.fromEntries(Object.keys(initialForm).map(k => [k, '']))

function FormField({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-forest-600 mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}

export default function ShippingPage() {
  const router = useRouter()
  const { setShippingAddress, cartItems, grandTotal } = useCheckout()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState(initialErrors)
  const [touched, setTouched] = useState({})

  const validate = (field, value) => {
    switch (field) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required'
        if (value.trim().length < 3) return 'Name must be at least 3 characters'
        return ''
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address'
        return ''
      case 'phone':
        if (!value.trim()) return 'Phone number is required'
        if (!/^[6-9]\d{9}$/.test(value.replace(/\s/g, '')))
          return 'Enter a valid 10-digit Indian mobile number'
        return ''
      case 'pinCode':
        if (!value.trim()) return 'PIN code is required'
        if (!/^\d{6}$/.test(value)) return 'Enter a valid 6-digit PIN code'
        return ''
      case 'city':
        if (!value.trim()) return 'City is required'
        return ''
      case 'state':
        if (!value) return 'State is required'
        return ''
      case 'addressLine':
        if (!value.trim()) return 'Address is required'
        if (value.trim().length < 10) return 'Please enter a more detailed address'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (touched[field]) {
      setErrors(prev => ({ ...prev, [field]: validate(field, value) }))
    }
  }

  const handleBlur = field => {
    setTouched(prev => ({ ...prev, [field]: true }))
    setErrors(prev => ({ ...prev, [field]: validate(field, form[field]) }))
  }

  const handleSubmit = () => {
    const newErrors = {}
    let hasError = false
    Object.keys(form).forEach(field => {
      const err = validate(field, form[field])
      newErrors[field] = err
      if (err) hasError = true
    })
    setErrors(newErrors)
    setTouched(Object.fromEntries(Object.keys(form).map(k => [k, true])))

    if (!hasError) {
      setShippingAddress(form)
      router.push('/payment')
    }
  }

  const inputClass = field =>
    `w-full eco-input border rounded-xl px-4 py-3 text-sm text-forest-800 bg-white placeholder-forest-300 transition-all duration-200
    ${errors[field] && touched[field] ? 'border-red-300 bg-red-50' : 'border-forest-200 hover:border-forest-300'}`

  return (
    <Layout currentStep={2}>
      <div className="animate-fade-up">
        <div className="mb-6">
          <h1
            className="text-2xl sm:text-3xl font-bold text-forest-800"
            style={{ fontFamily: 'Lora, Georgia, serif' }}
          >
            Shipping Address
          </h1>
          <p className="text-forest-500 text-sm mt-1">
            Tell us where to deliver your eco-friendly goods 🌿
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-forest-100 p-6 space-y-5">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Full Name" required error={touched.fullName && errors.fullName}>
                  <input
                    type="text"
                    placeholder="Arjun Sharma"
                    value={form.fullName}
                    onChange={e => handleChange('fullName', e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    className={inputClass('fullName')}
                  />
                </FormField>
                <FormField label="Email Address" required error={touched.email && errors.email}>
                  <input
                    type="email"
                    placeholder="arjun@example.com"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={inputClass('email')}
                  />
                </FormField>
              </div>

              {/* Phone */}
              <FormField label="Phone Number" required error={touched.phone && errors.phone}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-forest-500 font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={e => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    onBlur={() => handleBlur('phone')}
                    className={`${inputClass('phone')} pl-12`}
                  />
                </div>
              </FormField>

              {/* Address Line */}
              <FormField label="Address" required error={touched.addressLine && errors.addressLine}>
                <textarea
                  placeholder="House no., Street, Locality, Landmark..."
                  value={form.addressLine}
                  onChange={e => handleChange('addressLine', e.target.value)}
                  onBlur={() => handleBlur('addressLine')}
                  rows={3}
                  className={`${inputClass('addressLine')} resize-none`}
                />
              </FormField>

              {/* PIN & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="PIN Code" required error={touched.pinCode && errors.pinCode}>
                  <input
                    type="text"
                    placeholder="110001"
                    value={form.pinCode}
                    onChange={e => handleChange('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onBlur={() => handleBlur('pinCode')}
                    className={inputClass('pinCode')}
                  />
                </FormField>
                <FormField label="City" required error={touched.city && errors.city}>
                  <input
                    type="text"
                    placeholder="New Delhi"
                    value={form.city}
                    onChange={e => handleChange('city', e.target.value)}
                    onBlur={() => handleBlur('city')}
                    className={inputClass('city')}
                  />
                </FormField>
              </div>

              {/* State */}
              <FormField label="State" required error={touched.state && errors.state}>
                <select
                  value={form.state}
                  onChange={e => handleChange('state', e.target.value)}
                  onBlur={() => handleBlur('state')}
                  className={`${inputClass('state')} appearance-none cursor-pointer`}
                >
                  <option value="">Select your state</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </FormField>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push('/')}
                  className="eco-btn flex-1 border border-forest-200 text-forest-600 hover:bg-forest-50 font-semibold py-3.5 rounded-xl transition-all duration-200"
                >
                  ← Back to Cart
                </button>
                <button
                  onClick={handleSubmit}
                  className="eco-btn flex-1 bg-forest-600 hover:bg-forest-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          </div>

          {/* Mini Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-forest-100 p-5 sticky top-28">
              <h2
                className="text-base font-bold text-forest-800 mb-3"
                style={{ fontFamily: 'Lora, Georgia, serif' }}
              >
                Order Summary
              </h2>
              <div className="space-y-2">
                {cartItems.map(item => (
                  <div key={item.product_id} className="flex justify-between text-xs text-forest-600">
                    <span className="truncate pr-2">
                      {item.product_name} × {item.quantity}
                    </span>
                    <span className="font-medium flex-shrink-0">
                      ₹{(item.product_price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-forest-100 mt-3 pt-3 flex justify-between">
                <span className="text-sm font-bold text-forest-800">Total</span>
                <span className="text-sm font-bold text-forest-800">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
