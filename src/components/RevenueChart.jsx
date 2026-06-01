// ─── RevenueChart.jsx ─────────────────────────────────────────────────────
import React from "react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import {
  getRevenueTrend, getDailyRevenue, getMonthlyRevenue,
  getHighLowRevenueDay, formatCurrency,
} from "../utils/dashboardHelpers";
import "../styles/RevenueChart.css";

const TOOLTIP_STYLE = {
  backgroundColor: "#1a1a2e",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "0.8rem",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE}>
      <p style={{ marginBottom: 4, opacity: 0.6, fontSize: "0.72rem" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color, margin: 0 }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

const RevenueChart = ({ orders }) => {
  const trend = getRevenueTrend(orders);
  const daily = getDailyRevenue(orders);
  const monthly = getMonthlyRevenue(orders);
  const { highest, lowest } = getHighLowRevenueDay(orders);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Revenue Trend Line */}
      <div className="chart-card">
        <div className="chart-header">
          <span className="chart-title">📈 Revenue Trend</span>
          <span className="chart-badge">Area Chart</span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={trend}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" stroke="rgba(227, 152, 53, 0.92)" tick={{ fontSize: 11 }} />
            <YAxis stroke="rgba(227, 152, 53, 0.92)" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#f97316"
              strokeWidth={2.5}
              fill="url(#revGrad)"
              dot={{ r: 3, fill: "#f97316" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="revenue-grid" style={{ marginTop: "1.25rem" }}>
        {/* Daily Revenue Bar */}
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">📊 Daily Revenue</span>
            <span className="chart-badge">Bar Chart</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={daily} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="rgba(227, 152, 53, 0.92)" tick={{ fontSize: 10 }} />
              <YAxis stroke="rgba(227, 152, 53, 0.92)" tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill="#B35C1E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Summary */}
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">🗓️ Monthly Summary</span>
          </div>
          <table className="monthly-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {monthly.map((m) => (
                <tr key={m.month}>
                  <td>{m.month}</td>
                  <td>{formatCurrency(m.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Highest / Lowest Day */}
          <div className="day-highlight-box">
            {highest && (
              <div className="day-box highest">
                <div className="day-box-label">▲ Highest Day</div>
                <div className="day-box-date">{highest.date}</div>
                <div className="day-box-val">{formatCurrency(highest.revenue)}</div>
              </div>
            )}
            {lowest && (
              <div className="day-box lowest">
                <div className="day-box-label">▼ Lowest Day</div>
                <div className="day-box-date">{lowest.date}</div>
                <div className="day-box-val">{formatCurrency(lowest.revenue)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RevenueChart;
