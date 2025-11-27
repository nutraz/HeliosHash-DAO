"use client"

import React from "react"
import { motion } from "framer-motion"

type Props = {
  delay?: number
  duration?: number
  particleCount?: number
  logoSrc?: string
  onAnimationComplete?: () => void
}

export default function HhdaoSplash({
  delay = 0,
  duration = 1.2,
  particleCount = 18,
  logoSrc = "/icons/helios-logo.png",
  onAnimationComplete,
}: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-white z-[9999]">
      <div className="flex flex-col items-center gap-6 px-6">
        <motion.img
          src={logoSrc}
          alt="HeliosHash"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay, duration: duration, type: "spring", stiffness: 120 }}
          onAnimationComplete={onAnimationComplete}
          className="w-36 h-36 object-contain"
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.15, duration: 0.7 }}
          className="text-center"
        >
          <h1 className="text-2xl font-semibold">HeliosHash DAO</h1>
          <p className="text-sm text-slate-200/90 mt-1">Decentralized renewable energy governance</p>
        </motion.div>

        <motion.div
          className="mt-4 flex gap-2 items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + duration }}
        >
          {Array.from({ length: particleCount }).map((_, i) => (
            <motion.span
              key={i}
              className="block bg-white/90 rounded-full"
              style={{ width: 8, height: 8 }}
              animate={{ y: [0, -8, 0], opacity: [0.9, 0.6, 0.9] }}
              transition={{ repeat: Infinity, duration: 0.9 + (i % 3) * 0.12, delay: i * 0.03 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
