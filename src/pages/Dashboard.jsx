// ─── Dashboard.jsx ────────────────────────────────────────────────────────
// Main page – composes all section components.
// ──────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiRefreshCw, FiMenu, FiX,
  FiBarChart2, FiShoppingBag, FiDollarSign,
  FiPieChart, FiGrid, FiAlertCircle, FiList, FiStar,
  FiCreditCard, FiSun,
} from "react-icons/fi";

import orderService from "../services/orderService";
import {
  getOverviewStats, getTodayStats, formatCurrency,
} from "../utils/dashboardHelpers";

import DashboardCards   from "../components/DashboardCards";
import RevenueChart     from "../components/RevenueChart";
import OrdersChart      from "../components/OrdersChart";
import FoodAnalytics    from "../components/FoodAnalytics";
import PaymentAnalytics from "../components/PaymentAnalytics";
import TableAnalytics   from "../components/TableAnalytics";
import RecentOrdersTable from "../components/RecentOrdersTable";
import AlertsPanel      from "../components/AlertsPanel";
import BestSellers      from "../components/BestSellers";

import "../styles/Dashboard.css";

// ── Sidebar navigation config ─────────────────────────────────────────────
const NAV = [
  { id: "overview",   label: "Overview",         icon: FiBarChart2  },
  { id: "revenue",    label: "Revenue Analytics", icon: FiDollarSign },
  { id: "orders",     label: "Order Analytics",   icon: FiShoppingBag},
  { id: "food",       label: "Food Analytics",    icon: FiStar       },
  { id: "payment",    label: "Payment Analytics", icon: FiCreditCard },
  { id: "tables",     label: "Table Analytics",   icon: FiGrid       },
  { id: "recent",     label: "Recent Orders",     icon: FiList       },
  { id: "bestsellers",label: "Best Sellers",      icon: FiStar       },
  { id: "alerts",     label: "Alerts",            icon: FiAlertCircle},
  { id: "today",      label: "Today's Report",    icon: FiSun        },
];

// ── Section wrapper ───────────────────────────────────────────────────────
const Section = ({ id, icon: Icon, heading, sub, children }) => (
  <section id={id}>
    <div className="section-header">
      <div className="section-icon"><Icon /></div>
      <div>
        <div className="section-heading">{heading}</div>
        {sub && <div className="section-sub">{sub}</div>}
      </div>
    </div>
    {children}
  </section>
);

// ─────────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");

  const fetchOrders = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const data = await orderService.getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveNav(id);
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Loading dashboard…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-msg">⚠️ {error}</div>
        <button className="retry-btn" onClick={() => fetchOrders()}>Retry</button>
      </div>
    );
  }

  const stats = getOverviewStats(orders);
  const today = getTodayStats(orders);

  return (
    <div className="dashboard-root">
      {/* ── Sidebar ── */}
      <AnimatePresence>
        <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">🍽️</span>
            <span className="sidebar-logo-text">
              ATELIER<span>KITCHEN</span>
            </span>
          </div>
          <div className="sidebar-nav">
            <div className="nav-group-label">Navigation</div>
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${activeNav === item.id ? "active" : ""}`}
                  onClick={() => scrollTo(item.id)}
                >
                  <Icon className="nav-item-icon" />
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="sidebar-footer">
            RestoAdmin v1.0 · {new Date().getFullYear()}
          </div>
        </nav>
      </AnimatePresence>

      {/* ── Main ── */}
      <div className="main-content">
        {/* Header */}
        <header className="top-header">
          <div className="header-left">
            <button className="hamburger" onClick={() => setSidebarOpen((s) => !s)}>
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
            <div>
              <div className="page-title">Restaurant Dashboard</div>
              <div className="page-subtitle">
                {orders.length} total orders · {new Date().toLocaleDateString("en-IN", {
                  weekday: "short", year: "numeric", month: "short", day: "numeric",
                })}
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="live-dot" title="Live data" />
            <button
              className={`header-refresh-btn ${refreshing ? "spinning" : ""}`}
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
            >
              <FiRefreshCw />
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </header>

        {/* Body */}
        <main className="page-body">

          {/* ── Overview ── */}
          <Section id="overview" icon={FiBarChart2} heading="Overview" sub="Key metrics at a glance">
            <DashboardCards stats={stats} />
          </Section>

          {/* ── Revenue ── */}
          <Section id="revenue" icon={FiDollarSign} heading="Revenue Analytics" sub="Trends, daily, monthly">
            <RevenueChart orders={orders} />
          </Section>

          {/* ── Orders ── */}
          <Section id="orders" icon={FiShoppingBag} heading="Order Analytics" sub="Status, timeline, completion">
            <OrdersChart orders={orders} />
          </Section>

          {/* ── Food ── */}
          <Section id="food" icon={FiStar} heading="Food Analytics" sub="Top sellers & revenue per dish">
            <FoodAnalytics orders={orders} />
          </Section>

          {/* ── Payment ── */}
          <Section id="payment" icon={FiCreditCard} heading="Payment Analytics" sub="Online vs COD breakdown">
            <PaymentAnalytics orders={orders} />
          </Section>

          {/* ── Tables ── */}
          <Section id="tables" icon={FiGrid} heading="Table Analytics" sub="Activity & revenue per table">
            <TableAnalytics orders={orders} />
          </Section>

          {/* ── Best Sellers ── */}
          <Section id="bestsellers" icon={FiStar} heading="Best Sellers" sub="Top food items ranked">
            <BestSellers orders={orders} />
          </Section>

          {/* ── Alerts + Recent Orders (side by side on wide screens) ── */}
          <Section id="alerts" icon={FiAlertCircle} heading="Alerts Panel" sub="Anomalies & attention items">
            <AlertsPanel orders={orders} />
          </Section>

          {/* ── Recent Orders ── */}
          <Section id="recent" icon={FiList} heading="Recent Orders" sub="Search, filter, sort, paginate">
            <RecentOrdersTable orders={orders} />
          </Section>

          {/* ── Today's Report ── */}
          <Section id="today" icon={FiSun} heading="Today's Report" sub={new Date().toLocaleDateString("en-IN", { dateStyle: "full" })}>
            <motion.div
              className="today-banner"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              {[
                { label: "Today's Revenue",         val: formatCurrency(today.todayRevenue) },
                { label: "Today's Orders",           val: today.todayOrders                 },
                { label: "Today's Pending",          val: today.todayPending                },
                { label: "Today's Delivered",        val: today.todayDelivered              },
              ].map((c) => (
                <div key={c.label} className="today-card">
                  <div className="today-card-label">{c.label}</div>
                  <div className="today-card-val">{c.val}</div>
                </div>
              ))}
            </motion.div>
          </Section>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;
