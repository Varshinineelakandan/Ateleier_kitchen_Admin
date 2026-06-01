
import React from "react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
} from "recharts";
import { motion } from "framer-motion";
import { getPaymentAnalytics, formatCurrency } from "../utils/dashboardHelpers";
import "../styles/PaymentAnalytics.css";
import "../styles/RevenueChart.css";

const METHOD_COLORS = {
  Online: "#6366f1",
  COD: "#eab308",
};

const TOOLTIP_STYLE = {
  backgroundColor: "#1a1a2e",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "0.8rem",
};

const PaymentAnalytics = ({ orders }) => {
  const analytics = getPaymentAnalytics(orders);

  const pieData = analytics.map((a) => ({
    name: a.method,
    value: a.count,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.18 }}
    >
      <div className="payment-grid">
        {/* Distribution Pie */}
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">💳 Payment Distribution</span>
            <span className="chart-badge">Pie Chart</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={88}
                paddingAngle={4}
              >
                {pieData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={METHOD_COLORS[entry.name] || "#94a3b8"}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend
                formatter={(v) => (
                  <span style={{ color: "rgb(9, 9, 9)", fontSize: "0.78rem" }}>
                    {v}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Breakdown */}
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">📋 Breakdown</span>
          </div>

          {analytics.map((a) => (
            <div key={a.method} className="payment-row">
              <span
                className={`payment-method-badge ${a.method.toLowerCase()}`}
              >
                {a.method}
              </span>
              <div className="payment-stat-col">
                <div className="payment-stat-val">{formatCurrency(a.revenue)}</div>
                <div className="payment-stat-sub">{a.count} orders</div>
              </div>
              <span className="pct-pill">{a.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentAnalytics;
