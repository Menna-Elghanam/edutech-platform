'use client'

import { SessionProvider } from 'next-auth/react'


interface Props {
  children: React.ReactNode
}

export default function SessionLayout({ children }: Props) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </SessionProvider>
  )
}
