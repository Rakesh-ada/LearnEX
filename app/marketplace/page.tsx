"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SpaceBackground from "@/components/space-background"
import NFTCard from "@/components/nft-card"
import NFTModal from "@/components/nft-modal"
import { Search, SlidersHorizontal, Loader2, ArrowUpDown, Filter, Star, Tag, Clock, ShoppingBag, Award } from "lucide-react"
import { getAllMaterials } from "@/lib/blockchain"
import { useWallet } from "@/hooks/use-wallet"
import ClientOnly from "@/lib/client-only"
import SimpleFallback from "@/components/simple-fallback"
import { Badge } from "@/components/ui/badge"

interface MaterialItem {
  id: string
  title: string
  description: string
  price: string
  author: string
  category: string
  image: string
  createdAt: string
  isActive: boolean
}

const CATEGORIES = [
  "All",
  "Blockchain",
  "Programming",
  "Design",
  "Business", 
  "Mathematics",
  "Science",
  "Language",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Literature",
  "History",
  "Economics",
  "Other"
]

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariant = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 25 } }
};

const fadeIn = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function MarketplacePage() {
  const { currentAccount } = useWallet()
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("All")
  const [sortBy, setSortBy] = useState("popular")
  const [materials, setMaterials] = useState<MaterialItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MaterialItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MaterialItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setIsLoading(true)
        const fetchedMaterials = await getAllMaterials(0, 50)
        
        const formattedMaterials = fetchedMaterials
          .filter(material => 
            material?.id &&
            material?.title?.trim() &&
            material?.description?.trim() &&
            material?.price &&
            material?.owner?.trim() &&
            material?.category?.trim() &&
            material?.createdAt
          )
          .map(material => ({
            id: material.id.toString(),
            title: material.title.trim(),
            description: material.description.trim(),
            price: `${material.price} ETH`,
            author: material.owner.trim(),
            category: material.category.trim(),
            image: "/placeholder.svg?height=400&width=400",
            createdAt: material.createdAt,
            isActive: material.isActive ?? true
          }))
        
        setMaterials(formattedMaterials)
        setError(null)
      } catch (err) {
        console.error("Error fetching materials:", err)
        setError("Failed to load marketplace items. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaterials()
  }, [])

  useEffect(() => {
    let items = [...materials]

    if (searchTerm) {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (category !== "All") {
      items = items.filter((item) => 
        item.category.toLowerCase() === category.toLowerCase() ||
        (item.category.toLowerCase() === 'computer-science' && category.toLowerCase() === 'computer science')
      )
    }

    if (sortBy === "price-low") {
      items.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    } else if (sortBy === "price-high") {
      items.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
    } else if (sortBy === "newest") {
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    setFilteredItems(items)
  }, [searchTerm, category, sortBy, materials])

  const openModal = (item: MaterialItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  // Function to get a color for the category badge
  const getCategoryColor = (category: string): string => {
    const categoryMap: Record<string, string> = {
      "blockchain": "bg-purple-600 hover:bg-purple-700",
      "programming": "bg-blue-600 hover:bg-blue-700",
      "design": "bg-pink-600 hover:bg-pink-700",
      "business": "bg-emerald-600 hover:bg-emerald-700",
      "mathematics": "bg-amber-600 hover:bg-amber-700",
      "science": "bg-cyan-600 hover:bg-cyan-700",
      "computer science": "bg-indigo-600 hover:bg-indigo-700",
      "computer-science": "bg-indigo-600 hover:bg-indigo-700",
      "physics": "bg-blue-600 hover:bg-blue-700",
      "chemistry": "bg-green-600 hover:bg-green-700",
      "biology": "bg-teal-600 hover:bg-teal-700"
    }
    
    const normalizedCategory = category.toLowerCase();
    return categoryMap[normalizedCategory] || "bg-slate-600 hover:bg-slate-700";
  }

  // Function to format the date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  }

  return (
    <main className="min-h-screen pt-16">
      <ClientOnly fallback={<SimpleFallback />}>
        <SpaceBackground 
          density={1500} 
          speed={0.0003} 
          shootingStars={true}
          cosmicDust={true}
          colorTheme="mixed"
          parallax={true}
          twinkleEffects={true}
        />
      </ClientOnly>

      <section className="relative py-10">
        <div className="container mx-auto px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-slate-900/0 to-transparent" />
          
          <div className="relative z-10">
            {/* Header with title */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="mb-10 text-center"
            >
              <h1 className="text-4xl font-bold text-white mb-3">Educational Marketplace</h1>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Discover and purchase high-quality educational materials across various subjects
              </p>
            </motion.div>
            
            <div className="relative z-10">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mx-auto mb-8 max-w-3xl"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 z-20">
                      <Search className="h-5 w-5 text-purple-400/90" />
                    </div>
                    
                    <Input
                      type="text"
                      placeholder="Search study materials..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-700/50 bg-slate-900/50 pl-12 pr-[140px] text-white 
                        shadow-lg shadow-purple-500/5 backdrop-blur-sm placeholder:text-slate-400 
                        focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10"
                    />
                    
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger 
                          className="h-9 w-[110px] border-0 bg-transparent text-white/80 
                            hover:text-white focus:ring-0 focus:ring-offset-0"
                        >
                          <div className="flex items-center gap-2 text-sm">
                            <ArrowUpDown className="h-4 w-4 text-purple-400/80" />
                            {sortBy === "newest" ? "Newest" : 
                             sortBy === "price-low" ? "Lowest" :
                             sortBy === "price-high" ? "Highest" : "Sort By"}
                          </div>
                        </SelectTrigger>
                        <SelectContent 
                          className="rounded-lg border border-slate-700/50 bg-slate-900/90 
                            text-white shadow-xl shadow-purple-500/10 backdrop-blur-md min-w-[140px]"
                        >
                          <SelectItem 
                            value="newest"
                            className="hover:bg-purple-500/20 focus:bg-purple-500/20"
                          >
                            Newest First
                          </SelectItem>
                          <SelectItem 
                            value="price-low"
                            className="hover:bg-purple-500/20 focus:bg-purple-500/20"
                          >
                            Price: Lowest
                          </SelectItem>
                          <SelectItem 
                            value="price-high"
                            className="hover:bg-purple-500/20 focus:bg-purple-500/20"
                          >
                            Price: Highest
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Mobile filter toggle button */}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="md:hidden">
                    <Button
                      variant="outline"
                      className="w-full border-slate-700 text-white hover:border-purple-500 hover:bg-purple-500/20"
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters {category !== "All" && `(${category})`}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {isFilterOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 rounded-md border border-slate-700 bg-slate-900/90 p-4 backdrop-blur-md md:hidden overflow-hidden"
              >
                <h3 className="mb-2 font-medium text-white">Categories</h3>
                <div className="flex flex-wrap gap-1">
                  {CATEGORIES.map((cat) => (
                    <motion.div key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={category === cat ? "default" : "outline"}
                      size="sm"
                        className={`${category === cat ? "bg-purple-600 hover:bg-purple-700" : "border-slate-700 text-white hover:bg-slate-800"} text-xs rounded-md px-3 py-1.5 h-auto transition-all duration-200`}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8 hidden md:block"
            >
              <div className="flex flex-wrap justify-center gap-2">
                {CATEGORIES.map((cat) => (
                  <motion.div 
                    key={cat} 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                  <Button
                    variant={category === cat ? "default" : "outline"}
                    size="sm"
                      className={`${
                        category === cat 
                          ? "bg-purple-600 hover:bg-purple-700" 
                          : "border-slate-700 text-white hover:bg-slate-800"
                      } text-xs font-medium rounded-md px-3 py-1.5 h-auto transition-all duration-200`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {isLoading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-60 items-center justify-center"
              >
                  <div className="flex flex-col items-center">
                  <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
                  <p className="mt-4 text-slate-400">Loading materials...</p>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-60 flex-col items-center justify-center"
              >
                <div className="rounded-xl bg-red-900/20 p-8 text-center backdrop-blur-sm">
                  <p className="mb-4 text-lg text-red-400">{error}</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => window.location.reload()}
                      className="bg-red-600 hover:bg-red-700"
                  >
                    Try Again
                  </Button>
                  </motion.div>
                </div>
              </motion.div>
            ) : filteredItems.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-60 flex-col items-center justify-center"
              >
                <div className="rounded-xl bg-slate-900/50 p-8 text-center backdrop-blur-sm">
                  <p className="mb-4 text-lg text-slate-400">No materials found matching your criteria.</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setCategory("All")
                      }}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Reset Filters
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {filteredItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    variants={itemVariant}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => openModal(item)}
                    whileHover={{ 
                      scale: 1.03, 
                      boxShadow: "0 20px 25px -5px rgba(112, 26, 117, 0.15), 0 10px 10px -5px rgba(112, 26, 117, 0.1)"
                    }}
                    className="group relative transform overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-1 transition-all duration-300"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredItem === item.id ? 1 : 0 }}
                      className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-500/5 transition-opacity duration-300"
                    />
                    
                    <div className="relative h-full overflow-hidden rounded-lg border border-slate-700/50 bg-slate-900">
                      <NFTCard
                        item={item}
                        onClick={() => {}}
                      />
                      
                      {/* Hover overlay with clearer CTA */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredItem === item.id ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black/80 to-black/90 backdrop-blur-sm"
                      >
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ 
                            y: hoveredItem === item.id ? 0 : 20,
                            opacity: hoveredItem === item.id ? 1 : 0
                          }}
                          transition={{ delay: 0.1 }}
                          className="text-center"
                        >
                          <p className="text-center text-xl font-bold text-white">{item.title}</p>
                          <div className="mt-2 flex items-center justify-center">
                            <span className="rounded-full bg-purple-600/80 px-3 py-1 text-xs text-white backdrop-blur-sm">
                              {item.category}
                            </span>
                          </div>
                          <p className="mt-3 font-semibold text-white">{item.price}</p>
                        </motion.div>
                        
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ 
                            y: hoveredItem === item.id ? 0 : 20,
                            opacity: hoveredItem === item.id ? 1 : 0
                          }}
                          transition={{ delay: 0.2 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="mt-4"
                        >
                          <Button 
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            size="sm"
                          >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {/* Results count and pagination */}
              {!isLoading && !error && filteredItems.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-10 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0"
              >
                <p className="text-sm text-slate-400">
                  Showing <span className="font-medium text-white">{filteredItems.length}</span> of {materials.length} materials
                </p>
                
                <div className="flex items-center space-x-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-slate-700 text-white hover:bg-slate-800"
                      disabled
                    >
                      Previous
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                      disabled
                    >
                      Load More
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
              )}
          </div>
        </div>
      </section>

      {selectedItem && (
        <NFTModal
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </main>
  )
}
