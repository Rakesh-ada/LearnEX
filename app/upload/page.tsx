"use client"

import SpaceBackground from "@/components/space-background"
import UploadMaterialForm from "@/components/upload-material-form"

export default function UploadPage() {
  return (
    <main className="min-h-screen pt-16">
      <SpaceBackground density={600} speed={0.0002} />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="relative mb-2">
            <h1 className="mb-4 text-center">
              <span className="inline-block bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                Upload Study Material
              </span>
            </h1>
      
            {/* Optional decorative element */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-purple-500/5 via-slate-900/0 to-transparent" />
          </div>

          {/* Wider form container */}
          <div className="mx-auto max-w-5xl">
            <UploadMaterialForm />
          </div>

          {/* Expanded information section */}
          <div className="mx-auto mt-16 max-w-5xl rounded-xl border border-slate-800 bg-black/50 p-8 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left side - How IPFS Works */}
              <div className="flex-1">
                <h2 className="mb-6 text-2xl font-bold text-white">How IPFS Works</h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-900/50 text-xl font-bold text-purple-400">
                        1
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-white">Upload Content</h3>
                      <p className="text-slate-400">
                        Your content is uploaded to IPFS, a decentralized storage network. The content is distributed across multiple nodes, ensuring redundancy and reliability.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-900/50 text-xl font-bold text-purple-400">
                        2
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-white">Pin Content</h3>
                      <p className="text-slate-400">
                        Once uploaded, your content is pinned to IPFS, making it permanently available and immutable.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-900/50 text-xl font-bold text-purple-400">
                        3
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-white">Access Content</h3>
                      <p className="text-slate-400">
                        Buyers can access your content by retrieving the CID from the blockchain and using it to fetch the content from IPFS.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Benefits */}
              <div className="flex-1">
                <h2 className="mb-6 text-2xl font-bold text-white">Benefits</h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-900/50 text-xl font-bold text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-white">Secure Storage</h3>
                      <p className="text-slate-400">
                        Your content is stored across multiple nodes in the IPFS network, making it resistant to censorship and single points of failure.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-900/50 text-xl font-bold text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                          <line x1="9" y1="9" x2="9.01" y2="9"></line>
                          <line x1="15" y1="9" x2="15.01" y2="9"></line>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-white">Earn Rewards</h3>
                      <p className="text-slate-400">
                        Get paid directly in cryptocurrency for your educational content whenever someone purchases access.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-900/50 text-xl font-bold text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-white">Own Your Content</h3>
                      <p className="text-slate-400">
                        Maintain full ownership and control over your materials through blockchain technology.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Security note at bottom */}
            <div className="mt-8 rounded-lg bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-6 border border-purple-800/50">
              <h3 className="mb-3 text-lg font-semibold text-purple-300">Security Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <p className="text-sm text-slate-300">
                  <strong className="text-purple-400">Content Integrity:</strong> Each file gets a unique Content Identifier (CID) derived from its content. Any change to the file results in a completely different CID.
                </p>
                <p className="text-sm text-slate-300">
                  <strong className="text-blue-400">Decentralized Access:</strong> While content on IPFS is public, it can only be discovered by those who know the CID, which is stored securely on the blockchain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
