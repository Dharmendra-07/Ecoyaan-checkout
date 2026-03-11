import '../styles/globals.css'
import { CheckoutProvider } from '../context/CheckoutContext'
import { ThemeProvider } from '../context/ThemeContext'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <CheckoutProvider initialCart={pageProps.cartData || null}>
        <Component {...pageProps} />
      </CheckoutProvider>
    </ThemeProvider>
  )
}
