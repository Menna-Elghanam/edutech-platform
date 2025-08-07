import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionLayout from '@/components/SessionLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'EduPlatform - Learn Skills Online',
    template: '%s | EduPlatform'
  },
  description: 'Learn new skills with expert-led courses. Join thousands of students advancing their careers.',
  keywords: ['online learning', 'courses', 'education', 'skills', 'programming', 'design'],
  authors: [{ name: 'EduPlatform Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://eduplatform.com',
    siteName: 'EduPlatform',
    title: 'EduPlatform - Learn Skills Online',
    description: 'Learn new skills with expert-led courses',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduPlatform - Learn Skills Online',
    description: 'Learn new skills with expert-led courses',
  },
  robots: {
    index: true,
    follow: true,
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionLayout>{children}</SessionLayout>
      </body>
    </html>
  )
}
