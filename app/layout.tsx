import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Next.js Blog",
  description: "A statically generated blog built with Next.js",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              My Blog
            </Link>
            <nav>
              <ul className="flex gap-4">
                <li>
                  <Link href="/" className="hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-blue-600 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/dogs" className="hover:text-blue-600 transition-colors">
                    Dogs
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t mt-12 py-6 text-center text-gray-500">
          <div className="container mx-auto px-4">© {new Date().getFullYear()} My Blog. All rights reserved.</div>
        </footer>
      </body>
    </html>
  )
}
