import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell,
} from "recharts";
import { motion } from "framer-motion";
import { getTableAnalytics, formatCurrency } from "../utils/dashboardHelpers";
import "../styles/TableAnalytics.css";
import "../styles/RevenueChart.css";

const RANK_CLASS = ["gold", "silver", "bronze"];

const TOOLTIP_STYLE = {
  backgroundColor: "#1a1a2e",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "0.8rem",
};

const TableAnalytics = ({ orders }) => {
  const { all, top5 } = getTableAnalytics(orders);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="table-analytics-grid">
        {/* Orders Per Table Bar */}
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">🪑 Orders Per Table</span>
            <span className="chart-badge">All Tables</span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={all} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#B35C1E" />
              <XAxis dataKey="table" stroke="#B35C1E" tick={{ fontSize: 9 }} />
              <YAxis stroke="#B35C1E" tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="orders" name="Orders" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
                {all.map((_, i) => (
                  <Cell key={i} fill={`hsl(${195 + i * 12}, 80%, 55%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Per Table Bar */}
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">💵 Revenue Per Table</span>
            <span className="chart-badge">All Tables</span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={all} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#B35C1E" />
              <XAxis dataKey="table" stroke="#B35C1E" tick={{ fontSize: 9 }} />
              <YAxis
                stroke="#B35C1E"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v) => [formatCurrency(v), "Revenue"]}
              />
              <Bar dataKey="revenue" name="Revenue" radius={[4, 4, 0, 0]}>
                {all.map((_, i) => (
                  <Cell key={i} fill={`hsl(${30 + i * 10}, 85%, 55%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 5 Revenue Generating Tables */}
        <div className="chart-card" style={{ gridColumn: "1 / -1" }}>
          <div className="chart-header">
            <span className="chart-title">🏅 Top 5 Revenue Tables</span>
          </div>
          <ul className="table-rank-list">
            {top5.map((t, i) => (
              <li key={t.table} className="table-rank-item">
                <span className={`rank-badge ${RANK_CLASS[i] || "other"}`}>
                  {i + 1}
                </span>
                <span className="rank-table-name">{t.table}</span>
                <span className="rank-orders">{t.orders} orders</span>
                <span className="rank-revenue">{formatCurrency(t.revenue)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default TableAnalytics;
