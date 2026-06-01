// ─── BestSellers.jsx ─────────────────────────────────────────────────────
import React from "react";
import { motion } from "framer-motion";
import { getFoodAnalytics, formatCurrency } from "../utils/dashboardHelpers";
import "../styles/BestSellers.css";
import "../styles/RevenueChart.css";

const RANK_CLASS = ["top1", "top2", "top3"];

const BestSellers = ({ orders }) => {
  const { top10 } = getFoodAnalytics(orders);
  const maxQty = top10[0]?.qty || 1;

  return (
    <motion.div
      className="bestsellers-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.26 }}
    >
      <div className="chart-header">
        <span className="chart-title">⭐ Best Sellers</span>
        <span className="chart-badge">Top {top10.length}</span>
      </div>

      <ul className="bs-list">
        {top10.map((food, i) => (
          <motion.li
            key={food.name}
            className="bs-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.3 }}
          >
            <span className={`bs-rank ${RANK_CLASS[i] || ""}`}>{i + 1}</span>
            <span className="bs-name">{food.name}</span>
            <div className="bs-qty-bar-wrap">
              <div className="bs-bar-bg">
                <div
                  className="bs-bar-fill"
                  style={{ width: `${(food.qty / maxQty) * 100}%` }}
                />
              </div>
            </div>
            <span className="bs-qty">{food.qty} sold</span>
            <span className="bs-revenue">{formatCurrency(food.revenue)}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default BestSellers;
