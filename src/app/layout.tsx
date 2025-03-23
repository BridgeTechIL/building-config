import type { Metadata } from 'next'
import './globals.css'
import { Montserrat } from 'next/font/google'
import ClientWrapper from './ClientWrapper'  // Import the wrapper

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Building Configuration',
  description: 'Configure your building security system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={montserrat.className}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}