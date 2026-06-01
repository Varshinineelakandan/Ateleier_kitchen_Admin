// ─── RecentOrdersTable.jsx ───────────────────────────────────────────────
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiSearch, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { formatCurrency, formatDate, shortId } from "../utils/dashboardHelpers";
import "../styles/RecentOrdersTable.css";

const PAGE_SIZE = 10;
const STATUSES = ["All", "Pending", "Delivered", "Processing", "Cancelled"];
const METHODS = ["All", "Online", "COD"];

const RecentOrdersTable = ({ orders, fetchOrders }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);


  const filtered = useMemo(() => {
    let data = [...orders];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (o) =>
          o._id.toLowerCase().includes(q) ||
          String(o.tableNumber).includes(q) ||
          (o.status || "").toLowerCase().includes(q) ||
          (o.paymentMethod || "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "All") data = data.filter((o) => o.status === statusFilter);
    if (methodFilter !== "All") data = data.filter((o) => o.paymentMethod === methodFilter);

    data.sort((a, b) => {
      let va = a[sortKey];
      let vb = b[sortKey];
      if (sortKey === "createdAt") {
        va = new Date(va); vb = new Date(vb);
      }
      if (sortKey === "tableNumber" || sortKey === "totalAmount") {
        va = +va; vb = +vb;
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [orders, search, statusFilter, methodFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { status }
      );

      if (fetchOrders) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const SortIcon = ({ col }) =>
    sortKey !== col ? null : sortDir === "asc" ? (
      <FiChevronUp style={{ marginLeft: 4, verticalAlign: "middle" }} />
    ) : (
      <FiChevronDown style={{ marginLeft: 4, verticalAlign: "middle" }} />
    );

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  return (
    <motion.div
      className="orders-table-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.22 }}
    >
      <div className="chart-header">
        <span className="chart-title">🧾 Recent Orders</span>
        <span className="chart-badge">{filtered.length} records</span>
      </div>

      {/* Toolbar */}
      <div className="ot-toolbar">
        <div className="ot-search-wrap">
          <FiSearch className="ot-search-icon" />
          <input
            className="ot-search"
            placeholder="Search by ID, table, status…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="ot-select"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          className="ot-select"
          value={methodFilter}
          onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }}
        >
          {METHODS.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="ot-scroll">
        <table className="ot-table">
          <thead>
            <tr>
              {[
                { key: "_id", label: "Order ID" },
                { key: "tableNumber", label: "Table" },
                { key: "itemsCount", label: "Items" },
                { key: "totalAmount", label: "Amount" },
                { key: "paymentMethod", label: "Payment" },
                { key: "status", label: "Status" },
                { key: "createdAt", label: "Date" },
                { key: "actions", label: "Actions" },
              ].map((col) => (
                <th key={col.key} onClick={() => handleSort(col.key)}>
                  {col.label}
                  <SortIcon col={col.key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    opacity: 0.4,
                  }}
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              pageData.map((o) => (
                <tr key={o._id}>
                  <td>
                    <span className="ot-id">{shortId(o._id)}</span>
                  </td>

                  <td>Table {o.tableNumber}</td>

                  <td>
                    {(o.items || []).length} item
                    {(o.items || []).length !== 1 ? "s" : ""}
                  </td>

                  <td>{formatCurrency(o.totalAmount)}</td>

                  <td>
                    <span className={`ot-pay ${o.paymentMethod}`}>
                      {o.paymentMethod}
                    </span>
                  </td>

                  <td>
                    <span className={`ot-status ${o.status}`}>
                      {o.status}
                    </span>
                  </td>

                  <td>{formatDate(o.createdAt)}</td>

                  <td>
                    {o.status !== "Delivered" ? (
                      <button
                        className="deliver-btn"
                        onClick={() => updateStatus(o._id, "Delivered")}
                      >
                        Deliver
                      </button>
                    ) : (
                      <span style={{ color: "#2d9e6b", fontWeight: 600 }}>
                        Delivered
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      <div className="ot-pagination">
        <span className="ot-page-info">
          Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
          {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
        </span>
        <div className="ot-page-btns">
          <button className="ot-page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
          <button className="ot-page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹</button>
          {pageNumbers.slice(Math.max(0, page - 3), page + 2).map((n) => (
            <button
              key={n}
              className={`ot-page-btn ${n === page ? "active" : ""}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button className="ot-page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
          <button className="ot-page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentOrdersTable;
