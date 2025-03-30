# Vercel Deployment Guide

This document provides instructions for deploying the Study Marketplace application on Vercel.

## Prerequisites

- A [Vercel](https://vercel.com/) account
- A GitHub repository with your project code
- Pinata API Keys (API Key, Secret Key, and JWT)

## Deployment Steps

### 1. Connect Your Repository to Vercel

1. Log in to your [Vercel dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository (You may need to install the Vercel GitHub app if you haven't already)
4. Select the LearnEX repository

### 2. Configure Environment Variables

In the project settings before deployment, add the following environment variables:

1. Click on "Environment Variables" section
2. Add each of these environment variables:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_PINATA_API_KEY` | `32b02a35fa82d48bdcb2` |
   | `NEXT_PUBLIC_PINATA_API_SECRET` | `e2b4daa6690fb196508dca8d52aa96baa45fdfc828dd0ac81f64cd59aefc806c` |
   | `NEXT_PUBLIC_PINATA_JWT` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzN2FmMTU2Mi1jZmYzLTQ4NTgtODQ1MS04N2Q4M2JhYTg0OTYiLCJlbWFpbCI6InJha2VzaDkwNDY2NEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMzJiMDJhMzVmYTgyZDQ4YmRjYjIiLCJzY29wZWRLZXlTZWNyZXQiOiJlMmI0ZGFhNjY5MGZiMTk2NTA4ZGNhOGQ1MmFhOTZiYWE0NWZkZmM4MjhkZDBhYzgxZjY0Y2Q1OWFlZmM4MDZjIiwiZXhwIjoxNzczNTc4MjU2fQ.cE_o_G7_hkVivdSq1gMMTWSM7Nz58E_b5Nf4PHCZNZE` |
   | `NEXT_PUBLIC_CONTRACT_ADDRESS` | `0x775FeDAACfa5976E366A341171F3A59bcce383d0` |
   | `NEXT_PUBLIC_CHAIN_ID` | `656476` |
   | `NEXT_PUBLIC_PLATFORM_FEE_PERCENT` | `2.5` |

3. Click "Save" for each environment variable

### 3. Deploy

1. In the project settings, ensure the following:
   - Framework Preset: Next.js
   - Build Command: `npm run build` (default)
   - Install Command: `npm install` (default)
   - Output Directory: `.next` (default)

2. Click "Deploy"

### 4. Verify Deployment

1. Once deployed, Vercel will provide you with a URL to your application
2. Visit the URL to ensure the application is working correctly
3. Test the functionality to verify that the Pinata API integration is working

### 5. Custom Domain (Optional)

If you want to use a custom domain:

1. Go to the "Domains" section in your project settings
2. Add your domain and follow the DNS configuration instructions provided by Vercel

## Automatic Deployments

By default, Vercel will automatically deploy any changes pushed to your GitHub repository's main branch. You can customize this behavior in the project settings.

## Troubleshooting

If you encounter issues with the deployment:

1. Check the deployment logs in Vercel dashboard
2. Verify that all environment variables are set correctly
3. Ensure that the Pinata API keys are valid
4. Check that the contract address and chain ID are correct

For more help, refer to [Vercel's documentation](https://vercel.com/docs) or open an issue in the GitHub repository. 