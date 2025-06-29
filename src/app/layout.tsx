import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/context/themeContext"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "CMS ALFURQON",
  description: "Dashboard Masjid ALFURQON",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const autoMode = localStorage.getItem('autoMode') !== 'false';
                
                let initialTheme = 'light';
                
                if (autoMode) {
                  // Auto theme based on time
                  const hour = new Date().getHours();
                  if (hour >= 5 && hour < 12) initialTheme = 'light';
                  else if (hour >= 12 && hour < 18) initialTheme = 'dusk';
                  else initialTheme = 'dark';
                } else {
                  // Use stored theme or fallback to time-based
                  if (theme) {
                    initialTheme = theme;
                  } else {
                    const hour = new Date().getHours();
                    if (hour >= 5 && hour < 12) initialTheme = 'light';
                    else if (hour >= 12 && hour < 18) initialTheme = 'dusk';
                    else initialTheme = 'dark';
                  }
                }
                
                if (initialTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {
                // Fallback to time-based theme
                const hour = new Date().getHours();
                let fallbackTheme = 'light';
                if (hour >= 5 && hour < 12) fallbackTheme = 'light';
                else if (hour >= 12 && hour < 18) fallbackTheme = 'dusk';
                else fallbackTheme = 'dark';
                
                if (fallbackTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors`}
        suppressHydrationWarning
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
