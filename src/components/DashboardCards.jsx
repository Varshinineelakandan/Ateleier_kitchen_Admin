// ─── DashboardCards.jsx ───────────────────────────────────────────────────
import React from "react";
import { motion } from "framer-motion";
import {
  FiDollarSign, FiShoppingBag, FiClock, FiCheckCircle,
  FiGrid, FiWifi, FiTruck, FiTrendingUp,
} from "react-icons/fi";
import { formatCurrency } from "../utils/dashboardHelpers";
import "../styles/DashboardCards.css";

const CARD_META = [
  {
    key: "totalRevenue",
    label: "Total Revenue",
    icon: FiDollarSign,
    accent: "#f97316",
    format: formatCurrency,
    sub: "All-time earnings",
  },
  {
    key: "totalOrders",
    label: "Total Orders",
    icon: FiShoppingBag,
    accent: "#6366f1",
    format: (v) => v,
    sub: "All orders placed",
  },
  {
    key: "pendingOrders",
    label: "Pending Orders",
    icon: FiClock,
    accent: "#eab308",
    format: (v) => v,
    sub: "Awaiting fulfillment",
  },
  {
    key: "deliveredOrders",
    label: "Delivered Orders",
    icon: FiCheckCircle,
    accent: "#22c55e",
    format: (v) => v,
    sub: "Successfully served",
  },
  {
    key: "activeTables",
    label: "Active Tables",
    icon: FiGrid,
    accent: "#0ea5e9",
    format: (v) => v,
    sub: "Unique tables ordered",
  },
  {
    key: "onlinePayments",
    label: "Online Payments",
    icon: FiWifi,
    accent: "#a855f7",
    format: (v) => v,
    sub: "Digital transactions",
  },
  {
    key: "codPayments",
    label: "COD Payments",
    icon: FiTruck,
    accent: "#ec4899",
    format: (v) => v,
    sub: "Cash on delivery",
  },
  {
    key: "avgOrderValue",
    label: "Avg Order Value",
    icon: FiTrendingUp,
    accent: "#14b8a6",
    format: formatCurrency,
    sub: "Per order average",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: "easeOut" },
  }),
};

const DashboardCards = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="cards-grid">
      {CARD_META.map((meta, i) => {
        const Icon = meta.icon;
        const raw = stats[meta.key] ?? 0;
        const display = meta.format(raw);

        return (
          <motion.div
            key={meta.key}
            className="stat-card"
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            style={{ "--card-accent": meta.accent, "--icon-bg": `${meta.accent}22` }}
          >
            <div className="card-glow-blob" style={{ background: meta.accent }} />
            <div className="card-header">
              <span className="card-label">{meta.label}</span>
              <div className="card-icon">
                <Icon />
              </div>
            </div>
            <div className="card-value">{display}</div>
            <div className="card-sub">{meta.sub}</div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
