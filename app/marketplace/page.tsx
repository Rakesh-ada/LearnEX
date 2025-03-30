"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SpaceBackground from "@/components/space-background"
import NFTCard from "@/components/nft-card"
import NFTModal from "@/components/nft-modal"
import { Search, SlidersHorizontal, Loader2, ArrowUpDown } from "lucide-react"
import { getAllMaterials } from "@/lib/blockchain"
import { useWallet } from "@/hooks/use-wallet"
import ClientOnly from "@/lib/client-only"
import SimpleFallback from "@/components/simple-fallback"

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

  return (
    <main className="min-h-screen bg-slate-950 pt-12">
      <ClientOnly fallback={<SimpleFallback />}>
        <SpaceBackground density={1200} speed={0.0004} />
      </ClientOnly>

      <div className="relative z-10 mb-6 overflow-hidden bg-gradient-to-b from-purple-900/20 to-slate-950/0 py-8">
        <div className="container relative mx-auto px-4">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl"></div>
          <div className="absolute -left-24 top-12 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl"></div>
          
          <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              LearnEX Marketplace
            </span>
          </h1>
          <p className="mx-auto mb-6 max-w-2xl text-center text-sm text-slate-400 md:text-base">
            Discover and purchase tokenized educational materials on the blockchain. 
            Own your learning resources with verified authenticity and provenance.
          </p>
        </div>
      </div>

      <section className="relative py-4">
        <div className="container mx-auto px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-slate-900/0 to-transparent" />
          
          <div className="relative z-10">
            <div className="relative z-10">
              <div className="mx-auto mb-6 max-w-3xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 z-20">
                      <Search className="h-5 w-5 text-blue-400/90" />
                    </div>
                    
                    <Input
                      type="text"
                      placeholder="Search study materials..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-700/50 bg-slate-900/70 pl-12 pr-[140px] text-white 
                        shadow-lg shadow-blue-500/5 backdrop-blur-md placeholder:text-slate-400 
                        focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    />
                    
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger 
                          className="h-9 w-[110px] border-0 bg-transparent text-white/80 
                            hover:text-white focus:ring-0 focus:ring-offset-0"
                        >
                          <div className="flex items-center gap-2 text-sm">
                            <ArrowUpDown className="h-4 w-4 text-cyan-400/80" />
                            {sortBy === "newest" ? "New " : 
                             sortBy === "price-low" ? "Low " :
                             sortBy === "price-high" ? "High " : "Sort"}
                          </div>
                        </SelectTrigger>
                        <SelectContent 
                          className="rounded-lg border border-slate-700/50 bg-slate-900/90 
                            text-white shadow-xl shadow-blue-500/10 backdrop-blur-md min-w-[140px]"
                        >
                          <SelectItem 
                            value="newest"
                            className="hover:bg-blue-500/20 focus:bg-blue-500/20"
                          >
                            Newest First
                          </SelectItem>
                          <SelectItem 
                            value="price-low"
                            className="hover:bg-blue-500/20 focus:bg-blue-500/20"
                          >
                            Price: Lowest
                          </SelectItem>
                          <SelectItem 
                            value="price-high"
                            className="hover:bg-blue-500/20 focus:bg-blue-500/20"
                          >
                            Price: Highest
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex h-12 items-center gap-2 rounded-xl border border-slate-700/50 
                      bg-slate-900/70 px-4 text-white shadow-lg shadow-blue-500/5 backdrop-blur-md 
                      hover:border-blue-500/50 hover:bg-slate-800/70 md:hidden"
                    variant="outline"
                  >
                    <SlidersHorizontal className="h-5 w-5 text-blue-400" />
                    Filters
                  </Button>
                </div>
              </div>
            </div>

            {isFilterOpen && (
              <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/90 p-5 shadow-lg shadow-blue-500/5 backdrop-blur-md md:hidden">
                <h3 className="mb-3 font-medium text-white">Categories</h3>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <Button
                      key={cat}
                      variant={category === cat ? "default" : "outline"}
                      size="sm"
                      className={`${
                        category === cat 
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white" 
                          : "border-slate-700 bg-slate-800/50 text-white hover:border-blue-500/50"
                      } text-xs px-2 py-1 h-auto rounded-lg`}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8 hidden md:block">
              <div className="flex flex-wrap justify-center gap-1.5">
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    variant={category === cat ? "default" : "outline"}
                    size="sm"
                    className={`${
                      category === cat 
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white" 
                        : "border-slate-700 bg-slate-800/50 text-white hover:border-blue-500/50"
                    } text-xs px-3 py-1 h-auto rounded-lg`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-2">
              {isLoading && (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="flex flex-col items-center">
                    <Loader2 className="mb-4 h-10 w-10 animate-spin text-blue-500" />
                    <p className="text-white">Loading marketplace items...</p>
                  </div>
                </div>
              )}

              {!isLoading && error && (
                <div className="flex min-h-[400px] flex-col items-center justify-center">
                  <div className="rounded-xl border border-red-500/30 bg-red-900/10 p-6 text-center backdrop-blur">
                    <p className="text-red-400">{error}</p>
                    <Button 
                      className="mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              )}

              {!isLoading && !error && filteredItems.length === 0 && (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-6 text-center backdrop-blur-md">
                    <p className="text-slate-400">No items found for your search criteria.</p>
                  </div>
                </div>
              )}

              {!isLoading && !error && filteredItems.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredItems.map((item) => (
                    <NFTCard key={item.id} item={item} onClick={() => openModal(item)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {selectedItem && (
        <NFTModal isOpen={isModalOpen} onClose={closeModal} item={selectedItem} />
      )}
    </main>
  )
}
