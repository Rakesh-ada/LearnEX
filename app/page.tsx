"use client"

import { useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import SpaceBackground from "@/components/space-background"
import { ChevronRight, BookOpen, Upload, Download, Shield, Brain, Database, Users, FileText, GraduationCap, Check, ArrowRight, MessageSquare } from "lucide-react"
import { motion, useAnimationControls } from "framer-motion"
import ClientOnly from "@/lib/client-only"
import SimpleFallback from "@/components/simple-fallback"

export default function Home() {
  const featuredRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)

  // Scroll to featured section
  const scrollToFeatured = () => {
    featuredRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <main className="relative min-h-screen">
      <ClientOnly fallback={<SimpleFallback />}>
        <SpaceBackground colorTheme="purple" shootingStars={true} cosmicDust={true} />
      </ClientOnly>

      {/* Hero Section - Better centered and fixed */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-16">
        <div className="container mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="mb-10 flex justify-center">
              <span className="inline-flex items-center rounded-full px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] shadow-lg">
                BLOCKCHAIN-POWERED EDUCATION
              </span>
            </div>
            
            <h1 className="mb-8 text-center text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-space">
              <div className="inline-block">
                <span className="bg-gradient-to-r from-[#a855f7] via-[#6366f1] to-[#3b82f6] bg-clip-text text-transparent">
                  Web3
                </span>
                <span className="text-white">‎ Content Marketplace</span>
              </div>
            </h1>
            
            <p className="mb-12 mx-auto max-w-2xl text-xl text-white/80 leading-relaxed font-light">
              The decentralized learning platform where academic excellence meets 
              blockchain security. Own, share, and access verified educational content without 
              boundaries.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0"
          >
            <Link href="/marketplace">
              <Button variant="cursor-style" size="cursor-lg" className="relative overflow-hidden group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8 py-4 text-base">
                <span className="relative z-10 font-space font-medium flex items-center">
                  Explore Library
                  <ChevronRight className="ml-2 h-5 w-5" />
                </span>
              </Button>
            </Link>
            <Link href="/upload">
              <Button
                variant="outline"
                size="cursor-lg"
                className="border-white/20 text-white hover:bg-white/5 backdrop-blur-sm font-space relative overflow-hidden group px-8 py-4 text-base"
              >
                <span className="relative z-10 font-medium flex items-center">
                  Contribute
                  <Upload className="ml-2 h-4 w-4" />
                </span>
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
          className="absolute bottom-8 flex flex-col items-center cursor-pointer"
          onClick={scrollToFeatured}
        >
          <span className="mb-2 text-sm text-white/80"></span>
          <div className="relative h-10 w-6 rounded-full border-2 border-white/50">
            <div className="absolute left-1/2 top-2 h-2 w-2 -translate-x-1/2 rounded-full bg-white"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section - Enhanced with more details */}
      <section ref={featuredRef} className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="mb-20 text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              <span className="mx-4 text-sm font-medium text-gradient-purple-pink font-space tracking-widest">CORE PRINCIPLES</span>
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </div>
            <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl font-space tracking-tight">Open Knowledge Ecosystem</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-300 leading-relaxed">
              Built on the principles of openness, security, and community ownership. LearnEX transforms how we share and access educational content.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 - Enhanced with bullets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative rounded-xl glass-card p-8 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 border border-white/5"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 opacity-0 blur transition duration-500 group-hover:opacity-30"></div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600/20 to-blue-500/20 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                <Upload className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-white font-space tracking-tight">Contribute & Earn</h3>
              <p className="text-slate-300 leading-relaxed">
                Share your academic knowledge with the community and receive compensation through smart contracts. Your contributions are securely stored with:
              </p>
              <ul className="mt-4 text-slate-300 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-purple-400">•</span>
                  Smart contract royalties on each download
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-400">•</span>
                  Immutable proof of authorship
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-purple-400">•</span>
                  Decentralized, permanent storage
                </li>
              </ul>
            </motion.div>

            {/* Feature 2 - Enhanced with bullets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative rounded-xl glass-card p-8 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 border border-white/5"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 opacity-0 blur transition duration-500 group-hover:opacity-30"></div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-500/20 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-white font-space tracking-tight">Discover & Learn</h3>
              <p className="text-slate-300 leading-relaxed">
                Access a vast library of verified educational resources with our AI-powered smart assistant.
              </p>
              <ul className="mt-4 text-slate-300 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-blue-400">•</span>
                  AI-powered content recommendations
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-400">•</span>
                  Verified academic materials
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-blue-400">•</span>
                  Interactive learning experiences
                </li>
              </ul>
            </motion.div>

            {/* Feature 3 - Enhanced with bullets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group relative rounded-xl glass-card p-8 backdrop-blur-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 border border-white/5"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 opacity-0 blur transition duration-500 group-hover:opacity-30"></div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                <Download className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-white font-space tracking-tight">Own & Control</h3>
              <p className="text-slate-300 leading-relaxed">
                True ownership of your educational materials through blockchain verification.
              </p>
              <ul className="mt-4 text-slate-300 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400">•</span>
                  Full control over your content
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400">•</span>
                  Community governance participation
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-400">•</span>
                  Customizable access and pricing
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section - New Section */}
      <section ref={howItWorksRef} className="relative py-24 bg-gradient-to-b from-slate-900/0 to-slate-900/30">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              <span className="mx-4 text-sm font-medium text-gradient-blue-cyan font-space tracking-widest">PLATFORM WORKFLOW</span>
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            </div>
            <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl font-space tracking-tight">How LearnEX Works</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-300 leading-relaxed">
              Our blockchain-powered education platform connects learners and educators in a transparent ecosystem
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-white text-2xl font-bold">1</div>
              <div className="absolute top-8 left-16 h-0.5 w-[calc(100%-32px)] bg-gradient-to-r from-purple-500 to-transparent hidden md:block"></div>
              <h3 className="mb-3 text-xl font-bold text-white">Create Account</h3>
              <p className="text-slate-300">Connect your wallet to establish your secure, blockchain-verified identity on the platform</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-white text-2xl font-bold">2</div>
              <div className="absolute top-8 left-16 h-0.5 w-[calc(100%-32px)] bg-gradient-to-r from-purple-500 to-transparent hidden md:block"></div>
              <h3 className="mb-3 text-xl font-bold text-white">Explore Content</h3>
              <p className="text-slate-300">Browse AI-curated educational materials tailored to your interests and learning goals</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-white text-2xl font-bold">3</div>
              <div className="absolute top-8 left-16 h-0.5 w-[calc(100%-32px)] bg-gradient-to-r from-purple-500 to-transparent hidden md:block"></div>
              <h3 className="mb-3 text-xl font-bold text-white">Learn & Contribute</h3>
              <p className="text-slate-300">Access resources with full ownership rights or create and share your own verified materials</p>
            </motion.div>
            
            {/* Step 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="relative"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-white text-2xl font-bold">4</div>
              <h3 className="mb-3 text-xl font-bold text-white">Earn & Grow</h3>
              <p className="text-slate-300">Receive tokens for your contributions and participation in the community governance</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology & Benefits Section - New Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              <span className="mx-4 text-sm font-medium text-gradient-purple-pink font-space tracking-widest">PLATFORM TECHNOLOGY</span>
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </div>
            <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl font-space tracking-tight">Blockchain & AI Integration</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-300 leading-relaxed">
              LearnEX combines cutting-edge technologies to create a secure, transparent, and personalized learning ecosystem
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left side - Blockchain */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative rounded-xl glass-card backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 border border-white/5 p-8 overflow-hidden"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 opacity-10 blur transition duration-500 group-hover:opacity-30"></div>
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-purple-600 to-indigo-500 opacity-40 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h3 className="text-2xl font-bold text-white mb-6 font-space group-hover:translate-y-[-2px] transition-transform duration-300">Blockchain Security</h3>
              
              <div className="space-y-4">
                <div className="flex items-start group/item transition-all duration-300 hover:translate-x-1">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform duration-300">
                    <Shield className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Immutable Records</h4>
                    <p className="text-slate-300">All educational content is permanently recorded on blockchain, preventing unauthorized modifications</p>
                  </div>
                </div>
                
                <div className="flex items-start group/item transition-all duration-300 hover:translate-x-1">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform duration-300">
                    <Database className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Smart Contracts</h4>
                    <p className="text-slate-300">Automated agreements ensure creators receive fair compensation for their contributions</p>
                  </div>
                </div>
                
                <div className="flex items-start group/item transition-all duration-300 hover:translate-x-1">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform duration-300">
                    <svg className="h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Decentralized Governance</h4>
                    <p className="text-slate-300">Community voting on platform changes and content moderation policies</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right side - AI */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative rounded-xl glass-card backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 border border-white/5 p-8 overflow-hidden"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 opacity-10 blur transition duration-500 group-hover:opacity-30"></div>
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-600 to-indigo-500 opacity-40 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h3 className="text-2xl font-bold text-white mb-6 font-space group-hover:translate-y-[-2px] transition-transform duration-300">AI-Powered Learning</h3>
              
              <div className="space-y-4">
                <div className="flex items-start group/item transition-all duration-300 hover:translate-x-1">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform duration-300">
                    <Brain className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Smart Assistant</h4>
                    <p className="text-slate-300">AI tutor that answers questions, explains concepts, and guides your learning journey</p>
                  </div>
                </div>
                
                <div className="flex items-start group/item transition-all duration-300 hover:translate-x-1">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform duration-300">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Personalized Recommendations</h4>
                    <p className="text-slate-300">Content suggestions tailored to your learning style, pace, and goals</p>
                  </div>
                </div>
                
                <div className="flex items-start group/item transition-all duration-300 hover:translate-x-1">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform duration-300">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Knowledge Verification</h4>
                    <p className="text-slate-300">Automated quality control ensures accuracy and relevance of all educational materials</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's In It For You Section */}
      <section className="relative py-24 bg-gradient-to-b from-slate-900/0 to-slate-900/20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
              <span className="mx-4 text-sm font-medium text-gradient-blue-indigo font-space tracking-widest">TAILORED SOLUTIONS</span>
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
            </div>
            <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl font-space tracking-tight">Unlock Your Full Potential</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-300 leading-relaxed">
              LearnEX delivers unique benefits for content creators, learners, and organizations with a tailored approach to educational content
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* For Content Creators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative rounded-xl glass-card backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 border border-white/5 overflow-hidden"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 blur transition duration-500 group-hover:opacity-30"></div>
              <div className="h-2 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
              <div className="p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600/10 border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-7 w-7 text-purple-400" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white font-space tracking-tight">For Content Creators</h3>
                
                <div className="space-y-6 mt-6">
                  <div>
                    <h4 className="flex items-center text-lg font-medium text-white">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center mr-2">
                        <Check className="h-3 w-3 text-purple-400" />
                      </span>
                      Set Your Own Price
                    </h4>
                    <p className="pl-7 text-slate-300 mt-1">Complete freedom to price your educational content based on its value, without platform restrictions</p>
                  </div>
                  
                  <div>
                    <h4 className="flex items-center text-lg font-medium text-white">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center mr-2">
                        <Check className="h-3 w-3 text-purple-400" />
                      </span>
                      Direct Compensation
                    </h4>
                    <p className="pl-7 text-slate-300 mt-1">No hefty middleman fees—keep up to 95% of your earnings through transparent smart contracts</p>
                  </div>
                  
                  <div>
                    <h4 className="flex items-center text-lg font-medium text-white">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center mr-2">
                        <Check className="h-3 w-3 text-purple-400" />
                      </span>
                      Verified Ownership
                    </h4>
                    <p className="pl-7 text-slate-300 mt-1">Immutable blockchain proof of your content authorship prevents plagiarism and protects your intellectual property</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* For Learners */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative rounded-xl glass-card backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 border border-white/5 overflow-hidden"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 opacity-0 blur transition duration-500 group-hover:opacity-30"></div>
              <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
              <div className="p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/10 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="h-7 w-7 text-blue-400" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white font-space tracking-tight">For Learners</h3>
                
                <div className="space-y-6 mt-6">
                  <div>
                    <h4 className="flex items-center text-lg font-medium text-white">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                        <Check className="h-3 w-3 text-blue-400" />
                      </span>
                      AI-Enhanced Learning
                    </h4>
                    <p className="pl-7 text-slate-300 mt-1">Study with an intelligent AI assistant that answers questions and explains difficult concepts in real-time</p>
                  </div>
                  
                  <div>
                    <h4 className="flex items-center text-lg font-medium text-white">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                        <Check className="h-3 w-3 text-blue-400" />
                      </span>
                      Curated Quality Content
                    </h4>
                    <p className="pl-7 text-slate-300 mt-1">Access verified educational materials handpicked for accuracy and educational value</p>
                  </div>
                  
                  <div>
                    <h4 className="flex items-center text-lg font-medium text-white">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                        <Check className="h-3 w-3 text-blue-400" />
                      </span>
                      True Content Ownership
                    </h4>
                    <p className="pl-7 text-slate-300 mt-1">When you purchase content, it's truly yours—secured by blockchain and accessible anywhere, anytime</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* For Organizations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group relative rounded-xl glass-card backdrop-blur-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 border border-white/5 overflow-hidden"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-violet-500 opacity-0 blur transition duration-500 group-hover:opacity-30"></div>
              <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
              <div className="p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600/10 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-7 w-7 text-indigo-400" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white font-space tracking-tight">For Organizations</h3>
                
                <div className="space-y-6 mt-6">
                  <div>
                    <h4 className="flex items-center text-lg font-medium text-white">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center mr-2">
                        <Check className="h-3 w-3 text-indigo-400" />
                      </span>
                      Private Content Distribution
                    </h4>
                    <p className="pl-7 text-slate-300 mt-1">Share proprietary materials through secure, private contract addresses accessible only to authorized users</p>
                  </div>
                  
                  <div>
                    <h4 className="flex items-center text-lg font-medium text-white">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center mr-2">
                        <Check className="h-3 w-3 text-indigo-400" />
                      </span>
                      Custom Learning Environments
                    </h4>
                    <p className="pl-7 text-slate-300 mt-1">Create branded learning spaces with tailored content collections for your team or customers</p>
                  </div>
                  
                  <div>
                    <h4 className="flex items-center text-lg font-medium text-white">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center mr-2">
                        <Check className="h-3 w-3 text-indigo-400" />
                      </span>
                      Analytics & Insights
                    </h4>
                    <p className="pl-7 text-slate-300 mt-1">Gain detailed metrics on content usage and learning patterns to optimize your educational offerings</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section - New Section */}
      <section className="relative py-24 bg-gradient-to-b from-slate-900/0 to-slate-900/30">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              <span className="mx-4 text-sm font-medium text-gradient-purple-pink font-space tracking-widest">QUESTIONS & ANSWERS</span>
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </div>
            <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl font-space tracking-tight">Frequently Asked Questions</h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {/* FAQ Item 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative mb-6 rounded-xl glass-card p-6 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 border border-white/5 overflow-hidden"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 opacity-0 blur transition duration-500 group-hover:opacity-20"></div>
              <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform duration-300 font-space">What makes LearnEX different from traditional learning platforms?</h3>
              <p className="text-slate-300 leading-relaxed">LearnEX leverages blockchain technology to provide immutable proof of authorship, fair compensation through smart contracts, and truly decentralized ownership of educational content. Combined with AI-powered personalization, it creates a more secure, fair, and effective learning ecosystem.</p>
            </motion.div>
            
            {/* FAQ Item 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative mb-6 rounded-xl glass-card p-6 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 border border-white/5 overflow-hidden"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 opacity-0 blur transition duration-500 group-hover:opacity-20"></div>
              <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform duration-300 font-space">Do I need cryptocurrency to use LearnEX?</h3>
              <p className="text-slate-300 leading-relaxed">While our platform utilizes blockchain technology, we've designed it to be accessible to everyone. You can browse and access many resources without cryptocurrency, but a digital wallet is recommended for full platform benefits, including content ownership and creator rewards.</p>
            </motion.div>
            
            {/* FAQ Item 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative mb-6 rounded-xl glass-card p-6 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-500 border border-white/5 overflow-hidden"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 opacity-0 blur transition duration-500 group-hover:opacity-20"></div>
              <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform duration-300 font-space">How is content quality maintained?</h3>
              <p className="text-slate-300 leading-relaxed">LearnEX employs a multi-layered verification system combining AI analysis, peer reviews from subject matter experts, and community ratings. This ensures all educational materials meet high standards of accuracy, clarity, and educational value.</p>
            </motion.div>
            
            {/* FAQ Item 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group relative rounded-xl glass-card p-6 backdrop-blur-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 border border-white/5 overflow-hidden"
            >
              <div className="absolute -inset-0.5 -z-10 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 opacity-0 blur transition duration-500 group-hover:opacity-20"></div>
              <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform duration-300 font-space">Can I earn by contributing educational content?</h3>
              <p className="text-slate-300 leading-relaxed">Absolutely! LearnEX rewards content creators through our tokenized ecosystem. When you share high-quality educational materials, you receive compensation both from direct purchases and ongoing usage royalties, all secured and automated through smart contracts.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visual Showcase */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/0 via-purple-900/5 to-blue-900/10 z-0"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-16"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center justify-center mb-6">
                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                <span className="mx-4 text-sm font-medium text-gradient-blue-cyan font-space tracking-widest">SEAMLESS EXPERIENCE</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-6 font-space tracking-tight">Learn Anywhere, <br />Own Everything</h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Access your educational content across all devices with our responsive platform. Your blockchain-verified materials are always available, whether you're on desktop, tablet, or mobile.
              </p>
              
              <div className="space-y-4">
                {[
                  "Interactive learning modules adapt to your device",
                  "Instant blockchain verification of content authenticity",
                  "Seamless synchronization across all your devices"
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mr-3 mt-1">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-slate-200">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative">
                {/* Desktop mockup */}
                <div className="relative z-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/10 shadow-2xl p-2 max-w-xl mx-auto">
                  <div className="rounded-lg overflow-hidden border border-white/10">
                    <div className="h-6 bg-gray-800 flex items-center px-3">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 h-64 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-white text-lg font-medium mb-2">LearnEX Platform</h3>
                        <p className="text-slate-400">Interactive dashboard view</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mobile mockup */}
                <div className="absolute bottom-0 -right-10 z-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/10 shadow-xl p-1 w-32 h-56">
                  <div className="rounded-lg overflow-hidden border border-white/10 h-full">
                    <div className="h-3 bg-gray-800 flex items-center justify-center">
                      <div className="h-1 w-6 rounded-full bg-gray-700"></div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 h-full flex items-center justify-center p-2">
                      <div className="text-center">
                        <p className="text-white text-xs">Mobile View</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-blue-500/10 rounded-full blur-xl"></div>
                <div className="absolute -top-10 -right-10 h-32 w-32 bg-purple-500/10 rounded-full blur-xl"></div>
              </div>
            </motion.div>
              </div>
            </div>
      </section>

      {/* CTA Section - Reimagined */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-purple-900/10 to-blue-900/20 z-0"></div>
        <motion.div 
          className="absolute -right-24 top-1/3 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl z-0"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute -left-24 bottom-1/3 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl z-0"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/70 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="relative p-8 md:p-12">
                {/* Background decorations */}
                <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
                
                <div className="relative flex flex-col md:flex-row md:items-center">
                  <div className="md:w-3/5 mb-8 md:mb-0 md:pr-8">
                    <h2 className="text-4xl font-bold text-white mb-6 font-space tracking-tight">
                      Join The Educational Revolution
            </h2>
                    <p className="text-xl text-slate-200 mb-8 leading-relaxed">
                      Become part of a growing community that's redefining how knowledge is shared, verified, and rewarded. Start your journey today.
            </p>
            
                    <div className="flex flex-wrap gap-4">
            <Link href="/marketplace">
                        <Button variant="cursor-style" size="cursor-lg" className="px-8 py-6 text-base font-medium rounded-xl transition-all duration-300 relative overflow-hidden group">
                          <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 opacity-90 group-hover:opacity-100 transition-all duration-300"></span>
                <span className="relative z-10 flex items-center">
                            Start Learning
                  <ChevronRight className="ml-2 h-5 w-5" />
                </span>
              </Button>
            </Link>
                      <Link href="/upload">
                        <Button variant="outline" size="cursor-lg" className="border-white/20 text-white hover:bg-white/5 backdrop-blur-sm font-space px-8 py-6 text-base">
                          <span className="relative z-10 flex items-center">
                            Become a Creator
                            <Upload className="ml-2 h-5 w-5" />
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="md:w-2/5">
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 border border-white/5">
                      <h3 className="text-white text-xl font-medium mb-4 flex items-center">
                        <Shield className="h-5 w-5 text-purple-400 mr-2" /> Free Account Includes:
                      </h3>
                      <ul className="space-y-3">
                        {[
                          "Access to community-shared resources",
                          "AI-powered study recommendations",
                          "Limited content creation tools",
                          "Blockchain wallet integration"
                        ].map((item, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                            className="flex items-center text-slate-300"
                          >
                            <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-sm text-center text-slate-400">No credit card required to start</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          </motion.div>
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

