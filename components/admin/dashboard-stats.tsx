"use client";

import { useEffect, useState } from "react";
import { getFinancialStats } from "@/app/admin/bookings/actions";
import { TrendingUp, Clock, Euro, Wallet, Users } from "lucide-react";
import { motion } from "framer-motion";

export function DashboardStats() {
  const [stats, setStats] = useState<{
    profit: number;
    unsettled: number;
    total_bookings: number;
  }>({
    profit: 0,
    unsettled: 0,
    total_bookings: 0,
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Profit",
      value: `€${stats.profit.toLocaleString()}`,
      sub: "From completed bookings",
      icon: TrendingUp,
      color: "bg-[#2d5d4b]",
      textColor: "text-white",
      iconBg: "bg-white/20",
    },
    {
      label: "Unsettled",
      value: `€${stats.unsettled.toLocaleString()}`,
      sub: "Confirmed pending payment",
      icon: Wallet,
      color: "bg-yellow-500",
      textColor: "text-white",
      iconBg: "bg-white/20",
    },
    {
      label: "Total Bookings",
      value: stats.total_bookings.toString(),
      sub: "All time requests",
      icon: Users,
      color: "bg-blue-600",
      textColor: "text-white",
      iconBg: "bg-white/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, idx) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`relative overflow-hidden ${card.color} ${card.textColor} rounded-xl p-6 shadow-lg`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <card.icon className="w-24 h-24" />
          </div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-lg ${card.iconBg}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium opacity-90 uppercase tracking-widest">
                {card.label}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-4xl font-serif font-bold">{card.value}</h3>
              <p className="text-xs opacity-75 mt-1">{card.sub}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
