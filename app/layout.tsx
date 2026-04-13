import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Free AI Resume Builder - Professional Summaries in Seconds',
  description: 'Generate professional AI-powered resume summaries instantly. Create compelling career profiles in English or Arabic with our intelligent resume builder.',
  keywords: ['resume builder', 'AI resume', 'CV builder', 'professional summary', 'job profile', 'career'],
  authors: [{ name: 'CV Resume Builder' }],
  viewport: 'width=device-width, initial-scale=1.0',
  robots: 'index, follow',
  openGraph: {
    title: 'Free AI Resume Builder - Professional Summaries in Seconds',
    description: 'Generate professional AI-powered resume summaries instantly.',
    url: 'https://cvbuilder.example.com',
    siteName: 'AI Resume Builder',
    images: [
      {
        url: 'https://cvbuilder.example.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Resume Builder',
    description: 'Generate professional AI-powered resume summaries instantly.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#667eea" />
        <script
          async
          src="https://lentattire.com/cf/de/f6/cfdef67649704ea0630a71981e572443.js"
        />
      </head>
      <body className="bg-gradient-to-br from-slate-50 to-slate-100">
        {children}
      </body>
    </html>
  )
}