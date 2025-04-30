"use client"

import { useState, useRef, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Minimize,
  RotateCw,
  Download,
  X,
  MessageSquareText,
  Sparkles,
  Loader,
  ExternalLink
} from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import "@/styles/pdf-viewer.css"

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PdfViewerWithAiProps {
  pdfUrl: string
  title: string
  onClose: () => void
  onOpenInBrowser?: () => void
}

export default function PdfViewerWithAi({ pdfUrl, title, onClose, onOpenInBrowser }: PdfViewerWithAiProps) {
  // PDF viewer state
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [localPdfUrl, setLocalPdfUrl] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [useIframeViewer, setUseIframeViewer] = useState(false)
  const [iframeLoading, setIframeLoading] = useState(true)
  
  // AI assistant state
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false)
  const [aiQuery, setAiQuery] = useState("")
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [aiHistory, setAiHistory] = useState<Array<{question: string, answer: string}>>([])
  
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Helper function to ensure proper URL format
  const formatIpfsUrl = (url: string): string => {
    // If it's already a complete URL (e.g., from a gateway), return it
    if (url.startsWith('http') && !url.includes('/ipfs/https://')) {
      return url;
    }
    
    // If it has the double gateway issue, fix it
    if (url.includes('/ipfs/https://')) {
      const parts = url.split('/ipfs/');
      if (parts.length >= 2) {
        const secondPart = parts[1];
        if (secondPart.includes('/ipfs/')) {
          // Extract just the CID
          const cidParts = secondPart.split('/ipfs/');
          return `${parts[0]}/ipfs/${cidParts[1]}`;
        }
      }
    }
    
    // Handle ipfs:// protocol
    if (url.startsWith('ipfs://')) {
      return `https://gateway.ipfs.io/ipfs/${url.substring(7)}`;
    }
    
    // If it's just a CID, add the preferred gateway
    if (!url.startsWith('http')) {
      return `https://gateway.ipfs.io/ipfs/${url}`;
    }
    
    // Default case
    return url;
  };
  
  // Handle document load success
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
  }
  
  // Handle document load error
  const onDocumentLoadError = (error: Error) => {
    console.error("Error loading PDF:", error)
    
    // More descriptive error message based on error type
    let errorMessage = "Failed to load PDF. Please try again."
    
    if (error.message.includes("network") || error.message.includes("Failed to fetch")) {
      errorMessage = "Network error: PDF can't be loaded from IPFS gateway. Try using the 'Open in Browser' button."
    } else if (error.message.includes("password") || error.message.includes("encrypted")) {
      errorMessage = "This PDF is password protected and cannot be opened."
    } else if (error.message.includes("not found") || error.message.includes("404")) {
      errorMessage = "PDF not found on IPFS gateway. The file may no longer be pinned or the hash is incorrect."
    } else if (error.message.includes("corrupt") || error.message.includes("invalid")) {
      errorMessage = "The PDF file appears to be corrupted or invalid."
    }
    
    setError(errorMessage)
    setIsLoading(false)
  }
  
  // Navigation functions
  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1))
  }
  
  const goToNextPage = () => {
    if (numPages) {
      setPageNumber(prev => Math.min(prev + 1, numPages))
    }
  }
  
  // Zoom functions
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3))
  }
  
  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5))
  }
  
  // Rotation function
  const rotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }
  
  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }
  
  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])
  
  // Download function
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `${title.replace(/\s+/g, '_')}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  // AI assistant functions
  const toggleAiPanel = () => {
    setIsAiPanelOpen(prev => !prev)
  }
  
  const handleAiQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!aiQuery.trim()) return
    
    setIsAiThinking(true)
    
    try {
      // Simulate AI response (in a real app, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Example responses based on query content
      let response = ""
      const query = aiQuery.toLowerCase()
      
      if (query.includes("summary") || query.includes("summarize")) {
        response = "This document appears to be about decentralized learning platforms and how they can revolutionize education through blockchain technology. The key points include secure content sharing, ownership verification, and community governance."
      } else if (query.includes("explain") || query.includes("what is")) {
        response = "The concept mentioned refers to a blockchain-based system for educational content distribution. It uses smart contracts to verify ownership and access rights, while ensuring creators are properly compensated for their work."
      } else if (query.includes("example") || query.includes("instance")) {
        response = "An example application would be a university sharing research papers through this platform, where access is granted to verified students and faculty, with automatic royalty distribution to the research department when external organizations purchase access."
      } else {
        response = "I can help you understand this document better. Try asking me to summarize key points, explain concepts, or provide examples of applications for the ideas presented."
      }
      
      // Add to history
      setAiHistory(prev => [...prev, { question: aiQuery, answer: response }])
      setAiResponse(response)
      setAiQuery("")
    } catch (error) {
      console.error("Error getting AI response:", error)
      setAiResponse("I'm sorry, I couldn't process your request. Please try again.")
    } finally {
      setIsAiThinking(false)
    }
  }
  
  // Handle iframe load event
  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  // Handle iframe error
  const handleIframeError = () => {
    setIframeLoading(false);
    setError("The PDF could not be displayed. The document may be unavailable or the CID may be invalid.");
  };

  // Use a simpler approach with useEffect
  useEffect(() => {
    let isMounted = true;
    
    const attemptToLoadPdf = async () => {
      setIsLoading(true);
      setError(null);
      setIframeLoading(true);
      
      try {
        // Properly format the URL first to avoid double gateway issues
        const formattedUrl = formatIpfsUrl(pdfUrl);
        console.log(`Formatted PDF URL: ${formattedUrl}`);
        
        // Try to load the PDF with react-pdf first
        if (formattedUrl.startsWith('blob:')) {
          // If it's already a blob URL, use it directly
          setLocalPdfUrl(formattedUrl);
          setIsLoading(false);
        } else {
          // Try a simple HEAD request to see if the PDF is accessible
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          try {
            // Just check if the URL is reachable
            const response = await fetch(formattedUrl, { 
              method: 'HEAD',
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
              console.error(`PDF URL response not OK: ${response.status} ${response.statusText}`);
              
              if (response.status === 422) {
                throw new Error("Invalid CID format or content not available on IPFS");
              }
              
              if (response.status === 401 && formattedUrl.includes('gateway.pinata.cloud')) {
                throw new Error("Pinata gateway authentication required. This may be a private pin.");
              }
              
              throw new Error(`HTTP error: ${response.status}`);
            }
            
            // If we can reach it, set it as the URL, but don't download it
            setLocalPdfUrl(formattedUrl);
            setIsLoading(false);
          } catch (err) {
            console.log('Head request failed, using iframe fallback:', err);
            
            // If the main gateway fails, try Cloudflare as a fallback
            if (formattedUrl.includes('gateway.pinata.cloud') || formattedUrl.includes('gateway.ipfs.io')) {
              // Extract the CID - assuming the URL format is consistent
              const parts = formattedUrl.split('/ipfs/');
              if (parts.length > 1) {
                const cid = parts[1];
                const alternateUrl = `https://cloudflare-ipfs.com/ipfs/${cid}`;
                console.log(`Trying alternate gateway: ${alternateUrl}`);
                
                setLocalPdfUrl(alternateUrl);
              } else {
                // If we can't parse the URL properly, just use the original
                setLocalPdfUrl(formattedUrl);
              }
            } else {
              setLocalPdfUrl(formattedUrl);
            }
            
            setUseIframeViewer(true);
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error("Error setting up PDF viewer:", err);
        if (isMounted) {
          setError(`Failed to load PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setIsLoading(false);
        }
      }
    };
    
    attemptToLoadPdf();
    
    return () => {
      isMounted = false;
    };
  }, [pdfUrl]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div 
        ref={containerRef}
        className="relative flex flex-col w-full h-full max-w-6xl max-h-[90vh] bg-slate-900 rounded-lg overflow-hidden border border-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-slate-900 to-slate-800">
          <h2 className="text-xl font-bold text-white font-space truncate">{title}</h2>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10"
              onClick={toggleAiPanel}
            >
              <Sparkles className="h-5 w-5 text-purple-400" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* PDF Viewer */}
          <div className="flex-1 overflow-auto bg-slate-800 p-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader className="h-8 w-8 text-purple-500 animate-spin mb-4" />
                <p className="text-white mb-2">Loading document...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-red-500 mb-4">{error}</p>
                <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>Close</Button>
                  {onOpenInBrowser && (
                    <Button 
                      variant="default" 
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={onOpenInBrowser}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in Browser
                    </Button>
                  )}
                </div>
              </div>
            ) : useIframeViewer ? (
              // Use iframe if direct fetching is not working
              <div className="w-full h-full flex items-center justify-center relative">
                {iframeLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 z-10">
                    <Loader className="h-8 w-8 text-purple-500 animate-spin mb-4" />
                    <p className="text-white mb-2">Loading document in browser viewer...</p>
                  </div>
                )}
                <iframe 
                  src={`${localPdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  className="w-full h-full border-0 bg-white rounded-lg shadow-lg"
                  title={title}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  style={{
                    overflow: 'hidden'
                  }}
                  frameBorder="0"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Document
                  file={localPdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={(err) => {
                    console.error("PDF.js load error:", err);
                    // If react-pdf fails, fall back to iframe
                    setUseIframeViewer(true);
                  }}
                  className="pdf-document"
                  options={{
                    cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
                    cMapPacked: true,
                    standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/standard_fonts/'
                  }}
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    rotate={rotation}
                    className="pdf-page shadow-xl"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    canvasBackground="#fff"
                  />
                </Document>
              </div>
            )}
          </div>
          
          {/* AI Assistant Panel */}
          {isAiPanelOpen && (
            <div className="w-80 border-l border-white/10 bg-slate-900 flex flex-col">
              <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-white font-space">AI Assistant</h3>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Ask questions about this document to get insights and explanations
                </p>
              </div>
              
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {aiHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-4 rounded-lg border border-white/10 mb-4">
                      <Sparkles className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-white text-sm">
                        I can help you understand this document better. Ask me anything!
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs border-white/10 hover:bg-white/5"
                        onClick={() => setAiQuery("Summarize this document")}
                      >
                        Summarize
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs border-white/10 hover:bg-white/5"
                        onClick={() => setAiQuery("Explain the key concepts")}
                      >
                        Key Concepts
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs border-white/10 hover:bg-white/5"
                        onClick={() => setAiQuery("Give me examples")}
                      >
                        Examples
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs border-white/10 hover:bg-white/5"
                        onClick={() => setAiQuery("How can I apply this?")}
                      >
                        Applications
                      </Button>
                    </div>
                  </div>
                ) : (
                  aiHistory.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                          <MessageSquareText className="h-4 w-4 text-slate-300" />
                        </div>
                        <div className="flex-1 bg-slate-800 rounded-lg p-3 text-sm text-white">
                          {item.question}
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-3 text-sm text-white">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <form onSubmit={handleAiQuerySubmit} className="p-4 border-t border-white/10">
                <div className="relative">
                  <Input
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Ask about this document..."
                    className="pr-12 bg-slate-800 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20"
                    disabled={isAiThinking}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full text-purple-400 hover:text-purple-300"
                    disabled={isAiThinking}
                  >
                    {isAiThinking ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-white text-sm">
              {pageNumber} / {numPages || '?'}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextPage}
              disabled={numPages !== null && pageNumber >= numPages}
              className="text-white hover:bg-white/10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="text-white hover:bg-white/10"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <span className="text-white text-sm w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={zoomIn}
              disabled={scale >= 3}
              className="text-white hover:bg-white/10"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            
            <div className="h-6 border-l border-white/20 mx-2"></div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={rotate}
              className="text-white hover:bg-white/10"
            >
              <RotateCw className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/10"
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </Button>
            
            <div className="h-6 border-l border-white/20 mx-2"></div>
            
            {onOpenInBrowser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenInBrowser}
                className="text-white hover:bg-white/10 flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Open in Browser</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
