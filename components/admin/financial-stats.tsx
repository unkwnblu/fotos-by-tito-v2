"use client";

import { useEffect, useState } from "react";
import { getFinancialStats } from "@/app/admin/bookings/actions";
import { TrendingUp, Clock, Euro, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export function FinancialStats() {
  const [stats, setStats] = useState<{ profit: number; unsettled: number }>({
    profit: 0,
    unsettled: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const data = await getFinancialStats();
      setStats(data);
      setIsLoading(false);
    }
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="h-32 bg-muted/50 rounded-xl animate-pulse" />
        <div className="h-32 bg-muted/50 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Total Profit Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#2d5d4b] to-[#1e3d32] text-white rounded-xl p-6 shadow-lg"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <TrendingUp className="w-24 h-24" />
        </div>
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Euro className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium opacity-90 uppercase tracking-widest">
              Total Profit
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-serif font-bold">
              €{stats.profit.toLocaleString()}
            </h3>
            <p className="text-xs opacity-75 mt-1">From completed bookings</p>
          </div>
        </div>
      </motion.div>

      {/* Unsettled/Pending Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden bg-white dark:bg-card border border-border text-foreground rounded-xl p-6 shadow-sm"
      >
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.05]">
          <Clock className="w-24 h-24" />
        </div>
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Unsettled
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-serif font-bold text-foreground">
              €{stats.unsettled.toLocaleString()}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Confirmed but not completed
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
