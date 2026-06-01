// ─── AlertsPanel.jsx ─────────────────────────────────────────────────────
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiAlertCircle, FiInfo } from "react-icons/fi";
import { getAlerts, shortId } from "../utils/dashboardHelpers";
import "../styles/AlertsPanel.css";
import "../styles/RevenueChart.css";

const ICONS = {
  warning: <FiAlertTriangle />,
  error: <FiAlertCircle />,
  info: <FiInfo />,
};

const AlertsPanel = ({ orders }) => {
  const alerts = getAlerts(orders);

  return (
    <motion.div
      className="alerts-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.24 }}
    >
      <div className="chart-header">
        <span className="chart-title">🚨 Alerts Panel</span>
        <span className="chart-badge">{alerts.length} alerts</span>
      </div>

      {alerts.length === 0 ? (
        <div className="no-alerts">✅ No alerts – everything looks good!</div>
      ) : (
        <div className="alerts-list">
          <AnimatePresence>
            {alerts.map((a, i) => (
              <motion.div
                key={`${a.type}-${a.orderId}-${i}`}
                className={`alert-item ${a.severity}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <span className="alert-icon">{ICONS[a.severity]}</span>
                <span className="alert-msg">
                  {a.message}
                  <span className="alert-id">{shortId(a.orderId)}</span>
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default AlertsPanel;
