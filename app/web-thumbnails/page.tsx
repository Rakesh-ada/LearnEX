"use client"

import { useState, useEffect } from "react"
import { Loader2, Search, RefreshCw } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useWebThumbnail } from "@/hooks/use-web-thumbnail"
import { generatePixelThumbnail } from "@/lib/pixel-thumbnail-generator"
import { WebThumbnailsNav } from "@/components/web-thumbnails-nav"
import SpaceBackground from "@/components/space-background"

export default function WebThumbnailDemo() {
  const [topic, setTopic] = useState("Blockchain Technology")
  const [category, setCategory] = useState("blockchain")
  const [searchTerm, setSearchTerm] = useState("Blockchain Technology")
  const [searchCategory, setSearchCategory] = useState("blockchain")
  const [fallbackThumbnail, setFallbackThumbnail] = useState("")
  
  // Get web-based thumbnail
  const { thumbnailUrl, isLoading, error } = useWebThumbnail(searchTerm, searchCategory)
  
  // Generate fallback thumbnail for comparison
  useEffect(() => {
    setFallbackThumbnail(generatePixelThumbnail(searchTerm, searchCategory))
  }, [searchTerm, searchCategory])
  
  // Handle search
  const handleSearch = () => {
    setSearchTerm(topic)
    setSearchCategory(category)
  }
  
  return (
    <div className="relative min-h-screen">
      {/* Enhanced space background */}
      <SpaceBackground 
        density={1200} 
        speed={0.0003} 
        shootingStars={true}
        cosmicDust={false}
        colorTheme="mixed"
        parallax={true}
        twinkleEffects={true}
      />
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center mb-4">Web-Based 8-bit Thumbnail Generator</h1>
          
          <WebThumbnailsNav />
          
          <div className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-xl p-6 md:p-8 backdrop-blur-md">
            <p className="text-slate-300 mb-6">
              Enter a topic and category to generate a unique 8-bit pixel art thumbnail based on web search results.
              The generator will search for images related to your topic and convert them into pixel art.
            </p>
            
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Topic</label>
                <Input
                  placeholder="Enter a topic..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md bg-slate-800 border border-slate-700 p-2 text-white"
                >
                  <option value="blockchain">Blockchain</option>
                  <option value="programming">Programming</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="language">Language</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="biology">Biology</option>
                  <option value="computer-science">Computer Science</option>
                  <option value="literature">Literature</option>
                  <option value="history">History</option>
                  <option value="economics">Economics</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-center mb-10">
              <Button 
                onClick={handleSearch} 
                disabled={isLoading} 
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Generate Thumbnail
                  </>
                )}
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Web-Based 8-bit Thumbnail</h2>
                <div className="relative aspect-square overflow-hidden rounded-lg border border-purple-800/50 shadow-lg shadow-purple-900/20">
                  {isLoading ? (
                    <div className="flex h-full items-center justify-center bg-slate-800">
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-10 w-10 animate-spin text-purple-400" />
                        <p className="mt-4 text-sm text-slate-400">Searching web for "{searchTerm}"...</p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex h-full items-center justify-center bg-slate-800 text-center px-4">
                      <div>
                        <p className="text-red-400 mb-2">Error generating thumbnail</p>
                        <p className="text-sm text-slate-400">{error.message}</p>
                        <Button variant="outline" className="mt-4" onClick={handleSearch}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Try Again
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={thumbnailUrl}
                      alt={searchTerm}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover"
                    />
                  )}
                  
                  <div className="absolute bottom-3 left-3 z-10 rounded-md bg-black/80 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                    {searchCategory}
                  </div>
                  
                  <div className="absolute top-3 right-3 rounded-md bg-black/80 px-2 py-1 text-xs font-medium text-purple-400 backdrop-blur-sm">
                    web-8-bit
                  </div>
                </div>
                
                <p className="text-sm text-slate-400">
                  This thumbnail is generated by searching the web for images related to your topic
                  and converting them into pixel art using our category-specific color palette.
                </p>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Regular 8-bit Thumbnail</h2>
                <div className="relative aspect-square overflow-hidden rounded-lg border border-slate-700/50 shadow-md">
                  <Image
                    src={fallbackThumbnail}
                    alt={`${searchTerm} (fallback)`}
                    width={500}
                    height={500}
                    className="h-full w-full object-cover"
                  />
                  
                  <div className="absolute bottom-3 left-3 z-10 rounded-md bg-black/80 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                    {searchCategory}
                  </div>
                  
                  <div className="absolute top-3 right-3 rounded-md bg-black/80 px-2 py-1 text-xs font-medium text-slate-400 backdrop-blur-sm">
                    standard
                  </div>
                </div>
                
                <p className="text-sm text-slate-400">
                  This is the standard algorithm-generated thumbnail that creates a deterministic
                  pattern based solely on the title and category without using web search.
                </p>
              </div>
            </div>
            
            <div className="mt-12 pt-6 border-t border-slate-800">
              <h3 className="text-lg font-semibold mb-4">How It Works</h3>
              <ol className="list-decimal list-inside space-y-3 text-sm text-slate-300">
                <li>Enter a topic and select a category</li>
                <li>Our system searches for images related to your topic using the Unsplash and Pixabay APIs</li>
                <li>The best matching image is selected and processed into 8-bit pixel art</li>
                <li>The color palette is optimized based on your selected category</li>
                <li>The final thumbnail is generated and displayed</li>
              </ol>
              
              <div className="mt-6 bg-slate-800/50 rounded-lg p-4">
                <p className="text-xs text-slate-400">
                  <strong>Note:</strong> This feature requires API keys for Unsplash and/or Pixabay. 
                  If no API keys are configured, it will fall back to the standard thumbnail generator.
                  For demonstration purposes, the web search functionality might be simulated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 