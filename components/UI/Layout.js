import Link from 'next/link'

const steps = [
  { id: 1, label: 'Cart', path: '/' },
  { id: 2, label: 'Shipping', path: '/shipping' },
  { id: 3, label: 'Payment', path: '/payment' },
]

export default function Layout({ children, currentStep }) {
  return (
    <div className="min-h-screen leaf-bg">
      {/* Header */}
      <header className="bg-white border-b border-forest-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-forest-600 rounded-full flex items-center justify-center text-white text-sm font-bold group-hover:bg-forest-700 transition-colors">
              🌿
            </div>
            <span
              className="text-xl font-semibold text-forest-800"
              style={{ fontFamily: 'Lora, Georgia, serif' }}
            >
              Ecoyaan
            </span>
          </Link>
          <span className="text-xs text-forest-500 bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
            🔒 Secure Checkout
          </span>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="bg-white border-b border-forest-100">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-0">
            {steps.map((step, idx) => {
              const isCompleted = currentStep > step.id
              const isActive = currentStep === step.id
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                        ${isCompleted ? 'bg-forest-600 text-white' : isActive ? 'bg-forest-600 text-white ring-4 ring-forest-100' : 'bg-forest-100 text-forest-400'}`}
                    >
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium transition-colors ${isActive ? 'text-forest-700' : isCompleted ? 'text-forest-500' : 'text-forest-300'}`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {idx < steps.length - 1 && (
                    <div
                      className={`w-16 sm:w-24 h-0.5 mb-5 mx-1 transition-all duration-500 ${isCompleted ? 'bg-forest-400' : 'bg-forest-100'}`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-forest-100 bg-white mt-16">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-forest-400">
            © 2025 Ecoyaan · Sustainable Living
          </p>
          <div className="flex items-center gap-4 text-xs text-forest-400">
            <span>🌱 Carbon Neutral Shipping</span>
            <span>♻️ Eco-Friendly Packaging</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
