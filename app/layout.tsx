import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"
import WalletProvider from "@/components/wallet-provider"
import StarBackground from "@/components/star-background"
import { ThemeProvider } from "@/components/theme-provider"
import SimpleFallback from "@/components/simple-fallback"
import ClientOnly from "@/lib/client-only"
import Script from "next/script"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LearnEX - Decentralized Study Marketplace",
  description: "Buy and sell study materials on the blockchain",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <WalletProvider>
          <ClientOnly>
            <ThemeProvider>
              <div className="flex min-h-screen flex-col bg-black">
                <ClientOnly fallback={<SimpleFallback />}>
                  <StarBackground />
                </ClientOnly>
                <Navbar>
                  <Link href="/" className="flex items-center">
                    <span className="text-2xl font-bold">
                      <span className="text-white">Learn</span>
                      <span className="text-[#8A6FE8]">EX</span>
                    </span>
                  </Link>
                </Navbar>
                <main className="flex-1 relative z-10">{children}</main>
              </div>
              <Toaster />
            </ThemeProvider>
          </ClientOnly>
        </WalletProvider>
        
        {/* Script to remove fdprocessedid attributes that cause hydration errors */}
        <Script id="remove-fd-attributes" strategy="afterInteractive">
          {`
            function removeFdAttributes() {
              try {
                // Find all elements with fdprocessedid attributes
                const elements = document.querySelectorAll('[fdprocessedid]');
                
                // Remove the attribute from each element
                elements.forEach(el => {
                  el.removeAttribute('fdprocessedid');
                });
                
                // Set up a mutation observer to catch any new elements with fdprocessedid
                const observer = new MutationObserver(mutations => {
                  mutations.forEach(mutation => {
                    if (mutation.type === 'attributes' && 
                        mutation.attributeName === 'fdprocessedid') {
                      mutation.target.removeAttribute('fdprocessedid');
                    }
                  });
                });
                
                // Start observing the document
                observer.observe(document.body, {
                  attributes: true,
                  subtree: true,
                  attributeFilter: ['fdprocessedid']
                });
              } catch (error) {
                console.error('Error removing fdprocessedid attributes:', error);
              }
            }
            
            // Run immediately and after a short delay to catch any late additions
            removeFdAttributes();
            setTimeout(removeFdAttributes, 100);
          `}
        </Script>
      </body>
    </html>
  )
} 
