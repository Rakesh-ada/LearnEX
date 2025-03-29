"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Upload, FileText, Video, AlertTriangle, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useWallet } from "@/hooks/use-wallet"
import { 
  listMaterial, 
  listMaterialOnChainDebug, 
  debugListMaterial, 
  listMaterialWithFallback,
  verifyContractFunctions 
} from "@/lib/blockchain"
import { verifyContract, checkUserBalance, checkNetwork, switchToCorrectNetwork, testContractConnection } from "@/lib/contract"
import { toast } from "@/hooks/use-toast"
import { pinFileToIPFS } from "@/lib/pinning-service"

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.string().refine(
    (val) => {
      const num = parseFloat(val)
      return !isNaN(num) && num > 0
    },
    { message: "Price must be a positive number" }
  ),
})

export default function UploadMaterialForm() {
  // ... (keep all existing state declarations)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: "0.05",
    },
  })

  // ... (keep all existing useEffect hooks and handler functions)

  return (
    <div className="max-w-6xl mx-auto rounded-xl border border-slate-800 bg-gradient-to-b from-black/50 to-slate-900/50 p-4 md:p-8 backdrop-blur-sm">
      {/* Status Alerts - same as before */}
      {isVerifyingContract && (
        <div className="text-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-purple-500" />
          <p className="text-slate-300 text-sm md:text-base">Checking network and verifying contract...</p>
        </div>
      )}

      {/* ... (keep all other alert components) */}

      {!currentAccount ? (
        <div className="text-center p-4 md:p-6">
          <p className="mb-4 text-slate-300 text-sm md:text-base">
            Please connect your wallet to upload study materials
          </p>
          <Button 
            className="bg-purple-600 hover:bg-purple-700 w-full md:w-auto px-8"
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
            {/* LANDSCAPE LAYOUT - Top Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Title - takes 2 columns on desktop */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Introduction to Blockchain" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category and Price - stacked in 1 column on desktop */}
              <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-1 lg:gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="blockchain">Blockchain</SelectItem>
                          <SelectItem value="programming">Programming</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="language">Language</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (ETH)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" min="0.001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Description - full width */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A comprehensive guide to blockchain technology..."
                      className="min-h-[120px] md:min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LANDSCAPE LAYOUT - File Uploads Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* File Upload */}
              <div className="space-y-2">
                <FormLabel>File</FormLabel>
                <div className="rounded-lg border border-dashed border-slate-700 p-4 md:p-6 h-full">
                  <div className="flex flex-col items-center justify-center space-y-2 text-center h-full">
                    <Upload className="h-6 w-6 md:h-8 md:w-8 text-slate-500" />
                    <p className="text-sm text-slate-400">
                      Drag and drop your file here, or click to browse
                    </p>
                    <p className="text-xs text-slate-500">
                      Supported formats: PDF, MP4, MOV (Max 50MB)
                    </p>
                    <Input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.mp4,.mov"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2 w-full md:w-auto"
                      onClick={() => document.getElementById("file-upload")?.click()}
                      disabled={isUploading}
                    >
                      Select File
                    </Button>
                  </div>
                </div>

                {fileError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="text-sm">{fileError}</AlertDescription>
                  </Alert>
                )}

                {file && (
                  <div className="mt-3 md:mt-4 rounded-lg bg-slate-800 p-3">
                    <div className="flex items-center space-x-3">
                      {getFileTypeIcon()}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <FormLabel>Thumbnail</FormLabel>
                <div className="rounded-lg border border-dashed border-slate-700 p-4 md:p-6 h-full">
                  <div className="flex flex-col items-center justify-center space-y-2 text-center h-full">
                    <Upload className="h-6 w-6 md:h-8 md:w-8 text-slate-500" />
                    <p className="text-sm text-slate-400">
                      Drag and drop your thumbnail here, or click to browse
                    </p>
                    <p className="text-xs text-slate-500">
                      Supported formats: JPG, PNG (Max 5MB)
                    </p>
                    <Input
                      type="file"
                      className="hidden"
                      id="thumbnail-upload"
                      accept=".jpg,.png"
                      onChange={handleThumbnailChange}
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2 w-full md:w-auto"
                      onClick={() => document.getElementById("thumbnail-upload")?.click()}
                      disabled={isUploading}
                    >
                      Select Thumbnail
                    </Button>
                  </div>
                </div>

                {thumbnailError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="text-sm">{thumbnailError}</AlertDescription>
                  </Alert>
                )}

                {thumbnailFile && (
                  <div className="mt-3 md:mt-4 rounded-lg bg-slate-800 p-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {thumbnailFile.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatFileSize(thumbnailFile.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* IPFS Notice and Submit Button */}
            <div className="pt-2 md:pt-4">
              <Alert className="bg-slate-800 text-slate-300 border-purple-800 p-3 md:p-4">
                <AlertTriangle className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <div className="ml-3">
                  <AlertTitle className="text-white text-sm md:text-base">
                    IPFS Pinning Notice
                  </AlertTitle>
                  <AlertDescription className="text-slate-400 text-xs md:text-sm">
                    Your content will be pinned to IPFS (InterPlanetary File System), a distributed storage system.
                    The content identifier (CID) will be stored on the blockchain.
                  </AlertDescription>
                </div>
              </Alert>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 py-3 md:py-2"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-sm md:text-base">Processing...</span>
                </>
              ) : (
                <span className="text-sm md:text-base">Upload & Pin to IPFS</span>
              )}
            </Button>

            {/* Debug toggle - bottom right on desktop */}
            <div className="flex justify-center lg:justify-end">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                className="text-xs text-slate-500 mt-2"
                onClick={toggleDebugMode}
              >
                {debugMode ? (
                  <span className="hidden md:inline">Hide Debug Tools</span>
                ) : (
                  <span className="hidden md:inline">Show Debug Tools</span>
                )}
                <Bug className="h-4 w-4 md:ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
