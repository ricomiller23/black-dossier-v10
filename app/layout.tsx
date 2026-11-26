import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BLACK DOSSIER — Solo Espionage RPG',
  description: 'Tactical Cold War tabletop espionage RPG with tactical CAD blueprints, corkboard evidence graph, and high-stakes d100 tradecraft.',
  keywords: ['espionage', 'tabletop RPG', 'solo RPG', 'Cold War', 'cyberpunk', 'tactical RPG'],
  authors: [{ name: 'Black Dossier Operations Command' }]
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#06090e'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head><link rel="stylesheet" href="/v10-responsive.css" /></head>
      <body className="min-h-screen bg-[#06090e] text-zinc-300 antialiased selection:bg-amber-600/30 selection:text-amber-200">
        {children}
        <script src="/v10-suite.js" defer></script>
      </body>
    </html>
  )
}
