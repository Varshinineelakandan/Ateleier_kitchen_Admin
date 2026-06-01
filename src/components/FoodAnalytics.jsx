// ─── FoodAnalytics.jsx ───────────────────────────────────────────────────
import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell,
} from "recharts";
import { motion } from "framer-motion";
import { getFoodAnalytics, formatCurrency } from "../utils/dashboardHelpers";
import "../styles/FoodAnalytics.css";
import "../styles/RevenueChart.css";

const COLORS = [
  "#B35C1E",
  "#C68B59",
  "#D9B08C",
  "#E8DDD0",
  "#A8BBA0",
  "#89A88E",
  "#CFC5B6",
  "#B8A999",
];
const TOOLTIP_STYLE = {
  backgroundColor: "#1a1a2e",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "0.8rem",
};

const FoodAnalytics = ({ orders }) => {
  const { top10, mostOrdered, leastOrdered } = getFoodAnalytics(orders);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <div className="food-grid">
        {/* Top 10 Horizontal Bar */}
        <div className="chart-card" style={{ gridColumn: "1 / -1" }}>
          <div className="chart-header">
            <span className="chart-title">🍽️ Top 10 Selling Foods</span>
            <span className="chart-badge">By Quantity</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={top10} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="#B35C1E" tick={{ fontSize: 11 }} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#B35C1E"
                tick={{ fontSize: 11 }}
                width={110}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="qty" name="Qty Sold" radius={[0, 4, 4, 0]}>
                {top10.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Most / Least Ordered */}
          <div className="food-highlight-row">
            {mostOrdered && (
              <div className="food-highlight best">
                <div className="food-hl-label">🏆 Most Ordered</div>
                <div className="food-hl-name">{mostOrdered.name}</div>
                <div className="food-hl-qty">{mostOrdered.qty} sold · {formatCurrency(mostOrdered.revenue)}</div>
              </div>
            )}
            {leastOrdered && (
              <div className="food-highlight worst">
                <div className="food-hl-label">📉 Least Ordered</div>
                <div className="food-hl-name">{leastOrdered.name}</div>
                <div className="food-hl-qty">{leastOrdered.qty} sold · {formatCurrency(leastOrdered.revenue)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Revenue Per Food Bar */}
        <div className="chart-card" style={{ gridColumn: "1 / -1" }}>
          <div className="chart-header">
            <span className="chart-title">💰 Revenue Per Food</span>
            <span className="chart-badge">Top 10</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={top10} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#B35C1E" horizontal={false} />
              <XAxis
                type="number"
                stroke="#B35C1E"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `₹${v}`}
              />
              <YAxis
                dataKey="name"
                type="category"
                stroke="rgba(255,255,255,0.3)"
                tick={{ fontSize: 11 }}
                width={110}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v) => [formatCurrency(v), "Revenue"]}
              />
              <Bar dataKey="revenue" name="Revenue" radius={[0, 4, 4, 0]}>
                {top10.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodAnalytics;
