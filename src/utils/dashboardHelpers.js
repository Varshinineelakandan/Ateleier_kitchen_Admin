// ─── dashboardHelpers.js ───────────────────────────────────────────────────
// Pure helper functions – no hardcoded values, fully driven by API data.
// ──────────────────────────────────────────────────────────────────────────

import { format, parseISO, isToday, startOfDay } from "date-fns";

// ── Overview Stats ────────────────────────────────────────────────────────
export const getOverviewStats = (orders = []) => {
  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const activeTables = new Set(orders.map((o) => o.tableNumber)).size;
  const onlinePayments = orders.filter((o) => o.paymentMethod === "Online").length;
  const codPayments = orders.filter((o) => o.paymentMethod === "COD").length;
  const avgOrderValue = totalOrders ? +(totalRevenue / totalOrders).toFixed(2) : 0;

  return {
    totalRevenue,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    activeTables,
    onlinePayments,
    codPayments,
    avgOrderValue,
  };
};

// ── Today Stats ───────────────────────────────────────────────────────────
export const getTodayStats = (orders = []) => {
  const todayOrders = orders.filter((o) => isToday(parseISO(o.createdAt)));
  return {
    todayRevenue: todayOrders.reduce((s, o) => s + (o.totalAmount || 0), 0),
    todayOrders: todayOrders.length,
    todayPending: todayOrders.filter((o) => o.status === "Pending").length,
    todayDelivered: todayOrders.filter((o) => o.status === "Delivered").length,
  };
};

// ── Revenue Trend (per day) ───────────────────────────────────────────────
export const getRevenueTrend = (orders = []) => {
  const map = {};
  orders.forEach((o) => {
    const day = format(parseISO(o.createdAt), "MMM dd");
    map[day] = (map[day] || 0) + (o.totalAmount || 0);
  });
  return Object.entries(map)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([date, revenue]) => ({ date, revenue }));
};

// ── Daily Revenue Bar (same structure, used separately for bar chart) ─────
export const getDailyRevenue = (orders = []) => getRevenueTrend(orders);

// ── Monthly Revenue Summary ───────────────────────────────────────────────
export const getMonthlyRevenue = (orders = []) => {
  const map = {};
  orders.forEach((o) => {
    const month = format(parseISO(o.createdAt), "MMM yyyy");
    map[month] = (map[month] || 0) + (o.totalAmount || 0);
  });
  return Object.entries(map).map(([month, revenue]) => ({ month, revenue }));
};

// ── Highest / Lowest Revenue Day ─────────────────────────────────────────
export const getHighLowRevenueDay = (orders = []) => {
  const trend = getRevenueTrend(orders);
  if (!trend.length) return { highest: null, lowest: null };
  const sorted = [...trend].sort((a, b) => b.revenue - a.revenue);
  return { highest: sorted[0], lowest: sorted[sorted.length - 1] };
};

// ── Orders by Status ──────────────────────────────────────────────────────
export const getOrdersByStatus = (orders = []) => {
  const map = {};
  orders.forEach((o) => {
    map[o.status] = (map[o.status] || 0) + 1;
  });
  return Object.entries(map).map(([status, count]) => ({ status, count }));
};

// ── Completion Rate ───────────────────────────────────────────────────────
export const getCompletionRate = (orders = []) => {
  if (!orders.length) return 0;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  return +((delivered / orders.length) * 100).toFixed(1);
};

// ── Order Timeline (hourly bins for today, else daily) ────────────────────
export const getOrderTimeline = (orders = []) => {
  const map = {};
  orders.forEach((o) => {
    const key = format(parseISO(o.createdAt), "MMM dd HH:00");
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .sort()
    .map(([time, count]) => ({ time, count }));
};

// ── Food Analytics ────────────────────────────────────────────────────────
export const getFoodAnalytics = (orders = []) => {
  const foodMap = {};
  orders.forEach((o) => {
    (o.items || []).forEach((item) => {
      const name = item.food_name;
      if (!foodMap[name]) foodMap[name] = { qty: 0, revenue: 0 };
      foodMap[name].qty += item.qty || 0;
      foodMap[name].revenue += (item.amount || 0) * (item.qty || 0);
    });
  });

  const foods = Object.entries(foodMap).map(([name, data]) => ({
    name,
    qty: data.qty,
    revenue: data.revenue,
  }));

  foods.sort((a, b) => b.qty - a.qty);

  return {
    top10: foods.slice(0, 10),
    mostOrdered: foods[0] || null,
    leastOrdered: foods[foods.length - 1] || null,
  };
};

// ── Payment Analytics ─────────────────────────────────────────────────────
export const getPaymentAnalytics = (orders = []) => {
  const map = {};
  orders.forEach((o) => {
    const m = o.paymentMethod || "Unknown";
    if (!map[m]) map[m] = { count: 0, revenue: 0 };
    map[m].count += 1;
    map[m].revenue += o.totalAmount || 0;
  });
  return Object.entries(map).map(([method, data]) => ({
    method,
    count: data.count,
    revenue: data.revenue,
    percentage: orders.length ? +((data.count / orders.length) * 100).toFixed(1) : 0,
  }));
};

// ── Table Analytics ───────────────────────────────────────────────────────
export const getTableAnalytics = (orders = []) => {
  const map = {};
  orders.forEach((o) => {
    const t = o.tableNumber;
    if (!map[t]) map[t] = { orders: 0, revenue: 0 };
    map[t].orders += 1;
    map[t].revenue += o.totalAmount || 0;
  });

  const tables = Object.entries(map).map(([table, data]) => ({
    table: `Table ${table}`,
    tableNumber: +table,
    orders: data.orders,
    revenue: data.revenue,
  }));

  tables.sort((a, b) => b.revenue - a.revenue);
  return { all: tables, top5: tables.slice(0, 5) };
};

// ── Alerts ────────────────────────────────────────────────────────────────
export const getAlerts = (orders = []) => {
  const alerts = [];

  orders.forEach((o) => {
    if ((o.totalAmount || 0) > 1000) {
      alerts.push({
        type: "high-value",
        message: `High-value order ₹${o.totalAmount} on Table ${o.tableNumber}`,
        orderId: o._id,
        severity: "warning",
      });
    }
    if (!o.items || o.items.length === 0) {
      alerts.push({
        type: "empty",
        message: `Empty order detected on Table ${o.tableNumber}`,
        orderId: o._id,
        severity: "error",
      });
    }
    if (o.status === "Pending") {
      alerts.push({
        type: "pending",
        message: `Pending order on Table ${o.tableNumber}`,
        orderId: o._id,
        severity: "info",
      });
    }
  });

  return alerts;
};

// ── Format helpers ────────────────────────────────────────────────────────
export const formatCurrency = (val) =>
  `₹${Number(val).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export const formatDate = (iso) => {
  try {
    return format(parseISO(iso), "dd MMM yyyy, hh:mm a");
  } catch {
    return iso;
  }
};

export const shortId = (id = "") => `#${id.slice(-6).toUpperCase()}`;
