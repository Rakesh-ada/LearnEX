import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Link from "next/link"
import Providers from "@/components/providers"
import Script from "next/script"

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
        <Providers>
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
        </Providers>
        
        {/* Script to remove fdprocessedid attributes that cause hydration errors */}
        <Script id="remove-fd-attributes">
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
