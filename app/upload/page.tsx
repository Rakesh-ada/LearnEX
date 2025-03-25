"use client"

import SpaceBackground from "@/components/space-background"
import UploadMaterialForm from "@/components/upload-material-form"

export default function UploadPage() {
  return (
    <main className="min-h-screen pt-16">
      <SpaceBackground density={600} speed={0.0002} />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="relative mb-12">
            <h1 className="mb-4 text-center">
              <span className="inline-block bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                Upload Study Material
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-center text-lg font-medium leading-relaxed">
              <span className="bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent">
                
              </span>
            </p>
            {/* Optional decorative element */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-purple-500/5 via-slate-900/0 to-transparent" />
          </div>

          <div className="mx-auto max-w-2xl">
            <UploadMaterialForm />
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-xl border border-slate-800 bg-black/50 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-bold text-white">How IPFS Works</h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-slate-800/50 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-900/50 text-purple-400">
                  1
                </div>
                <h3 className="mb-2 font-semibold text-white">Upload Content</h3>
                <p className="text-sm text-slate-400">
                  Your content is uploaded to IPFS, a decentralized storage network. The content is distributed across multiple nodes, ensuring redundancy and reliability.
                </p>
              </div>
              
              <div className="rounded-lg bg-slate-800/50 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-900/50 text-purple-400">
                  2
                </div>
                <h3 className="mb-2 font-semibold text-white">Pin Content</h3>
                <p className="text-sm text-slate-400">
                  Once uploaded, your content is pinned to IPFS, making it permanently available and immutable.
                </p>
              </div>
              
              <div className="rounded-lg bg-slate-800/50 p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-900/50 text-purple-400">
                  3
                </div>
                <h3 className="mb-2 font-semibold text-white">Access Content</h3>
                <p className="text-sm text-slate-400">
                  Buyers can access your content by retrieving the CID from the blockchain and using it to fetch the content from IPFS.
                </p>
              </div>
            </div>
            
            <div className="mt-6 rounded-lg bg-purple-900/20 p-4 border border-purple-800/50">
              <p className="text-sm text-slate-300">
                <strong className="text-purple-400">Security Note:</strong> Content on IPFS is identified by its Content Identifier (CID), which is derived from the content itself. This makes the content tamper-proof and verifiable. While content on IPFS is public, it can only be discovered by those who know the CID, which is stored securely on the blockchain.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

