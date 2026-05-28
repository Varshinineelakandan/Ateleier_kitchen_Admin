import { useState, useMemo } from "react";
import inventoryData from "../pages/Inventory.json";
import "../styles/Inventory.css";

const CATEGORIES = ["All", "Grains", "Meat", "Oil", "Dairy", "Vegetables", "Spices", "Beverages", "Packaging"];
const STATUSES   = ["All", "In Stock", "Low Stock", "Out of Stock"];

function getStatusClass(status) {
  if (status === "In Stock")     return "status-in-stock";
  if (status === "Low Stock")    return "status-low-stock";
  if (status === "Out of Stock") return "status-out-of-stock";
  return "";
}

export default function Inventory() {
  const [items, setItems]           = useState(inventoryData);
  const [search, setSearch]         = useState("");
  const [categoryFilter, setCategory] = useState("All");
  const [statusFilter, setStatus]   = useState("All");
  const [sortKey, setSortKey]       = useState("id");
  const [sortDir, setSortDir]       = useState("asc");

  /* ── STATS ───────────────────────────────────────── */
  const totalItems   = items.length;
  const inStock      = items.filter(i => i.status === "In Stock").length;
  const lowStock     = items.filter(i => i.status === "Low Stock").length;
  const outOfStock   = items.filter(i => i.status === "Out of Stock").length;

  const lowStockNames = items
    .filter(i => i.status === "Low Stock")
    .map(i => i.item_name)
    .join(", ");

  /* ── FILTER + SORT ───────────────────────────────── */
  const filtered = useMemo(() => {
    let list = [...items];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.item_name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)  ||
        i.supplier.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "All") {
      list = list.filter(i => i.category === categoryFilter);
    }

    if (statusFilter !== "All") {
      list = list.filter(i => i.status === statusFilter);
    }

    list.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortDir === "asc" ? -1 :  1;
      if (valA > valB) return sortDir === "asc" ?  1 : -1;
      return 0;
    });

    return list;
  }, [items, search, categoryFilter, statusFilter, sortKey, sortDir]);

  /* ── SORT HANDLER ────────────────────────────────── */
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortIcon = (key) => {
    if (sortKey !== key) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  /* ── DELETE ──────────────────────────────────────── */
  const handleDelete = (id) => {
    if (window.confirm("Remove this item from inventory?")) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  /* ── DATE FORMAT ─────────────────────────────────── */
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const today = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="inventory-page">

      {/* ── HEADER ───────────────────────────────────── */}
      <div className="inventory-header">
        <div className="inventory-header-left">
          <span className="inventory-eyebrow">Stock Management</span>
          <h1 className="inventory-title">Inventory</h1>
        </div>
        <span className="inventory-date-pill">{today}</span>
      </div>

      {/* ── STAT CARDS ───────────────────────────────── */}
      <div className="inv-stat-cards">
        <div className="inv-stat-card stat-total" data-watermark="#">
          <h3>Total Items</h3>
          <h2>{totalItems}</h2>
          <p className="stat-sub">Across all categories</p>
        </div>
        <div className="inv-stat-card stat-instock" data-watermark="✓">
          <h3>In Stock</h3>
          <h2>{inStock}</h2>
          <p className="stat-sub">{Math.round((inStock / totalItems) * 100)}% of inventory</p>
        </div>
        <div className="inv-stat-card stat-lowstock" data-watermark="!">
          <h3>Low Stock</h3>
          <h2>{lowStock}</h2>
          <p className="stat-sub">Needs restocking</p>
        </div>
        <div className="inv-stat-card stat-outstock" data-watermark="✕">
          <h3>Out of Stock</h3>
          <h2>{outOfStock}</h2>
          <p className="stat-sub">Order immediately</p>
        </div>
      </div>

      {/* ── LOW STOCK ALERT ──────────────────────────── */}
      {lowStock > 0 && (
        <div className="inv-alert-banner">
          <span className="alert-icon">⚠</span>
          <div>
            <div>{lowStock} item{lowStock > 1 ? "s are" : " is"} running low — restock soon</div>
            <div className="alert-items">{lowStockNames}</div>
          </div>
        </div>
      )}

      {/* ── CONTROLS ─────────────────────────────────── */}
      <div className="inv-controls">

        <div className="inv-search-wrap">
          <span className="inv-search-icon">⌕</span>
          <input
            className="inv-search"
            type="text"
            placeholder="Search item, category, supplier…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          className="inv-filter-select"
          value={categoryFilter}
          onChange={e => setCategory(e.target.value)}
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
          ))}
        </select>

        <select
          className="inv-filter-select"
          value={statusFilter}
          onChange={e => setStatus(e.target.value)}
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
          ))}
        </select>

        <button className="inv-add-btn">
          + Add Item
        </button>

      </div>

      {/* ── TABLE PANEL ──────────────────────────────── */}
      <div className="inv-table-box">

        <div className="inv-table-header">
          <div className="inv-table-header-left">
            <span className="inv-table-eyebrow">Stock Overview</span>
            <span className="inv-table-title">All Inventory Items</span>
          </div>
          <span className="inv-count-pill">{filtered.length} items</span>
        </div>

        {filtered.length === 0 ? (
          <div className="inv-no-results">No items match your search or filter.</div>
        ) : (
          <table className="inv-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("id")}        style={{ cursor: "pointer" }}>ID{sortIcon("id")}</th>
                <th onClick={() => handleSort("item_name")} style={{ cursor: "pointer" }}>Item{sortIcon("item_name")}</th>
                <th onClick={() => handleSort("category")}  style={{ cursor: "pointer" }}>Category{sortIcon("category")}</th>
                <th onClick={() => handleSort("quantity")}  style={{ cursor: "pointer" }}>Quantity{sortIcon("quantity")}</th>
                <th onClick={() => handleSort("supplier")}  style={{ cursor: "pointer" }}>Supplier{sortIcon("supplier")}</th>
                <th onClick={() => handleSort("status")}    style={{ cursor: "pointer" }}>Status{sortIcon("status")}</th>
                <th onClick={() => handleSort("last_updated")} style={{ cursor: "pointer" }}>Last Updated{sortIcon("last_updated")}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td><span className="inv-id">#{String(item.id).padStart(3, "0")}</span></td>
                  <td><span className="inv-item-name">{item.item_name}</span></td>
                  <td><span className="inv-category-badge">{item.category}</span></td>
                  <td>
                    <span className="inv-qty">{item.quantity}</span>
                    <span className="inv-unit">{item.unit}</span>
                  </td>
                  <td><span className="inv-supplier">{item.supplier}</span></td>
                  <td>
                    <span className={`inv-status ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td><span className="inv-date">{formatDate(item.last_updated)}</span></td>
                  <td>
                    <div className="inv-actions">
                      <button className="inv-action-btn" title="Edit">✎</button>
                      <button className="inv-action-btn delete" title="Delete" onClick={() => handleDelete(item.id)}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}