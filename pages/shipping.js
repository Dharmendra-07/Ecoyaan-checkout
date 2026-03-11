import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/UI/Layout'
import { useCheckout } from '../context/CheckoutContext'

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Chandigarh','Puducherry',
]

const BLANK_FORM = {
  fullName:'', email:'', phone:'', pinCode:'', city:'', state:'', addressLine:'',
}

function FormField({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        {label} {required && <span className="normal-case" style={{ color: '#ef4444' }}>*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs mt-1.5 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)' }}>
          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

function AddressCard({ address, isSelected, onSelect, onEdit, onDelete }) {
  return (
    <div
      className="relative rounded-2xl border-2 p-4 cursor-pointer transition-all duration-200 group"
      style={{
        borderColor: isSelected ? 'var(--accent-green)' : 'var(--border-soft)',
        background: isSelected ? 'var(--bg-muted)' : 'var(--bg-card)',
        boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
      }}
      onClick={onSelect}
    >
      {isSelected && (
        <div
          className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
          style={{ background: 'var(--accent-green)' }}
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      <div className="flex items-start gap-3 pr-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: isSelected ? 'var(--accent-green)' : 'var(--bg-muted)' }}
        >
          <svg className="w-4 h-4" style={{ color: isSelected ? '#fff' : 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{address.fullName}</p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{address.addressLine}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{address.city}, {address.state} — {address.pinCode}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>+91 {address.phone}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-soft)' }}>
        <button
          onClick={e => { e.stopPropagation(); onEdit() }}
          className="eco-btn flex-1 text-xs font-semibold py-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--accent-green)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >✏️ Edit</button>
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          className="eco-btn flex-1 text-xs font-semibold py-1.5 rounded-lg transition-colors"
          style={{ color: '#ef4444' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >🗑️ Delete</button>
      </div>
    </div>
  )
}

function AddressForm({ initial, onSave, onCancel, title }) {
  const [form, setForm] = useState(initial || BLANK_FORM)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validate = (field, value) => {
    switch (field) {
      case 'fullName':    return !value.trim() ? 'Full name is required' : value.trim().length < 3 ? 'At least 3 characters' : ''
      case 'email':       return !value.trim() ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Enter a valid email' : ''
      case 'phone':       return !value.trim() ? 'Phone is required' : !/^[6-9]\d{9}$/.test(value.replace(/\s/g, '')) ? 'Valid 10-digit Indian number' : ''
      case 'pinCode':     return !value.trim() ? 'PIN code is required' : !/^\d{6}$/.test(value) ? '6-digit PIN required' : ''
      case 'city':        return !value.trim() ? 'City is required' : ''
      case 'state':       return !value ? 'State is required' : ''
      case 'addressLine': return !value.trim() ? 'Address is required' : value.trim().length < 10 ? 'Please enter more detail' : ''
      default: return ''
    }
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (touched[field]) setErrors(prev => ({ ...prev, [field]: validate(field, value) }))
  }

  const handleBlur = field => {
    setTouched(prev => ({ ...prev, [field]: true }))
    setErrors(prev => ({ ...prev, [field]: validate(field, form[field]) }))
  }

  const handleSave = () => {
    const newErrors = {}
    let hasError = false
    Object.keys(form).forEach(field => {
      const err = validate(field, form[field])
      newErrors[field] = err
      if (err) hasError = true
    })
    setErrors(newErrors)
    setTouched(Object.fromEntries(Object.keys(form).map(k => [k, true])))
    if (!hasError) onSave(form)
  }

  const inputStyle = (field) => ({
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    borderRadius: '12px',
    outline: 'none',
    background: 'var(--bg-card)',
    color: 'var(--text-primary)',
    border: `1.5px solid ${errors[field] && touched[field] ? '#ef4444' : 'var(--border-soft)'}`,
    transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.3s',
  })

  return (
    <div
      className="rounded-2xl border p-5 space-y-4 animate-scale-in"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)', boxShadow: 'var(--shadow-sm)' }}
    >
      <h3 className="font-bold text-base" style={{ fontFamily: 'Lora, Georgia, serif', color: 'var(--text-primary)' }}>{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Full Name" required error={touched.fullName && errors.fullName}>
          <input type="text" placeholder="Arjun Sharma" value={form.fullName}
            onChange={e => handleChange('fullName', e.target.value)} onBlur={() => handleBlur('fullName')}
            style={inputStyle('fullName')}
            onFocus={e => { e.target.style.borderColor = 'var(--accent-green)'; e.target.style.boxShadow = '0 0 0 3px rgba(61,138,68,0.15)' }}
            onBlurCapture={e => { e.target.style.boxShadow = 'none' }}
          />
        </FormField>
        <FormField label="Email Address" required error={touched.email && errors.email}>
          <input type="email" placeholder="arjun@example.com" value={form.email}
            onChange={e => handleChange('email', e.target.value)} onBlur={() => handleBlur('email')}
            style={inputStyle('email')}
            onFocus={e => { e.target.style.borderColor = 'var(--accent-green)'; e.target.style.boxShadow = '0 0 0 3px rgba(61,138,68,0.15)' }}
            onBlurCapture={e => { e.target.style.boxShadow = 'none' }}
          />
        </FormField>
      </div>
      <FormField label="Phone Number" required error={touched.phone && errors.phone}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>+91</span>
          <input type="tel" placeholder="9876543210" value={form.phone}
            onChange={e => handleChange('phone', e.target.value.replace(/\D/g,'').slice(0,10))}
            onBlur={() => handleBlur('phone')}
            style={{ ...inputStyle('phone'), paddingLeft: '48px' }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent-green)'; e.target.style.boxShadow = '0 0 0 3px rgba(61,138,68,0.15)' }}
            onBlurCapture={e => { e.target.style.boxShadow = 'none' }}
          />
        </div>
      </FormField>
      <FormField label="Address" required error={touched.addressLine && errors.addressLine}>
        <textarea placeholder="House no., Street, Locality, Landmark..." value={form.addressLine}
          onChange={e => handleChange('addressLine', e.target.value)} onBlur={() => handleBlur('addressLine')}
          rows={3}
          style={{ ...inputStyle('addressLine'), resize: 'none', lineHeight: '1.6' }}
          onFocus={e => { e.target.style.borderColor = 'var(--accent-green)'; e.target.style.boxShadow = '0 0 0 3px rgba(61,138,68,0.15)' }}
          onBlurCapture={e => { e.target.style.boxShadow = 'none' }}
        />
      </FormField>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="PIN Code" required error={touched.pinCode && errors.pinCode}>
          <input type="text" placeholder="110001" value={form.pinCode}
            onChange={e => handleChange('pinCode', e.target.value.replace(/\D/g,'').slice(0,6))}
            onBlur={() => handleBlur('pinCode')}
            style={inputStyle('pinCode')}
            onFocus={e => { e.target.style.borderColor = 'var(--accent-green)'; e.target.style.boxShadow = '0 0 0 3px rgba(61,138,68,0.15)' }}
            onBlurCapture={e => { e.target.style.boxShadow = 'none' }}
          />
        </FormField>
        <FormField label="City" required error={touched.city && errors.city}>
          <input type="text" placeholder="New Delhi" value={form.city}
            onChange={e => handleChange('city', e.target.value)} onBlur={() => handleBlur('city')}
            style={inputStyle('city')}
            onFocus={e => { e.target.style.borderColor = 'var(--accent-green)'; e.target.style.boxShadow = '0 0 0 3px rgba(61,138,68,0.15)' }}
            onBlurCapture={e => { e.target.style.boxShadow = 'none' }}
          />
        </FormField>
      </div>
      <FormField label="State" required error={touched.state && errors.state}>
        <select value={form.state} onChange={e => handleChange('state', e.target.value)}
          onBlur={() => handleBlur('state')}
          style={{ ...inputStyle('state'), appearance: 'none', cursor: 'pointer' }}
          onFocus={e => { e.target.style.borderColor = 'var(--accent-green)'; e.target.style.boxShadow = '0 0 0 3px rgba(61,138,68,0.15)' }}
          onBlurCapture={e => { e.target.style.boxShadow = 'none' }}
        >
          <option value="">Select your state</option>
          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </FormField>
      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button onClick={onCancel} className="eco-btn btn-ghost flex-1 font-semibold py-3 rounded-xl text-sm">
            Cancel
          </button>
        )}
        <button onClick={handleSave} className="eco-btn btn-primary flex-1 font-bold py-3 rounded-xl text-sm">
          Save Address ✓
        </button>
      </div>
    </div>
  )
}

export default function ShippingPage() {
  const router = useRouter()
  const { cartItems, grandTotal, savedAddresses, selectedAddressId, shippingAddress, addAddress, updateAddress, deleteAddress, selectAddress } = useCheckout()
  const [mode, setMode] = useState(null)

  const handleAddSave = (form) => { addAddress(form); setMode(null) }
  const handleEditSave = (id, form) => { updateAddress(id, form); setMode(null) }
  const handleContinue = () => { if (shippingAddress) router.push('/payment') }
  const editTarget = mode && mode.type === 'edit' ? savedAddresses.find(a => a.id === mode.id) : null

  return (
    <Layout currentStep={2}>
      <div className="animate-fade-up">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'Lora, Georgia, serif', color: 'var(--text-primary)' }}>
            Shipping Address
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Tell us where to deliver your eco-friendly goods 🌿
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {savedAddresses.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Saved Addresses
                  </h2>
                  <span className="text-xs px-2 py-1 rounded-full border" style={{ color: 'var(--text-faint)', background: 'var(--bg-muted)', borderColor: 'var(--border-soft)' }}>
                    {savedAddresses.length} saved
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map(addr => (
                    <AddressCard
                      key={addr.id}
                      address={addr}
                      isSelected={selectedAddressId === addr.id}
                      onSelect={() => selectAddress(addr.id)}
                      onEdit={() => setMode({ type: 'edit', id: addr.id })}
                      onDelete={() => deleteAddress(addr.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {mode && mode.type === 'edit' && editTarget && (
              <AddressForm
                title="Edit Address"
                initial={editTarget}
                onSave={form => handleEditSave(mode.id, form)}
                onCancel={() => setMode(null)}
              />
            )}

            {mode === 'add' ? (
              <AddressForm
                title="New Address"
                onSave={handleAddSave}
                onCancel={savedAddresses.length > 0 ? () => setMode(null) : null}
              />
            ) : (
              <button
                onClick={() => setMode('add')}
                className="eco-btn w-full flex items-center justify-center gap-2 border-2 border-dashed font-semibold py-4 rounded-2xl transition-all duration-200 text-sm group"
                style={{ borderColor: 'var(--border-soft)', color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-green)'; e.currentTarget.style.background = 'var(--bg-muted)'; e.currentTarget.style.color = 'var(--accent-green)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-soft)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center transition-colors" style={{ background: 'var(--bg-muted)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                Add {savedAddresses.length === 0 ? 'a Delivery Address' : 'Another Address'}
              </button>
            )}
          </div>

          {/* Mini Order Summary */}
          <div className="lg:col-span-1">
            <div
              className="rounded-2xl border p-5 sticky top-28"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)', boxShadow: 'var(--shadow-sm)' }}
            >
              <h2 className="text-base font-bold mb-3" style={{ fontFamily: 'Lora, Georgia, serif', color: 'var(--text-primary)' }}>
                Order Summary
              </h2>
              <div className="space-y-2">
                {cartItems.map(item => (
                  <div key={item.product_id} className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span className="truncate pr-2">{item.product_name} × {item.quantity}</span>
                    <span className="font-semibold flex-shrink-0">₹{(item.product_price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between" style={{ borderColor: 'var(--border-soft)' }}>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Total</span>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>₹{grandTotal.toLocaleString()}</span>
              </div>

              {shippingAddress && (
                <div className="mt-4 p-3 rounded-xl border animate-scale-in" style={{ background: 'var(--bg-muted)', borderColor: 'var(--border-soft)' }}>
                  <p className="text-xs font-bold mb-1" style={{ color: 'var(--text-muted)' }}>📍 Delivering to:</p>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{shippingAddress.fullName}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{shippingAddress.city}, {shippingAddress.state}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sticky-bar border-t" style={{ borderColor: 'var(--border-soft)', boxShadow: '0 -4px 24px rgba(0,0,0,0.08)' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="hidden sm:block text-xs">
            {shippingAddress
              ? <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>✓ Address selected</span>
              : <span className="font-medium" style={{ color: '#d97706' }}>⚠ Please select or add an address</span>}
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => router.push('/')}
              className="eco-btn btn-ghost flex-1 sm:flex-none sm:px-6 font-semibold py-3 rounded-xl text-sm"
            >← Back</button>
            <button
              onClick={handleContinue}
              disabled={!shippingAddress}
              className="eco-btn btn-primary flex-1 sm:flex-none sm:px-8 font-bold py-3 rounded-xl text-sm"
            >Next: Payment →</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
