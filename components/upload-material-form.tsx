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
  const { currentAccount, connect } = useWallet()
  const [file, setFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [thumbnailError, setThumbnailError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [pinningProgress, setPinningProgress] = useState(0)
  const [isVerifyingContract, setIsVerifyingContract] = useState(false)
  const [contractVerified, setContractVerified] = useState<boolean | null>(null)
  const [userBalance, setUserBalance] = useState<string | null>(null)
  const [hasEnoughBalance, setHasEnoughBalance] = useState<boolean | null>(null)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean | null>(null)
  const [currentNetwork, setCurrentNetwork] = useState<string | null>(null)
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false)
  const [isTestingContract, setIsTestingContract] = useState(false)
  const [contractTestResult, setContractTestResult] = useState<any>(null)
  const [isTestingSimplified, setIsTestingSimplified] = useState(false)
  const [debugMode, setDebugMode] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: "0.05",
    },
  })

  useEffect(() => {
    const checkContractAndNetwork = async () => {
      setIsVerifyingContract(true)
      try {
        const networkCheck = await checkNetwork();
        setIsCorrectNetwork(networkCheck.isCorrectNetwork);
        setCurrentNetwork(networkCheck.currentNetwork);
        
        if (!networkCheck.isCorrectNetwork) {
          toast({
            title: "Wrong Network",
            description: `You are connected to ${networkCheck.currentNetwork}. Please switch to Sepolia testnet.`,
            variant: "destructive",
          });
          setIsVerifyingContract(false);
          return;
        }
        
        const isVerified = await verifyContract()
        setContractVerified(isVerified)
        if (!isVerified) {
          toast({
            title: "Contract Verification Failed",
            description: "There might be an issue with the contract connection. Check the console for details.",
            variant: "destructive",
          })
        }
        
        const { hasBalance, balance } = await checkUserBalance()
        setUserBalance(balance)
        setHasEnoughBalance(hasBalance)
        if (!hasBalance) {
          toast({
            title: "Low Balance",
            description: `Your wallet balance (${balance} ETH) might not be enough to cover gas fees. Consider adding more ETH.`,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error verifying contract or checking network:", error)
        setContractVerified(false)
      } finally {
        setIsVerifyingContract(false)
      }
    }

    if (currentAccount) {
      checkContractAndNetwork()
    }
  }, [currentAccount])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setFileError(null)

    if (!selectedFile) {
      setFile(null)
      return
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setFileError("File size exceeds 50MB limit")
      setFile(null)
      return
    }

    const fileType = selectedFile.type
    if (!fileType.includes("pdf") && !fileType.includes("video")) {
      setFileError("Only PDF and video files are supported")
      setFile(null)
      return
    }

    setFile(selectedFile)
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setThumbnailError(null)

    if (!selectedFile) {
      setThumbnailFile(null)
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setThumbnailError("Thumbnail size exceeds 5MB limit")
      setThumbnailFile(null)
      return
    }

    const fileType = selectedFile.type
    if (!fileType.includes("image")) {
      setThumbnailError("Only image files are supported for thumbnails")
      setThumbnailFile(null)
      return
    }

    setThumbnailFile(selectedFile)
  }

  const getFileTypeIcon = () => {
    if (!file) return null
    
    if (file.type.includes("pdf")) {
      return <FileText className="h-6 w-6 text-blue-500" />
    } else if (file.type.includes("video")) {
      return <Video className="h-6 w-6 text-red-500" />
    }
    
    return null
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!currentAccount) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet to list a material",
          variant: "destructive",
        })
        return
      }

      const networkCheck = await checkNetwork();
      if (!networkCheck.isCorrectNetwork) {
        toast({
          title: "Wrong Network",
          description: `You are connected to ${networkCheck.currentNetwork}. Please switch to the correct network.`,
          variant: "destructive",
        });
        return;
      }

      if (contractVerified === false) {
        toast({
          title: "Contract Not Verified",
          description: "The smart contract could not be verified. Please check your connection and try again.",
          variant: "destructive",
        })
        return
      }

      if (hasEnoughBalance === false) {
        toast({
          title: "Insufficient Balance",
          description: `Your wallet balance (${userBalance} ETH) is too low to cover gas fees. Please add more ETH to your wallet.`,
          variant: "destructive",
        })
        return
      }

      if (!file) {
        setFileError("Please select a file to upload")
        return
      }

      setIsUploading(true)
      setUploadProgress(10)

      let contentHash = ""
      try {
        setUploadProgress(30)
        setPinningProgress(20)
        
        const contentResponse = await pinFileToIPFS(file, (progress) => {
          setPinningProgress(20 + Math.floor(progress * 0.6))
        })
        
        contentHash = contentResponse.url
        
        setUploadProgress(70)
        setPinningProgress(80)
        
        toast({
          title: "Content Pinned Successfully",
          description: "Your content has been pinned to IPFS and is ready to be listed.",
        });
      } catch (error) {
        console.error("Error pinning to IPFS:", error);
        throw new Error("Failed to pin content to IPFS");
      }

      let thumbnailHash = ""
      if (thumbnailFile) {
        try {
          setPinningProgress(85)
          
          const thumbnailResponse = await pinFileToIPFS(thumbnailFile, (progress) => {
            setPinningProgress(85 + Math.floor(progress * 0.1))
          })
          
          thumbnailHash = thumbnailResponse.url
          
          setPinningProgress(95)
          
          toast({
            title: "Thumbnail Pinned Successfully",
            description: "Your thumbnail has been pinned to IPFS.",
          });
        } catch (error) {
          console.error("Error pinning thumbnail to IPFS:", error);
          toast({
            title: "Thumbnail Upload Failed",
            description: "Continuing with listing without a thumbnail.",
            variant: "destructive",
          });
        }
      } else {
        thumbnailHash = "ipfs://QmdefaultEmptyThumbnailHash";
      }

      const previewHash = `ipfs://Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

      try {
        console.log("Listing material with parameters:", {
          title: values.title,
          description: values.description,
          category: values.category,
          contentHash,
          previewHash,
          thumbnailHash,
          price: values.price
        });

        const verifyResult = await verifyContractFunctions();
        if (!verifyResult.success) {
          toast({
            title: "Contract Verification Failed",
            description: verifyResult.error || "Could not verify contract functions. Proceeding with caution.",
            variant: "destructive",
          });
        }

        if (verifyResult.warning) {
          toast({
            title: "Contract Warning",
            description: verifyResult.warning,
          });
        }

        toast({
          title: "Submitting to Blockchain",
          description: "Attempting to list your material on the blockchain. This may take a moment...",
        });

        const result = await listMaterialWithFallback(
          values.title,
          values.description,
          values.category,
          contentHash,
          previewHash,
          thumbnailHash,
          values.price
        );

        if (typeof result === 'object' && result !== null) {
          if (result.success) {
            toast({
              title: "Material Listed Successfully",
              description: `Your study material has been pinned to IPFS and listed on the marketplace with ID: ${result.materialId}`,
            });
            
            form.reset();
            setFile(null);
            setThumbnailFile(null);
          } else {
            throw new Error(result.error || "Failed to list material on the blockchain");
          }
        } else if (result !== null) {
          toast({
            title: "Material Listed Successfully",
            description: `Your study material has been pinned to IPFS and listed on the marketplace with ID: ${result}`,
          });
          
          form.reset();
          setFile(null);
          setThumbnailFile(null);
        } else {
          throw new Error("Failed to list material on the blockchain");
        }
      } catch (error: any) {
        console.error("Error listing material on blockchain:", error);
        let errorMessage = "There was an error listing your material on the blockchain.";
        
        if (error.message) {
          errorMessage += ` Error: ${error.message}`;
        }
        
        toast({
          title: "Blockchain Transaction Failed",
          description: errorMessage,
          variant: "destructive",
        });

        toast({
          title: "Trying Alternative Method",
          description: "Attempting to list your material using a different method...",
        });

        try {
          const debugResult = await debugListMaterial(
            values.title,
            values.description,
            values.category,
            contentHash,
            previewHash,
            thumbnailHash,
            values.price
          );

          if (debugResult.success) {
            toast({
              title: "Material Listed Successfully",
              description: `Your study material has been listed on the marketplace with ID: ${debugResult.materialId}`,
            });
            
            form.reset();
            setFile(null);
            setThumbnailFile(null);
          } else {
            throw new Error(debugResult.error || "Failed to list material on the blockchain");
          }
        } catch (debugError: any) {
          console.error("Debug listing also failed:", debugError);
          toast({
            title: "All Attempts Failed",
            description: "We tried multiple methods to list your material, but all failed. Please try again later.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error uploading material:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your material. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setPinningProgress(0);
    }
  }

  const handleConnectWallet = async () => {
    try {
      await connect()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Wallet Connection Failed",
        description: "Please make sure MetaMask is installed and try again.",
        variant: "destructive",
      })
    }
  }

  const handleSwitchNetwork = async () => {
    setIsSwitchingNetwork(true)
    try {
      const success = await switchToCorrectNetwork()
      if (success) {
        toast({
          title: "Network Switched",
          description: "Successfully switched to Sepolia testnet.",
        })
        window.location.reload()
      } else {
        toast({
          title: "Network Switch Failed",
          description: "Failed to switch to Sepolia testnet. Please try manually switching in your wallet.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error switching network:", error)
      toast({
        title: "Network Switch Error",
        description: "An error occurred while trying to switch networks.",
        variant: "destructive",
      })
    } finally {
      setIsSwitchingNetwork(false)
    }
  }

  const handleTestContract = async () => {
    setIsTestingContract(true);
    try {
      const result = await testContractConnection();
      setContractTestResult(result);
      
      if (result.success) {
        toast({
          title: "Contract Test Successful",
          description: result.message,
        });
      } else {
        toast({
          title: "Contract Test Failed",
          description: result.message,
          variant: "destructive",
        });
      }
      
      console.log('Contract test result:', result);
    } catch (error) {
      console.error('Error testing contract:', error);
      toast({
        title: "Contract Test Error",
        description: "An unexpected error occurred while testing the contract.",
        variant: "destructive",
      });
    } finally {
      setIsTestingContract(false);
    }
  };

  const handleTestSimplified = async () => {
    setIsTestingSimplified(true);
    try {
      const networkCheck = await checkNetwork();
      if (!networkCheck.isCorrectNetwork) {
        toast({
          title: "Wrong Network",
          description: `You are connected to ${networkCheck.currentNetwork}. Please switch to the correct network.`,
          variant: "destructive",
        });
        setIsTestingSimplified(false);
        return;
      }

      toast({
        title: "Testing Contract",
        description: "Attempting to list a material with simplified parameters...",
      });

      const result = await listMaterialOnChainDebug(
        "Test Title",
        "Test Description",
        "Test",
        "ipfs://test-content-hash",
        "ipfs://test-preview-hash",
        "ipfs://test-thumbnail-hash",
        "0.01"
      );

      if (result !== null) {
        toast({
          title: "Test Successful",
          description: `Successfully listed test material with ID: ${result}`,
        });
      } else {
        toast({
          title: "Test Failed",
          description: "Failed to list test material. Check console for details.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error testing with simplified parameters:", error);
      toast({
        title: "Test Error",
        description: error.message || "An error occurred during the test",
        variant: "destructive",
      });
    } finally {
      setIsTestingSimplified(false);
    }
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  return (
    <div className="max-w-6xl mx-auto rounded-xl border border-slate-800 bg-gradient-to-b from-black/50 to-slate-900/50 p-8 backdrop-blur-sm">
     

      {isVerifyingContract && (
        <div className="text-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-purple-500" />
          <p className="text-slate-300">Checking network and verifying contract...</p>
        </div>
      )}

      {isCorrectNetwork === false && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Wrong Network</AlertTitle>
          <AlertDescription className="flex flex-col space-y-2">
            <p>You are connected to {currentNetwork}. This app requires Sepolia testnet.</p>
            <Button 
              onClick={handleSwitchNetwork} 
              disabled={isSwitchingNetwork}
              variant="outline" 
              className="mt-2 bg-red-900/50 hover:bg-red-800/50 border-red-700"
            >
              {isSwitchingNetwork ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Switching...
                </>
              ) : (
                "Switch to Sepolia"
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {contractVerified === false && isCorrectNetwork !== false && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Contract Verification Failed</AlertTitle>
          <AlertDescription className="flex flex-col space-y-2">
            <p>There might be an issue with the smart contract connection. Please check your network connection and wallet settings.</p>
            <Button 
              onClick={handleTestContract} 
              disabled={isTestingContract}
              variant="outline" 
              className="mt-2 bg-amber-900/50 hover:bg-amber-800/50 border-amber-700"
            >
              {isTestingContract ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Contract...
                </>
              ) : (
                "Test Contract Connection"
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {debugMode && (
        <Alert className="mb-4 bg-amber-900/30 border-amber-700">
          <Bug className="h-4 w-4" />
          <AlertTitle>Debug Tools</AlertTitle>
          <AlertDescription className="flex flex-col space-y-2">
            <p>Use these tools to diagnose contract issues:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button 
                onClick={handleTestContract} 
                disabled={isTestingContract}
                variant="outline" 
                size="sm"
                className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-700"
              >
                {isTestingContract ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test Contract Connection"
                )}
              </Button>
              
              <Button 
                onClick={handleTestSimplified} 
                disabled={isTestingSimplified}
                variant="outline" 
                size="sm"
                className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-700"
              >
                {isTestingSimplified ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test With Simple Params"
                )}
              </Button>
              
              <Button 
                onClick={() => {
                  toast({
                    title: "Testing Empty Thumbnail",
                    description: "Checking console output for thumbnail handling...",
                  });
                  
                  const emptyThumbnail1 = "";
                  const emptyThumbnail2 = null;
                  const emptyThumbnail3 = { url: "" };
                  
                  console.log("Empty thumbnail handling test:");
                  console.log("Empty string:", typeof emptyThumbnail1, emptyThumbnail1 || "ipfs://QmdefaultEmptyThumbnailHash");
                  console.log("Null:", typeof emptyThumbnail2, emptyThumbnail2 || "ipfs://QmdefaultEmptyThumbnailHash");
                  console.log("Empty URL object:", typeof emptyThumbnail3, emptyThumbnail3.url || "ipfs://QmdefaultEmptyThumbnailHash");
                }}
                variant="outline" 
                size="sm"
                className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-700"
              >
                Test Thumbnail Handling
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {contractTestResult && (
        <Alert className={`mb-4 ${contractTestResult.success ? 'bg-green-900/50 border-green-700' : 'bg-red-900/50 border-red-700'}`}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{contractTestResult.success ? 'Contract Test Successful' : 'Contract Test Failed'}</AlertTitle>
          <AlertDescription>
            <p>{contractTestResult.message}</p>
            {contractTestResult.details && (
              <pre className="mt-2 text-xs overflow-auto max-h-40 p-2 bg-black/50 rounded">
                {JSON.stringify(contractTestResult.details, null, 2)}
              </pre>
            )}
          </AlertDescription>
        </Alert>
      )}

      {hasEnoughBalance === false && isCorrectNetwork !== false && (
        <Alert className="mb-4 bg-amber-900/50 border-amber-700">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <AlertTitle className="text-amber-200">Low Balance Warning</AlertTitle>
          <AlertDescription className="text-amber-300">
            Your wallet balance ({userBalance} ETH) might not be enough to cover gas fees. Consider adding more ETH before proceeding.
          </AlertDescription>
        </Alert>
      )}

      {!currentAccount ? (
        <div className="text-center">
          <p className="mb-4 text-slate-300">
            Please connect your wallet to upload study materials
          </p>
          <Button 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Introduction to Blockchain" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A comprehensive guide to blockchain technology..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
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

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <FormLabel>File</FormLabel>
                  <div className="rounded-lg border border-dashed border-slate-700 p-6">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Upload className="h-8 w-8 text-slate-500" />
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
                        className="mt-2"
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
                      <AlertDescription>{fileError}</AlertDescription>
                    </Alert>
                  )}

                  {file && (
                    <div className="mt-4 rounded-lg bg-slate-800 p-3">
                      <div className="flex items-center space-x-3">
                        {getFileTypeIcon()}
                        <div className="flex-1">
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

                  {isUploading && (
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-xs text-slate-400">Uploading file</p>
                          <p className="text-xs text-slate-400">{uploadProgress}%</p>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-800">
                          <div
                            className="h-1.5 rounded-full bg-blue-500"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>

                      {uploadProgress === 100 && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <p className="text-xs text-slate-400">Pinning to IPFS</p>
                            <p className="text-xs text-slate-400">{pinningProgress}%</p>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-800">
                            <div
                              className="h-1.5 rounded-full bg-purple-500"
                              style={{ width: `${pinningProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <FormLabel>Thumbnail</FormLabel>
                  <div className="rounded-lg border border-dashed border-slate-700 p-6">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Upload className="h-8 w-8 text-slate-500" />
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
                        className="mt-2"
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
                      <AlertDescription>{thumbnailError}</AlertDescription>
                    </Alert>
                  )}

                  {thumbnailFile && (
                    <div className="mt-4 rounded-lg bg-slate-800 p-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
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
            </div>

            <div className="pt-4">
              <Alert className="bg-slate-800 text-slate-300 border-purple-800">
                <AlertTriangle className="h-4 w-4 text-purple-400" />
                <AlertTitle className="text-white">IPFS Pinning Notice</AlertTitle>
                <AlertDescription className="text-slate-400">
                  Your content will be pinned to IPFS (InterPlanetary File System), a distributed storage system.
                  The content identifier (CID) will be stored on the blockchain, allowing buyers to access your
                  material directly. Content on IPFS is public but can only be discovered by those who know the CID.
                </AlertDescription>
              </Alert>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Upload & Pin to IPFS"
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}
