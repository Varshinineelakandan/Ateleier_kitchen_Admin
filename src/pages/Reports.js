import { useEffect, useState } from "react";
import axios from "axios";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

import "../styles/Reports.css";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#fff",
        border: "1.5px solid #EAD7C5",
        borderRadius: 14,
        padding: "10px 16px",
        boxShadow: "0 8px 28px rgba(44,26,14,0.14)",
      }}>
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "#9E7455", marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 18, fontWeight: 900, color: "#2C1A0E", letterSpacing: -0.5 }}>₹{payload[0].value.toLocaleString("en-IN")}</p>
      </div>
    );
  }
  return null;
};

export default function Reports() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ── TOTALS ───────────────────────────────────────────
  const totalOrders   = orders.length;
  const totalRevenue  = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const deliveredOrders = orders.filter(o => o.status === "Delivered").length;
  const pendingOrders   = orders.filter(o => o.status !== "Delivered").length;

  const onlineTotal = orders
    .filter(o => o.paymentMethod === "Online")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const codTotal = orders
    .filter(o => o.paymentMethod === "COD")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  // ── TABLE SALES ──────────────────────────────────────
  const tableSalesMap = {};
  orders.forEach((order) => {
    if (!tableSalesMap[order.tableNumber]) tableSalesMap[order.tableNumber] = 0;
    tableSalesMap[order.tableNumber] += order.totalAmount;
  });

  const tableSalesData = Object.keys(tableSalesMap)
    .sort((a, b) => Number(a) - Number(b))
    .map((table) => ({
      table: `T${table}`,
      amount: tableSalesMap[table],
    }));

  const maxTableSale = Math.max(...tableSalesData.map(d => d.amount), 1);

  // ── TOP ITEMS ────────────────────────────────────────
  const itemMap = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!itemMap[item.food_name]) itemMap[item.food_name] = 0;
      itemMap[item.food_name] += item.qty;
    });
  });

  const topItems = Object.keys(itemMap)
    .map((item) => ({ item, qty: itemMap[item] }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const maxQty = topItems[0]?.qty || 1;

  const rankClasses = ["rank-1", "rank-2", "rank-3", "rank-4", "rank-5"];

  const now = new Date();
  const datePill = now.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="reports-page">

      {/* ── HEADER ─────────────────────────────────── */}
      <div className="reports-header">
        <div className="reports-header-left">
          <span className="reports-eyebrow">Restaurant Analytics</span>
          <h1 className="reports-title">Reports</h1>
        </div>
        <span className="reports-date-pill">{datePill}</span>
      </div>

      {/* ── STAT CARDS ─────────────────────────────── */}
      <div className="report-cards">

        <div className="report-card revenue-card" data-watermark="₹">
          <h3>Total Revenue</h3>
          <h2>₹{totalRevenue.toLocaleString("en-IN")}</h2>
          <p className="card-trend">All time earnings</p>
        </div>

        <div className="report-card order-card" data-watermark="#">
          <h3>Total Orders</h3>
          <h2>{totalOrders}</h2>
          <p className="card-trend">All time orders</p>
        </div>

        <div className="report-card delivered-card" data-watermark="✓">
          <h3>Delivered</h3>
          <h2>{deliveredOrders}</h2>
          <p className="card-trend">
            {totalOrders ? Math.round((deliveredOrders / totalOrders) * 100) : 0}% success rate
          </p>
        </div>

        <div className="report-card pending-card" data-watermark="!">
          <h3>Pending</h3>
          <h2>{pendingOrders}</h2>
          <p className="card-trend">In progress</p>
        </div>

      </div>

      {/* ── PAYMENT SUMMARY ────────────────────────── */}
      <div className="chart-box">
        <h2>Payment Summary</h2>
        <div className="payment-summary">

          <div className="payment-card online-payment">
            <h3>Online Payments</h3>
            <h1>₹{onlineTotal.toLocaleString("en-IN")}</h1>
            <span className="pay-badge">UPI · Card</span>
          </div>

          <div className="payment-card cod-payment">
            <h3>Cash on Delivery</h3>
            <h1>₹{codTotal.toLocaleString("en-IN")}</h1>
            <span className="pay-badge">COD</span>
          </div>

        </div>
      </div>

      {/* ── BAR CHART ──────────────────────────────── */}
      <div className="chart-box">
        <h2>Table-wise Sales</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={tableSalesData}
            barCategoryGap="35%"
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="table"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fontWeight: 700, fill: "#9E7455" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fontWeight: 700, fill: "#9E7455" }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(179,92,30,0.06)" }} />
            <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
              {tableSalesData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.amount === maxTableSale ? "#B35C1E" : "#EAD7C5"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── TOP SELLING ────────────────────────────── */}
      <div className="top-items-box">
        <h2>Top Selling Dishes</h2>

        <table className="top-items-table">
          <thead>
            <tr>
              <th>Dish</th>
              <th style={{ textAlign: "right" }}>Qty Sold</th>
            </tr>
          </thead>
          <tbody>
            {topItems.map((item, index) => (
              <tr key={index}>
                <td>
                  <div className="dish-cell">
                    <span className={`rank-badge ${rankClasses[index]}`}>
                      {index + 1}
                    </span>
                    {item.item}
                  </div>
                </td>
                <td className="qty-cell">
                  <div className="qty-number">{item.qty}</div>
                  <div className="qty-bar">
                    <div
                      className="qty-fill"
                      style={{ width: `${Math.round((item.qty / maxQty) * 100)}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}