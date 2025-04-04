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

          {/* Security information */}
          <div className="mx-auto mt-16 max-w-5xl rounded-xl border border-slate-800 bg-black/50 p-8 backdrop-blur-sm rounded-lg bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-800/50">
              <h3 className="mb-5 text-xl font-semibold text-purple-300 text-center">Security Information</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-5 flex flex-col items-center">
                  <h4 className="mb-3 flex items-center justify-center text-purple-400">
                    <svg className="mr-2 h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    IPFS Content Storage
                  </h4>
                  <p className="text-sm text-slate-300 text-center">
                    All study materials are stored on IPFS (InterPlanetary File System), a distributed and decentralized storage network. 
                    Content is addressed by its hash, making it tamper-proof and permanently accessible as long as at least one node 
                    on the network has a copy. Each file gets a unique Content Identifier (CID) derived from its content hash,
                    and any change to the file results in a completely different CID.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-5 flex flex-col items-center">
                  <h4 className="mb-3 flex items-center justify-center text-purple-400">
                    <svg className="mr-2 h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16.2426 7.75736C16.5858 8.10051 16.8536 8.50491 17.0304 8.94759C17.2071 9.39026 17.2894 9.86316 17.2728 10.338C17.2561 10.8129 17.1409 11.2781 16.9344 11.7067C16.7279 12.1352 16.4345 12.518 16.0711 12.8321C15.7077 13.1463 15.2825 13.3864 14.8246 13.5379C14.3667 13.6894 13.886 13.7489 13.41 13.7127C12.934 13.6764 12.47 13.5452 12.0463 13.3265C11.6225 13.1077 11.2484 12.8061 10.9426 12.4393" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.5 9L7 7.5L8.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 16H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Blockchain Integration
                  </h4>
                  <p className="text-sm text-slate-300 text-center">
                    The content identifier (CID) from IPFS is stored on the blockchain, creating an immutable record of ownership. 
                    While the content on IPFS is technically public, it can only be discovered by those who know the exact CID, 
                    ensuring your materials remain private unless shared. This blockchain record also enables secure transactions
                    and verifiable ownership of your educational content.
                  </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
