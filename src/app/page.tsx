// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Lock, Shield, UserCheck, Zap } from "lucide-react"
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import { useRouter } from 'next/navigation'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function LandingPage() {

  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(false)
  const { address, isConnected, caipAddress, status } = useAppKitAccount()

  useEffect(() => {
    if (isConnected) {
      console.log("Wallet connected: ", address, caipAddress)
      router.push("/dashboard")
    }
  }, [isConnected])

  return (
    <div className="flex flex-col min-h-screen bg-black text-gray-100">
      <motion.header 
        className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link className="flex items-center justify-center" href="#">
          <Lock className="h-6 w-6 text-blue-400" />
          <span className="ml-2 text-2xl font-bold text-blue-400">PrivateFeedbackSDK</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-blue-400 transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-blue-400 transition-colors" href="#how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-medium hover:text-blue-400 transition-colors" href="#get-started">
            Get Started
          </Link>
        </nav>
      </motion.header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <motion.div 
            className="container px-4 md:px-6"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div className="space-y-2" variants={fadeIn}>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Secure, Private, and Verified Feedback
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Empower your business with blockchain-verified user interactions and anonymous feedback using our cutting-edge SDK.
                </p>
              </motion.div>
              <motion.div className="space-x-4" variants={fadeIn}>
                <w3m-button label="Connect Wallet to Get Started"/>
              </motion.div>
            </div>
          </motion.div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <motion.div 
            className="container px-4 md:px-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 
              className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-blue-400"
              variants={fadeIn}
            >
              Key Features
            </motion.h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <motion.div variants={fadeIn}>
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <Shield className="h-10 w-10 text-blue-400 mb-2" />
                    <CardTitle className="text-blue-400">Secure Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300">
                      Easy-to-integrate SDK that verifies user interactions on the blockchain, ensuring authenticity and trust.
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn}>
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <UserCheck className="h-10 w-10 text-blue-400 mb-2" />
                    <CardTitle className="text-blue-400">World ID Verification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300">
                      Integrate with World ID for robust humanity verification, preventing spam and ensuring genuine feedback.
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn}>
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <Lock className="h-10 w-10 text-blue-400 mb-2" />
                    <CardTitle className="text-blue-400">Privacy-First Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300">
                      End-to-end encrypted feedback that's untraceable to individual users, protecting privacy while providing valuable insights.
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <motion.div 
            className="container px-4 md:px-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 
              className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-blue-400"
              variants={fadeIn}
            >
              How It Works
            </motion.h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <motion.div className="flex flex-col items-center text-center" variants={fadeIn}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                  1
                </div>
                <h3 className="mt-4 text-xl font-bold text-blue-400">Integrate SDK</h3>
                <p className="mt-2 text-gray-400">
                  Easily integrate our SDK into your product to enable secure user interaction verification.
                </p>
              </motion.div>
              <motion.div className="flex flex-col items-center text-center" variants={fadeIn}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                  2
                </div>
                <h3 className="mt-4 text-xl font-bold text-blue-400">Verify & Collect Feedback</h3>
                <p className="mt-2 text-gray-400">
                  Users verify their humanity with World ID and provide encrypted, anonymous feedback.
                </p>
              </motion.div>
              <motion.div className="flex flex-col items-center text-center" variants={fadeIn}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                  3
                </div>
                <h3 className="mt-4 text-xl font-bold text-blue-400">Analyze Insights</h3>
                <p className="mt-2 text-gray-400">
                  Access valuable, privacy-preserving feedback to improve your product and user experience.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>
        <section id="get-started" className="w-full py-12 md:py-24 lg:py-32 bg-blue-900">
          <motion.div 
            className="container px-4 md:px-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div className="space-y-2" variants={fadeIn}>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Revolutionize Your Feedback System?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl">
                  Join the future of secure, private, and verified user feedback. Get started with PrivateFeedbackSDK today!
                </p>
              </motion.div>
              <motion.div variants={fadeIn}>
                <w3m-button label="Connect Wallet ➡"/>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>
      <motion.footer 
        className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className="text-xs text-gray-500">© 2024 PrivateFeedbackSDK. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500 hover:text-gray-300" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-500 hover:text-gray-300" href="#">
            Privacy Policy
          </Link>
        </nav>
      </motion.footer>
    </div>
  )
}