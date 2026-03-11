import Link from 'next/link'
import { useTheme } from '../../context/ThemeContext'

const steps = [
  { id: 1, label: 'Cart',     icon: '🛒', path: '/' },
  { id: 2, label: 'Shipping', icon: '📦', path: '/shipping' },
  { id: 3, label: 'Payment',  icon: '💳', path: '/payment' },
]

function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()
  if (!mounted) return <div className="w-[46px] h-[26px]" />
  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle eco-btn"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="theme-toggle-knob">
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>
    </button>
  )
}

export default function Layout({ children, currentStep }) {
  return (
    <div className="min-h-screen leaf-bg flex flex-col">
      {/* Header */}
      <header className="glass-header border-b sticky top-0 z-50" style={{ borderColor: 'var(--border-soft)' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, var(--accent-green), var(--accent-dark))' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M8 12c0-2.2 1.8-4 4-4 1.1 0 2.1.45 2.83 1.17" strokeLinecap="round"/>
                <path d="M12 8v8M8 16c1.1 0 2.5-.5 4-2 1.5 1.5 2.9 2 4 2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Lora, Georgia, serif', color: 'var(--text-primary)' }}>
              Ecoyaan
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div
              className="hidden sm:flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border"
              style={{ color: 'var(--text-muted)', background: 'var(--bg-muted)', borderColor: 'var(--border-soft)' }}
            >
              <svg className="w-3 h-3" style={{ color: 'var(--accent-green)' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure Checkout
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="border-b" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            {steps.map((step, idx) => {
              const isCompleted = currentStep > step.id
              const isActive    = currentStep === step.id
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-sm
                        ${isCompleted ? 'text-white scale-100' : isActive ? 'text-white scale-110' : ''}`}
                      style={
                        isCompleted || isActive
                          ? { background: `linear-gradient(135deg, var(--accent-dark), var(--accent-green))`, boxShadow: isActive ? '0 0 0 4px rgba(61,138,68,0.2)' : undefined }
                          : { background: 'var(--bg-muted)', border: `2px solid var(--border-soft)`, color: 'var(--text-faint)' }
                      }
                    >
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : step.id}
                    </div>
                    <span
                      className="text-xs font-semibold tracking-wide transition-colors"
                      style={{ color: isActive ? 'var(--text-primary)' : isCompleted ? 'var(--text-muted)' : 'var(--text-faint)' }}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="relative mx-2 mb-5">
                      <div className="w-16 sm:w-28 h-0.5 rounded-full" style={{ background: 'var(--border-soft)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: isCompleted ? '100%' : '0%',
                            background: 'linear-gradient(90deg, var(--accent-dark), var(--accent-green))',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full pb-28">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>© 2025 Ecoyaan · Sustainable Living</p>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-faint)' }}>
            <span>🌱 Carbon Neutral</span>
            <span>·</span>
            <span>♻️ Eco Packaging</span>
            <span>·</span>
            <span>🔒 SSL Secured</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
