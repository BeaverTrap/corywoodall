import './globals.css'
import { Inter, Quicksand } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const quicksand = Quicksand({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Cory Woodall - Art Historian & Contemporary Artist',
  description: 'Cory Woodall is an art historian, curator, and contemporary artist specializing in the historic cyanotype process.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={quicksand.className}>
      <head>
        <title>Cory Woodall</title>
        <meta name="description" content="Cory Woodall - Contemporary Cyanotype Artist" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
