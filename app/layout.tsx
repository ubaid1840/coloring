import type { Metadata, Viewport } from "next"
import { Fredoka, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import Providers from "./providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "ColorMagic — AI Coloring Page Generator for Kids & Teens",
  description:
    "Type an idea and instantly create your own printable coloring page with AI. 100% free, no sign-up. Download as PNG or PDF and start coloring!",
  openGraph: {
    title: "ColorMagic — AI Coloring Page Generator",
    description:
      "Turn any idea into a printable coloring page in seconds. Free, fun, and made for kids and teens.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#ff6a3d",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "bg-background antialiased",
        inter.variable,
        fredoka.variable,
        fontMono.variable,
        "font-sans",
      )}
    >
      <body>
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
