// ─── OrdersChart.jsx ──────────────────────────────────────────────────────
import React from "react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import {
  getOrdersByStatus, getCompletionRate, getOrderTimeline,
} from "../utils/dashboardHelpers";
import "../styles/OrdersChart.css";
import "../styles/RevenueChart.css";

const STATUS_COLORS = {
  Pending: "#eab308",
  Delivered: "#22c55e",
  Cancelled: "#ef4444",
  Processing: "#B35C1E",
};

const TOOLTIP_STYLE = {
  backgroundColor: "#1a1a2e",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "0.8rem",
};

const OrdersChart = ({ orders }) => {
  const byStatus = getOrdersByStatus(orders);
  const completionRate = getCompletionRate(orders);
  const timeline = getOrderTimeline(orders);
  const totalOrders = orders.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="orders-chart-grid">
        {/* Orders by Status Pie */}
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">🥧 Orders by Status</span>
            <span className="chart-badge">Pie Chart</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={byStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {byStatus.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={STATUS_COLORS[entry.status] || "#94a3b8"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v, name) => [v, name]}
              />
              <Legend
                formatter={(v) => (
                  <span style={{ color: "rgb(16, 15, 15)", fontSize: "0.78rem" }}>
                    {v}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Completion Rate + Pending vs Delivered */}
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">✅ Completion Rate</span>
          </div>
          <div className="completion-ring-wrap">
            <div className="completion-rate-val">{completionRate}%</div>
            <div className="completion-rate-label">Orders Completed</div>
          </div>

          <div style={{ marginTop: "1rem" }}>
            {byStatus.map((s) => {
              const pct = totalOrders ? ((s.count / totalOrders) * 100).toFixed(1) : 0;
              return (
                <div key={s.status} className="pv-row">
                  <span className="pv-label">{s.status}</span>
                  <div className="pv-bar-bg">
                    <div
                      className="pv-bar-fill"
                      style={{
                        width: `${pct}%`,
                        background: STATUS_COLORS[s.status] || "#94a3b8",
                      }}
                    />
                  </div>
                  <span className="pv-count">{s.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="chart-card" style={{ marginTop: "1.25rem" }}>
        <div className="chart-header">
          <span className="chart-title">⏱️ Order Timeline</span>
          <span className="chart-badge">Hourly</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="rgba(227, 152, 53, 0.92)" tick={{ fontSize: 10 }} />
            <YAxis stroke="rgba(227, 152, 53, 0.92)" tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Line
              type="monotone"
              dataKey="count"
              name="Orders"
              stroke="#B35C1E"
              strokeWidth={2}
              dot={{ r: 3, fill: "#B35C1E" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default OrdersChart;
