import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function Dashboard() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/orders")
      .then((res) => setOrders(res.data));
  }, []);

  const revenue = orders.reduce(
    (sum, o) => sum + o.totalAmount,
    0
  );

  const totalOrders = orders.length;

  const occupiedTables = [
    ...new Set(orders.map((o) => o.tableNumber)),
  ].length;

  const avgOrderValue = totalOrders
    ? (revenue / totalOrders).toFixed(2)
    : 0;

  // =========================
  // MONTHLY DATA (31 DAYS)
  // =========================

  const monthlyMap = {};

  for (let i = 1; i <= 31; i++) {
    monthlyMap[i] = 0;
  }

  orders.forEach((o) => {
    const day = new Date(o.createdAt).getDate();

    if (monthlyMap[day] !== undefined) {
      monthlyMap[day] += 1;
    }
  });

  const monthlyData = Object.keys(monthlyMap).map((day) => ({
    day,
    orders: monthlyMap[day],
  }));

  // =========================
  // TABLE STATUS
  // =========================

  const tableData = [
    {
      name: "Occupied",
      value: occupiedTables,
    },
    {
      name: "Free",
      value: Math.max(20 - occupiedTables, 0),
    },
  ];

  const COLORS = ["#B35C1E", "#EAD7C5"];

  // =========================
  // HIGHEST ORDER
  // =========================

  const highestOrder = orders.reduce(
    (max, o) =>
      o.totalAmount > (max.totalAmount || 0)
        ? o
        : max,
    {}
  );

  return (
    <div className="dashboard-page">

      <h1 className="dashboard-title">
        Restaurant Dashboard
      </h1>

      {/* ================= CARDS ================= */}

      <div className="cards">

        <div className="card">
          <h3>Total Revenue</h3>
          <h2>₹{revenue}</h2>
        </div>

        <div className="card">
          <h3>Total Orders</h3>
          <h2>{totalOrders}</h2>
        </div>

        <div className="card">
          <h3>Occupied Tables</h3>
          <h2>{occupiedTables}</h2>
        </div>

        <div className="card">
          <h3>Avg Order Value</h3>
          <h2>₹{avgOrderValue}</h2>
        </div>

      </div>

      {/* ================= CHARTS ================= */}

      <div className="charts">

        {/* MONTHLY BAR CHART */}

        <div className="chart-card full-chart">

          <div className="chart-header">
            <h3>Monthly Orders Analytics</h3>
            <span>Last 31 Days</span>
          </div>

          <ResponsiveContainer width="100%" height={420}>

            <BarChart
              data={monthlyData}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                tick={{
                  fill: "#666",
                  fontSize: 12,
                }}
              />

              <YAxis
                tick={{
                  fill: "#666",
                  fontSize: 12,
                }}
              />

              <Tooltip
                contentStyle={{
                  background: "#fff",
                  borderRadius: "10px",
                  border: "none",
                  boxShadow:
                    "0 5px 20px rgba(0,0,0,0.15)",
                }}
              />

              <Bar
                dataKey="orders"
                fill="#B35C1E"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* PIE CHART */}

        <div className="chart-card pie-card">

          <h3>Table Status</h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={tableData}
                dataKey="value"
                outerRadius={100}
                label
              >

                {tableData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i]}
                  />
                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ================= INSIGHTS ================= */}

      <div className="insights">

        <div className="insight-card">
          💰 Highest Order:
          ₹{highestOrder.totalAmount || 0}
        </div>

        <div className="insight-card">
          📦 Total Orders:
          {totalOrders}
        </div>

        <div className="insight-card">
          💵 Avg Order:
          ₹{avgOrderValue}
        </div>

      </div>

    </div>
  );
}