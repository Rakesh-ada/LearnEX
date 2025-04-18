"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MaterialCard from "@/components/material-card"
import { FileText, Download, Lock, BookOpen } from "lucide-react"
import Loader from "@/components/ui/cube-loader"
import { useWallet } from "@/hooks/use-wallet"
import { getMyPurchasedMaterials, getContentHash } from "@/lib/blockchain"
import { toast } from "@/hooks/use-toast"
import ContentViewer from "@/components/content-viewer"
import SpaceBackground from "@/components/space-background"
import ClientOnly from "@/lib/client-only"
import SimpleFallback from "@/components/simple-fallback"

export default function MyMaterialsPage() {
  const { currentAccount, connect } = useWallet()
  const [activeTab, setActiveTab] = useState("all")
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null)
  const [purchasedMaterials, setPurchasedMaterials] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contentHash, setContentHash] = useState<string | null>(null)
  const [isLoadingContent, setIsLoadingContent] = useState(false)
  const [showContentViewer, setShowContentViewer] = useState(false)

  // Fetch purchased materials when wallet is connected
  useEffect(() => {
    const fetchMaterials = async () => {
      if (!currentAccount) return

      try {
        setIsLoading(true)
        setError(null)
        
        const materials = await getMyPurchasedMaterials()
        
        // Transform the data for display
        const formattedMaterials = materials.map((material: any) => {
          return {
            id: material.id.toString(),
            title: material.title,
            description: material.description,
            type: "pdf", // Default all to PDF type
            size: "2.4 MB", // Placeholder size
            purchaseDate: new Date().toISOString(), // Placeholder date
            image: "",
          }
        })
        
        setPurchasedMaterials(formattedMaterials)
        
        if (formattedMaterials.length === 0) {
          setError("You haven't purchased any materials yet.")
        }
      } catch (err) {
        console.error("Error fetching materials:", err)
        setError("Failed to load your materials. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (currentAccount) {
      fetchMaterials()
    } else {
      setIsLoading(false)
    }
  }, [currentAccount])

  // Handle selecting a material
  const handleSelectMaterial = async (material: any) => {
    try {
      if (!currentAccount) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet to view this content.",
          variant: "destructive",
        })
        return
      }
      
      setIsLoadingContent(true)
      setSelectedMaterial(material)
      
      // Fetch content hash
      const hash = await getContentHash(parseInt(material.id))
      setContentHash(hash)
      
      // Open content viewer directly if hash is available
      if (hash) {
        setShowContentViewer(true)
      } else {
        toast({
          title: "Content Not Available",
          description: "The content hash could not be retrieved. Please try again.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error fetching content hash:", err)
      toast({
        title: "Error",
        description: "Failed to retrieve content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingContent(false)
    }
  }

  // Handle closing content viewer
  const handleCloseContentViewer = () => {
    setShowContentViewer(false)
    setSelectedMaterial(null)
    setContentHash(null)
  }

  return (
    <main className="min-h-screen pt-16">
      <ClientOnly fallback={<SimpleFallback />}>
        <SpaceBackground colorTheme="blue" shootingStars density={800} speed={0.0003} />
      </ClientOnly>
      
      {/* Page Header */}
      <section className="relative py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-center mb-2">
            <span className="inline-block bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              My Learning Materials
            </span>
          </h1>
          
        </div>
      </section>
      
      {/* Main Content Section */}
      <section className="relative pb-16">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/50 to-black/50 p-8 backdrop-blur-sm shadow-xl">
            {isLoading ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-slate-800/50 bg-black/30 p-8 backdrop-blur-sm">
                <div className="flex items-center justify-center h-20 w-20 mb-6">
                  <Loader size="lg" color="purple" />
                </div>
                <p className="text-purple-300 animate-pulse">Loading your materials...</p>
              </div>
            ) : !currentAccount ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-slate-800/50 bg-black/30 p-12 backdrop-blur-sm">
                <div className="rounded-full bg-purple-900/30 p-4 mb-6">
                  <Lock className="h-12 w-12 text-purple-400" />
                </div>
                <h2 className="mb-3 text-2xl font-bold text-white">Connect Your Wallet</h2>
                <p className="mb-8 max-w-md text-center text-lg text-slate-400">
                  Please connect your wallet to view your purchased materials
                </p>
                <Button 
                  onClick={connect}
                  variant="default"
                  className="h-12 min-w-[200px] text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-none"
                >
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <TabsList className="h-12 bg-slate-900/50 p-1 border border-slate-800/50 rounded-lg shadow-md">
                    <TabsTrigger 
                      value="all" 
                      className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:shadow-md transition-all duration-200"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      All Materials
                    </TabsTrigger>
                    <TabsTrigger 
                      value="pdf"
                      className="text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:shadow-md transition-all duration-200"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Documents
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-2 bg-slate-900/50 py-2 px-4 rounded-lg border border-slate-800/30">
                    <span className="text-slate-400 text-sm">Items:</span>
                    <p className="text-lg font-bold text-purple-400">
                      {purchasedMaterials.length}
                    </p>
                  </div>
                </div>

                {isLoadingContent && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="rounded-lg bg-slate-900 p-8 shadow-2xl border border-purple-900/50">
                      <div className="flex items-center justify-center h-14 w-14 mx-auto mb-4">
                        <Loader size="default" color="purple" />
                      </div>
                      <p className="text-center text-purple-300 animate-pulse">Loading your content...</p>
                    </div>
                  </div>
                )}

                {!isLoading && !error && purchasedMaterials.length > 0 && (
                  <>
                    <TabsContent value="all" className="mt-0">
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {purchasedMaterials.map((material) => (
                          <MaterialCard key={material.id} material={material} onClick={() => handleSelectMaterial(material)} />
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="pdf" className="mt-0">
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {purchasedMaterials.filter(m => m.type === "pdf").map((material) => (
                          <MaterialCard key={material.id} material={material} onClick={() => handleSelectMaterial(material)} />
                        ))}
                      </div>
                    </TabsContent>
                  </>
                )}

                {!isLoading && !error && purchasedMaterials.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-6 w-52 h-52">
                      <svg className="w-full h-full" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Bookshelf */}
                        <rect x="40" y="80" width="160" height="10" rx="2" fill="#374151" />
                        <rect x="40" y="130" width="160" height="10" rx="2" fill="#374151" />
                        <rect x="40" y="180" width="160" height="10" rx="2" fill="#374151" />
                        
                        {/* Side supports */}
                        <rect x="40" y="90" width="5" height="90" fill="#4B5563" />
                        <rect x="195" y="90" width="5" height="90" fill="#4B5563" />
                        
                        {/* Empty shelf highlight */}
                        <rect x="55" y="95" width="130" height="30" rx="2" fill="#1F2937" stroke="#6B7280" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="4 2" />
                        
                        {/* Magnifying glass */}
                        <circle cx="160" cy="60" r="24" stroke="#A855F7" strokeWidth="4" strokeOpacity="0.8" />
                        <line x1="178" y1="76" x2="190" y2="88" stroke="#A855F7" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.8" />
                        
                        {/* Sparkles */}
                        <path d="M75 45L78 50L83 53L78 56L75 61L72 56L67 53L72 50L75 45Z" fill="#6366F1" />
                        <path d="M115 25L117 30L122 32L117 34L115 39L113 34L108 32L113 30L115 25Z" fill="#8B5CF6" />
                        <path d="M55 65L56 68L59 69L56 70L55 73L54 70L51 69L54 68L55 65Z" fill="#EC4899" />
                        
                        {/* Question mark */}
                        <text x="120" y="115" fontSize="36" fill="#6D28D9" fontWeight="bold" textAnchor="middle">?</text>
                      </svg>
                    </div>
                    <h3 className="mb-3 text-2xl font-semibold text-white">No Materials Found</h3>
                    <p className="mb-8 max-w-md text-slate-400">
                      You haven't purchased any study materials yet. Visit the marketplace to find resources.
                    </p>
                    <Button 
                      variant="default" 
                      className="min-w-[220px] h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-none shadow-lg transition-all duration-200 hover:scale-105" 
                      asChild
                    >
                      <a href="/marketplace" className="flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" />
                        Browse Marketplace
                      </a>
                    </Button>
                  </div>
                )}
              </Tabs>
            )}

            {/* Content Viewer Modal */}
            {showContentViewer && selectedMaterial && contentHash && (
              <ContentViewer
                contentHash={contentHash}
                title={selectedMaterial.title}
                type={selectedMaterial.type}
                onClose={handleCloseContentViewer}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

