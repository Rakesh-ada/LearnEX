"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MaterialCard from "@/components/material-card"
import { FileText, Download, Lock, BookOpen, ExternalLink } from "lucide-react"
import Loader from "@/components/ui/cube-loader"
import { useWallet } from "@/hooks/use-wallet"
import { getMyPurchasedMaterials, getContentHash } from "@/lib/blockchain"
import { toast } from "@/hooks/use-toast"
import ContentViewer from "@/components/content-viewer"
import PdfViewerWithAi from "@/components/pdf-viewer-with-ai"
import SpaceBackground from "@/components/space-background"
import ClientOnly from "@/lib/client-only"
import SimpleFallback from "@/components/simple-fallback"

// Add a CID validation helper function at the top of the file
const isValidCid = (cid: string): boolean => {
  // Basic CID validation - checks for common CID formats
  // CIDv0 is base58 and starts with "Qm", length ~46 chars
  // CIDv1 is base32 and starts with "b", then a digit, followed by letters/numbers
  return (
    (cid.startsWith('Qm') && cid.length >= 44 && cid.length <= 48) || 
    (/^b[a-z2-7]{58,}$/i.test(cid))
  );
};

// Function to format IPFS URLs with multiple gateway options
const formatIpfsUrl = (hash: string): string[] => {
  // Get the CID (remove ipfs:// prefix if present)
  let cid = hash;
  if (hash.startsWith('ipfs://')) {
    cid = hash.substring(7);
  }
  
  // Validate CID
  if (!isValidCid(cid)) {
    console.error('Invalid CID format:', cid);
  }
  
  // Return multiple gateway URLs with Pinata first
  return [
    `https://gateway.pinata.cloud/ipfs/${cid}`,
    `https://cloudflare-ipfs.com/ipfs/${cid}`,
    `https://dweb.link/ipfs/${cid}`,
    `https://ipfs.io/ipfs/${cid}`
  ];
};

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
  const [showPdfViewer, setShowPdfViewer] = useState(false)

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

  // Update the handleSelectMaterial function to use the improved CID handling
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
      
      // Log what we're trying to fetch
      console.log(`Fetching content hash for material ID: ${material.id} (${material.title})`);
      
      // Fetch content hash
      const hash = await getContentHash(parseInt(material.id))
      console.log('Fetched content hash:', hash)
      
      if (!hash || typeof hash !== 'string' || hash.length < 10) {
        toast({
          title: "Content Not Available",
          description: "The content hash could not be retrieved or is invalid. Please try again.",
          variant: "destructive",
        })
        setIsLoadingContent(false)
        return
      }
      
      // Format gateway URLs with CID validation
      const gatewayUrls = formatIpfsUrl(hash);
      console.log('Using gateway URLs:', gatewayUrls);
      
      // Set the first URL as the content hash
      setContentHash(gatewayUrls[0]);
      
      // Show attempt message
      toast({
        title: "Loading Document",
        description: "Attempting to display content from IPFS...",
      });
      
      // Open viewer based on type
      if (material.type === "pdf") {
        setShowPdfViewer(true);
      } else {
        setShowContentViewer(true);
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
    setShowPdfViewer(false)
    setSelectedMaterial(null)
    setContentHash(null)
  }

  // Handle opening content in browser
  const handleOpenInBrowser = async (hash: string) => {
    if (!hash) {
      toast({
        title: "Error",
        description: "No content hash available to open",
        variant: "destructive",
      });
      return;
    }

    // Show loading toast
    toast({
      title: "Loading PDF",
      description: "Downloading content from IPFS...",
    });

    // Use the formatIpfsUrl function to create consistent gateway URLs
    const gatewayUrls = formatIpfsUrl(hash);
    console.log('Using gateway URLs:', gatewayUrls);
    
    try {
      // Try to fetch the PDF from each gateway until one works
      let response = null;
      let gatewayIndex = 0;
      
      while (!response && gatewayIndex < gatewayUrls.length) {
        try {
          console.log(`Trying gateway ${gatewayIndex + 1}: ${gatewayUrls[gatewayIndex]}`);
          response = await fetch(gatewayUrls[gatewayIndex], { method: 'GET' });
          
          if (!response.ok) {
            console.log(`Gateway ${gatewayIndex + 1} failed with status: ${response.status}`);
            response = null;
            gatewayIndex++;
          }
        } catch (error) {
          console.error(`Error with gateway ${gatewayIndex + 1}:`, error);
          gatewayIndex++;
        }
      }
      
      if (!response) {
        throw new Error("All IPFS gateways failed");
      }
      
      // Get the PDF data as a blob
      const pdfBlob = await response.blob();
      
      // Create a URL for the blob - this is stored in browser memory and cleared on browser close
      const blobUrl = URL.createObjectURL(pdfBlob);
      
      // Success toast
      toast({
        title: "PDF Loaded",
        description: "PDF downloaded to browser. This temporary file will be deleted when you close your browser.",
      });
      
      // Open the PDF in a new tab - will use browser's built-in PDF viewer
      window.open(blobUrl, '_blank');
      
      // Clean up the blob URL when the browser tab is closed
      // This is not strictly necessary as they're automatically revoked when the document is unloaded
      // But it's good practice to free memory explicitly when possible
      window.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(blobUrl);
      });
    } catch (error) {
      console.error('Error fetching PDF from IPFS:', error);
      
      // Error toast with fallback option
      toast({
        title: "Error Loading PDF",
        description: "Failed to download PDF from IPFS. Please try downloading it directly.",
        action: (
          <Button 
            size="sm" 
            variant="default" 
            onClick={() => window.open(gatewayUrls[0], '_blank')}
          >
            Try Direct Link
          </Button>
        ),
        duration: 7000,
      });
    }
  };

  return (
    <main className="min-h-screen pt-16">
      <ClientOnly fallback={<SimpleFallback />}>
        <SpaceBackground colorTheme="blue" shootingStars density={800} speed={0.0003} />
      </ClientOnly>
      
      {/* Page Header */}
      <section className="relative py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-3 mb-2">
            <div className="flex items-center space-x-2">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              <span className="text-xs font-medium text-gradient-blue-cyan uppercase tracking-wider font-space">Personal Library</span>
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            </div>
            <h1 className="text-center">
              <span className="inline-block bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent font-space">
                My Collection
              </span>
            </h1>
          </div>
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
                      <p className="text-center text-purple-300 animate-pulse mb-4">Loading your content...</p>
                      {contentHash && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="mx-auto flex items-center gap-2 mt-3"
                          onClick={() => {
                            setIsLoadingContent(false);
                            handleOpenInBrowser(contentHash);
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open in Browser
                        </Button>
                      )}
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
            
            {/* PDF Viewer with AI Assistant */}
            {showPdfViewer && selectedMaterial && contentHash && (
              <PdfViewerWithAi
                pdfUrl={contentHash}
                title={selectedMaterial.title}
                onClose={handleCloseContentViewer}
                onOpenInBrowser={() => handleOpenInBrowser(contentHash)}
              />
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

