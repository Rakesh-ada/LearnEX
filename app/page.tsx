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

  return (
    <main className="relative min-h-screen">
      <ClientOnly fallback={<SimpleFallback />}>
        <SpaceBackground colorTheme="purple" shootingStars={true} cosmicDust={true} />
      </ClientOnly>

      {/* Hero Section - Cursor.com Style */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-16">
        <div className="container mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="mb-6 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Web3</span> Study Material Marketplace
            </h1>
            
            <p className="mb-10 mx-auto max-w-2xl text-xl text-slate-300">
              Built to make learning extraordinarily productive, LearnEX is the best way to access and share study materials.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
          >
            <Link href="/marketplace">
              <Button variant="cursor-style" size="cursor-lg">
                Explore Marketplace
              </Button>
            </Link>
            <Link href="/upload">
            <Button
              variant="outline"
                size="cursor-lg"
                className="border-slate-700 text-white hover:bg-slate-800/50"
            >
                Upload Materials
            </Button>
            </Link>
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

      {/* Features Section - Cursor.com Style */}
      <section ref={featuredRef} className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">How It Works</h2>
            <p className="mx-auto max-w-2xl text-slate-300">
              LearnEX lets you access, create, and share educational content with blockchain security.
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

      {/* Testimonials Section - Cursor.com Style */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Loved by students worldwide</h2>
            <p className="mx-auto max-w-2xl text-slate-300">
              Students and educators around the world reach for LearnEX by choice.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <p className="mb-6 text-slate-300">
                "LearnEX is at least a 2x improvement over traditional study materials. It's amazing having an AI guide, and is an incredible accelerator for me and my study group."
              </p>
              <div className="mt-auto flex items-center">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-purple-600"></div>
                <div className="ml-3">
                  <h4 className="font-semibold text-white">Emma Johnson</h4>
                  <p className="text-sm text-slate-400">Computer Science Student, MIT</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <p className="mb-6 text-slate-300">
                "The content quality on LearnEX occasionally is so exceptional it defies reality - I consistently find study materials that anticipate exactly what I need to know for exams."
              </p>
              <div className="mt-auto flex items-center">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-green-600 to-teal-600"></div>
                <div className="ml-3">
                  <h4 className="font-semibold text-white">Marcus Chen</h4>
                  <p className="text-sm text-slate-400">Physics Major, Stanford</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <p className="mb-6 text-slate-300">
                "LearnEX is hands down my biggest workflow improvement in years. The blockchain verification ensures I'm getting quality content from verified sources."
              </p>
              <div className="mt-auto flex items-center">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-amber-500 to-orange-600"></div>
                <div className="ml-3">
                  <h4 className="font-semibold text-white">Sarah Patel</h4>
                  <p className="text-sm text-slate-400">MBA Student, Harvard</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <p className="mb-6 text-slate-300">
                "I love studying with LearnEX materials. The platform is steps ahead of traditional resources, suggesting content that matches my learning style perfectly."
              </p>
              <div className="mt-auto flex items-center">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-purple-600 to-pink-600"></div>
                <div className="ml-3">
                  <h4 className="font-semibold text-white">James Wilson</h4>
                  <p className="text-sm text-slate-400">Biology Researcher, Oxford</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <p className="mb-6 text-slate-300">
                "LearnEX is so good, and literally gets better every week with new content. The NFT ownership model means I truly own my digital textbooks."
              </p>
              <div className="mt-auto flex items-center">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-indigo-600"></div>
                <div className="ml-3">
                  <h4 className="font-semibold text-white">Alex Rodriguez</h4>
                  <p className="text-sm text-slate-400">Economics Student, Berkeley</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <p className="mb-6 text-slate-300">
                "LearnEX is awesome! Someone finally put blockchain security into educational content in a seamless way. It's so elegant and easy. I'm completely hooked."
              </p>
              <div className="mt-auto flex items-center">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-teal-600 to-emerald-600"></div>
                <div className="ml-3">
                  <h4 className="font-semibold text-white">Olivia Thompson</h4>
                  <p className="text-sm text-slate-400">Chemistry PhD, Cambridge</p>
                </div>
              </div>
            </motion.div>
              </div>
            </div>
      </section>

      {/* CTA Section - Cursor.com Style */}
      <section className="relative py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">Build your knowledge faster</h2>
            <p className="mb-8 max-w-2xl text-lg text-slate-300">
              Intelligent, secure, and decentralized, LearnEX is the best way to access study materials.
            </p>
            
            <Link href="/marketplace">
              <Button variant="cursor-style" size="cursor-lg">
                Start Exploring
              </Button>
            </Link>
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
                <span className="bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent">EX</span>
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

