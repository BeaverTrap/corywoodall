import './globals.css'
import { Inter, Quicksand } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import { getSiteContent } from '@/lib/content/queries'

const inter = Inter({ subsets: ['latin'] })
const quicksand = Quicksand({
  subsets: ['latin'],
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const supabase = createClient()
  const siteContent = await getSiteContent(supabase)

  return {
    title: siteContent.site_meta.title,
    description: siteContent.site_meta.description,
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={quicksand.className}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
