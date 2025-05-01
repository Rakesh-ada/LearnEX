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

      {/* Hero Section - Modern Web3/AI Style */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-16">
        <div className="container mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="mb-4 flex justify-center">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                <span className="mr-1.5 flex h-2 w-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 animate-pulse"></span>
                Open Knowledge For Everyone
              </span>
            </div>
            
            <h1 className="mb-6 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-space">
              <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Web3 Open Library
              </span> 
              <br />
              For Everyone
            </h1>
            
            <p className="mb-10 mx-auto max-w-2xl text-xl text-slate-300">
              A community-owned educational resource hub where students can freely access, contribute, and share academic materials without centralized control.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
          >
            <Link href="/marketplace">
              <Button variant="cursor-style" size="cursor-lg" className="relative overflow-hidden group">
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 font-space">Explore Library</span>
              </Button>
            </Link>
            <Link href="/upload">
            <Button
              variant="outline"
                size="cursor-lg"
                className="border-white/10 text-white hover:bg-white/5 backdrop-blur-sm font-space relative overflow-hidden group"
            >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-indigo-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Contribute Content</span>
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

      {/* Features Section - Modern Web3/AI Style */}
      <section ref={featuredRef} className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              <span className="mx-4 text-sm font-medium text-gradient-purple-pink font-space">CORE PRINCIPLES</span>
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl font-space">Open Knowledge Ecosystem</h2>
            <p className="mx-auto max-w-2xl text-slate-300">
              LearnEX creates a decentralized library where educational content is owned by the community, accessible to all, and secured by blockchain technology.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative rounded-xl glass-card p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 opacity-0 blur transition duration-300 group-hover:opacity-30"></div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600/20 to-blue-500/20 border border-white/10">
                <Upload className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white font-space">Contribute & Share</h3>
              <p className="text-slate-300">
                Share your notes, research papers, and study guides with the community. Your contributions are stored on decentralized networks, ensuring permanent availability.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative rounded-xl glass-card p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 opacity-0 blur transition duration-300 group-hover:opacity-30"></div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-500/20 border border-white/10">
                <BookOpen className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white font-space">Discover & Access</h3>
              <p className="text-slate-300">
                Browse the open library of educational resources. Content is accessible to all community members, with no gatekeepers controlling what you can learn.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group relative rounded-xl glass-card p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 opacity-0 blur transition duration-300 group-hover:opacity-30"></div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10">
                <Download className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white font-space">Govern & Evolve</h3>
              <p className="text-slate-300">
                Participate in community governance to shape the future of the platform. As a contributor, you have a voice in how the library evolves and grows.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Modern Web3/AI Style */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              <span className="mx-4 text-sm font-medium text-gradient-blue-cyan font-space">TESTIMONIALS</span>
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl font-space">Loved by students worldwide</h2>
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
              className="group flex flex-col rounded-xl glass-card p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 blur transition duration-300 group-hover:opacity-20"></div>
              <div className="mb-4 text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
              </div>
              <p className="mb-6 text-slate-300">
                "LearnEX is at least a 2x improvement over traditional study materials. It's amazing having an AI guide, and is an incredible accelerator for me and my study group."
              </p>
              <div className="mt-auto flex items-center">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">EJ</div>
                <div className="ml-3">
                  <h4 className="font-semibold text-white font-space">Emma Johnson</h4>
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

