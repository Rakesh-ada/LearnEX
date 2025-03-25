"use client"

import { useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import SpaceBackground from "@/components/space-background"
import { ChevronRight, BookOpen, Upload, Download } from "lucide-react"
import { motion, useAnimationControls } from "framer-motion"
import ClientOnly from "@/lib/client-only"
import SimpleFallback from "@/components/simple-fallback"

export default function Home() {
  const featuredRef = useRef<HTMLDivElement>(null)

  // Scroll to featured section
  const scrollToFeatured = () => {
    featuredRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const text = "Buy, Sell & Trade Study Materials as Secure NFTs!"
  const words = text.split(" ")

  return (
    <main className="relative min-h-screen">
      <ClientOnly fallback={<SimpleFallback />}>
        <SpaceBackground colorTheme="purple" shootingStars={true} cosmicDust={true} />
      </ClientOnly>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-16">
        <div className="container mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-block rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-1 text-sm font-medium text-white"
          >
            The Future of Educational Content
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            <span className="block">Decentralized</span>
            <span className="block bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Study Material Marketplace
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            className="mb-10 max-w-2xl text-lg text-slate-300 relative"
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.1,
                  delay: 0.4 + (i * 0.15),
                  ease: "linear"
                }}
                className="inline-block mr-1.5"
              >
                {word}
              </motion.span>
            ))}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
          >
            <Link href="/marketplace">
              <Button size="lg" className="group relative bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <span className="absolute -inset-0.5 -z-10 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 opacity-30 blur transition duration-1000 group-hover:opacity-50 group-hover:blur-md"></span>
                Explore Study Materials
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToFeatured}
              className="border-purple-500 bg-black/50 text-white backdrop-blur-sm"
            >
              Learn More
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{
            opacity: { delay: 1.5, duration: 1 },
            y: { delay: 1.5, duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" },
          }}
          className="absolute bottom-8 flex flex-col items-center"
        >
          <span className="mb-2 text-sm text-slate-400">Scroll to discover</span>
          <div className="relative h-10 w-6 rounded-full border-2 border-slate-400">
            <div className="absolute left-1/2 top-2 h-2 w-2 -translate-x-1/2 rounded-full bg-slate-400"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section ref={featuredRef} className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">How It Works</h2>
            <p className="mx-auto max-w-2xl text-slate-300">
             
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative rounded-xl border border-slate-800 bg-black/50 p-6 backdrop-blur-sm"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 blur transition duration-300 group-hover:opacity-20"></div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                <Upload className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Upload & Mint</h3>
              <p className="text-slate-300">
                Upload your study materials and mint them as NFTs. Your content is encrypted and stored securely on
                IPFS.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative rounded-xl border border-slate-800 bg-black/50 p-6 backdrop-blur-sm"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 blur transition duration-300 group-hover:opacity-20"></div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                <BookOpen className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Browse & Purchase</h3>
              <p className="text-slate-300">
                Explore the marketplace and purchase study materials using cryptocurrency. Each purchase grants you an
                NFT for access.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group relative rounded-xl border border-slate-800 bg-black/50 p-6 backdrop-blur-sm"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 blur transition duration-300 group-hover:opacity-20"></div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20">
                <Download className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Access & Learn</h3>
              <p className="text-slate-300">
                Access your purchased materials securely. Only NFT holders can decrypt and view the content.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 to-blue-900 p-8 sm:p-12">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
              <div>
                <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">Ready to get started?</h2>
                <p className="max-w-md text-blue-100">
                  Join our decentralized marketplace today and start buying or selling educational content securely.
                </p>
              </div>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link href="/marketplace">
                  <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                    Explore Marketplace
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                    Upload Materials
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 flex items-center md:mb-0">
              <span className="text-2xl font-bold">
                <span className="text-white">Learn</span>
                <span className="text-[#8A6FE8]">EX</span>
              </span>
            </div>
            <div className="mb-6 flex space-x-6 md:mb-0">
              <a href="#" className="text-sm text-slate-400 hover:text-white">
                Terms
              </a>
              <a href="#" className="text-sm text-slate-400 hover:text-white">
                Privacy
              </a>
              <a href="#" className="text-sm text-slate-400 hover:text-white">
                FAQ
              </a>
              <a href="#" className="text-sm text-slate-400 hover:text-white">
                Contact
              </a>
            </div>
            <div className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} LearnEX. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

