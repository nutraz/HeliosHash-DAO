import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Wallet, Medal, Users, Building2, Clock } from 'lucide-react';

const StatusBanner = () => {
  // Progress and countdown state
  const progress = 68; // e.g., 68% to next level
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 0, minutes: 0 });

  // Simple countdown logic (replace with real logic as needed)
  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 3);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
      const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
      const minutes = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));
      setTimeLeft({ days, hours, minutes });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative bg-gradient-to-r from-purple-900/30 via-blue-900/20 to-emerald-900/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl mb-8"
    >
      {/* Animated floating particles (optional background) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
        {/* Left: Greeting + Rank + KYC */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold text-white flex items-center gap-2"
          >
            👋 Welcome back, <span className="text-emerald-300">Priya!</span>
          </motion.h2>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-200">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1 rounded-full border border-yellow-500/30"
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span className="font-medium text-yellow-200">🌟 Silver Collaborator</span>
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30"
            >
              <span className="text-green-300">🔐 KYC Verified</span>
            </motion.div>

            <motion.a
              href="https://opensea.io/collection/one-world-project"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30 group cursor-pointer"
            >
              <span className="text-blue-300">🖼️ One World NFT</span>
              <ArrowUpRight className="w-3 h-3 text-blue-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.a>
          </div>
        </div>

        {/* Right: Stats + Earning Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Wallet, label: "Staked", value: "1,250 $HH", color: "text-emerald-300", bg: "bg-emerald-500/10" },
            { icon: Medal, label: "Points", value: "840", color: "text-amber-300", bg: "bg-amber-500/10" },
            { icon: Users, label: "Earned", value: "320 $HH", color: "text-purple-300", bg: "bg-purple-500/10", tooltip: "From contributing & staking" },
            { icon: Building2, label: "Lending", value: "180 $HH", color: "text-cyan-300", bg: "bg-cyan-500/10", tooltip: "From liquidity pools" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`flex flex-col items-center p-3 rounded-xl ${stat.bg} border border-white/10 cursor-help group`}
              title={stat.tooltip || ""}
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-1`} />
              <span className={`text-sm font-semibold ${stat.color}`}>{stat.value}</span>
              <span className="text-xs text-gray-400 mt-0.5">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Level Up Progress Bar & Countdown */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Progress Bar */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-300">Level Up Progress</span>
            <span className="text-xs text-emerald-300 font-semibold">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-3 bg-gradient-to-r from-emerald-400 via-amber-400 to-purple-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
        {/* Countdown */}
        <div className="flex items-center gap-2 bg-emerald-800/30 border border-emerald-400/30 rounded-full px-4 py-1 shadow text-xs text-emerald-200 font-medium">
          <Clock className="w-4 h-4 text-emerald-300" />
          Next Reward Unlocks in&nbsp;
          <span className="font-bold text-emerald-100">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
          </span>
        </div>
      </div>

      {/* Subtle animated wave divider (optional) */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-transparent to-white/5 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      />
    </motion.div>
  );
};

export default StatusBanner;
