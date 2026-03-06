import '../styles/globals.css'
import { CheckoutProvider } from '../context/CheckoutContext'

export default function App({ Component, pageProps }) {
  return (
    <CheckoutProvider initialCart={pageProps.cartData || null}>
      <Component {...pageProps} />
    </CheckoutProvider>
  )
}
