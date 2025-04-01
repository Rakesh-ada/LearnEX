"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import WalletButton from "./wallet-button"
import { usePathname } from "next/navigation"

// Add the getProfileImage function for generating pixel art avatars
export const getProfileImage = (address: string) => {
  if (!address) return {};
  
  // Use address to seed the generation
  const seed = address.toLowerCase();
  
  // Create a stable hash function for the address
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };
  
  const hash = hashCode(seed);
  
  // Base colors - a palette inspired by Bored Ape collection
  const backgrounds = [
    '#2a3990', '#617dc9', '#f4b86c', '#ec6e41', '#26265a',
    '#457b6c', '#fae48c', '#9dd9d2', '#487b84', '#eac08b'
  ];
  
  const skinTones = [
    '#f0d3ac', '#d5a367', '#a37339', '#87612d', '#7c482e',
    '#8a5c36', '#d6a36c', '#a78b5f', '#e5c298', '#c99659'
  ];
  
  const featureColors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
    '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'
  ];
  
  // Select colors based on address hash
  const bgColor = backgrounds[hash % backgrounds.length];
  const skinColor = skinTones[(hash >> 3) % skinTones.length];
  const featureColor = featureColors[(hash >> 6) % featureColors.length];
  const accessoryColor = featureColors[(hash >> 9) % featureColors.length];
  
  // Feature variations
  const hasGlasses = hash % 3 === 0;
  const hasHat = (hash >> 2) % 4 === 0;
  const mouthStyle = hash % 5;
  const eyeStyle = (hash >> 4) % 4;
  
  // Create SVG string - using string concatenation to avoid template literal issues
  let svgContent = '<svg width="100" height="100" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">';
  
  // Background
  svgContent += '<rect width="10" height="10" fill="' + bgColor + '" />';
  
  // Face shape  
  svgContent += '<rect x="2" y="2" width="6" height="6" fill="' + skinColor + '" />';
  
  // Eyes
  if (eyeStyle === 0) {
    svgContent += '<rect x="3" y="4" width="1" height="1" fill="#000000" />';
    svgContent += '<rect x="6" y="4" width="1" height="1" fill="#000000" />';
  } else if (eyeStyle === 1) {
    svgContent += '<rect x="3" y="4" width="1" height="1" fill="#000000" />';
    svgContent += '<rect x="6" y="4" width="1" height="1" fill="#000000" />';
    svgContent += '<rect x="3" y="3" width="1" height="1" fill="#ffffff" opacity="0.5" />';
    svgContent += '<rect x="6" y="3" width="1" height="1" fill="#ffffff" opacity="0.5" />';
  } else if (eyeStyle === 2) {
    svgContent += '<rect x="3" y="4" width="1" height="1" fill="' + featureColor + '" />';
    svgContent += '<rect x="6" y="4" width="1" height="1" fill="' + featureColor + '" />';
  } else {
    svgContent += '<rect x="3" y="3.5" width="1" height="1.5" fill="#000000" />';
    svgContent += '<rect x="6" y="3.5" width="1" height="1.5" fill="#000000" />';
  }
  
  // Mouth
  if (mouthStyle === 0) {
    svgContent += '<rect x="4" y="6" width="2" height="1" fill="#000000" />';
  } else if (mouthStyle === 1) {
    svgContent += '<rect x="4" y="6" width="2" height="1" fill="#000000" />';
    svgContent += '<rect x="4" y="7" width="2" height="0.5" fill="#ff0000" opacity="0.7" />';
  } else if (mouthStyle === 2) {
    svgContent += '<rect x="3.5" y="6" width="3" height="0.5" fill="#000000" />';
  } else if (mouthStyle === 3) {
    svgContent += '<rect x="4" y="6" width="2" height="0.5" fill="#000000" />';
    svgContent += '<rect x="4.5" y="6.5" width="1" height="0.5" fill="#000000" />';
  } else {
    svgContent += '<rect x="3.5" y="5.5" width="3" height="1" fill="#000000" />';
    svgContent += '<rect x="4" y="6" width="2" height="1" fill="' + skinColor + '" />';
  }
  
  // Glasses
  if (hasGlasses) {
    svgContent += '<rect x="2.5" y="3.5" width="2" height="1.5" fill="none" stroke="' + accessoryColor + '" stroke-width="0.2" />';
    svgContent += '<rect x="5.5" y="3.5" width="2" height="1.5" fill="none" stroke="' + accessoryColor + '" stroke-width="0.2" />';
    svgContent += '<rect x="4.5" y="4" width="1" height="0.2" fill="' + accessoryColor + '" />';
  }
  
  // Hat
  if (hasHat) {
    svgContent += '<rect x="1.5" y="1.5" width="7" height="1" fill="' + accessoryColor + '" />';
    svgContent += '<rect x="2" y="0.5" width="6" height="1" fill="' + accessoryColor + '" />';
  }
  
  svgContent += '</svg>';
  
  // Encode the SVG
  const encodedSvg = encodeURIComponent(svgContent);
  
  return {
    backgroundColor: bgColor,
    backgroundImage: `url("data:image/svg+xml,${encodedSvg}")`,
    backgroundSize: "cover",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
  };
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Function to determine if link is active
  const isActiveLink = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-800 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold">
            <span className="text-white">Learn</span>
            <span className="bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent">EX</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 md:flex">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors ${
              isActiveLink('/') 
                ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/marketplace" 
            className={`text-sm font-medium transition-colors ${
              isActiveLink('/marketplace') 
                ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            Marketplace
          </Link>
          <Link 
            href="/upload" 
            className={`text-sm font-medium transition-colors ${
              isActiveLink('/upload') 
                ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            Upload
          </Link>
          <Link 
            href="/my-materials" 
            className={`text-sm font-medium transition-colors ${
              isActiveLink('/my-materials') 
                ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                : 'text-white/80 hover:text-white'
            }`}
          >
            My Materials
          </Link>
          <WalletButton />
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="container mx-auto px-4 pb-4 md:hidden">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActiveLink('/') 
                  ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                  : 'text-white/80 hover:bg-slate-800 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/marketplace"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActiveLink('/marketplace') 
                  ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                  : 'text-white/80 hover:bg-slate-800 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              href="/upload"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActiveLink('/upload') 
                  ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                  : 'text-white/80 hover:bg-slate-800 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Upload
            </Link>
            <Link
              href="/my-materials"
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActiveLink('/my-materials') 
                  ? 'bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent' 
                  : 'text-white/80 hover:bg-slate-800 hover:text-white'
              }`}
              onClick={() => setIsOpen(false)}
            >
              My Materials
            </Link>
            <WalletButton isMobile />
          </div>
        </div>
      )}
    </nav>
  )
}

