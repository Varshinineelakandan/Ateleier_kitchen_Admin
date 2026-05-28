import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Reservations.css";

// Full status flow including Pending as the starting point
const STATUS_FLOW = ["Pending", "Confirmation", "Preparing", "In Delivery", "Delivered"];

// What each status looks like in the badge
const STATUS_META = {
  Pending:       { label: "Pending",     color: "status-pending"   },
  Confirmation:  { label: "Confirmed",   color: "status-confirmed" },
  Preparing:     { label: "Preparing",   color: "status-preparing" },
  "In Delivery": { label: "In Delivery", color: "status-delivery"  },
  Delivered:     { label: "Delivered",   color: "status-done"      },
};

// Labels for the action buttons (only shown for non-Pending steps)
const ACTION_LABELS = {
  Confirmation:  "Confirm",
  Preparing:     "Prepare",
  "In Delivery": "Deliver",
  Delivered:     "Done",
};

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [updating, setUpdating]         = useState(null);

  const fetchReservations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setReservations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, { status });
      await fetchReservations();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  // Derived counts
  const total     = reservations.length;
  const pending   = reservations.filter((r) => r.status === "Pending").length;
  const active    = reservations.filter((r) =>
    ["Confirmation", "Preparing", "In Delivery"].includes(r.status)
  ).length;
  const delivered = reservations.filter((r) => r.status === "Delivered").length;

  return (
    <div className="res-page">
      {/* ── PAGE HEADER ── */}
      <div className="res-header">
        <div>
          <h1 className="res-title">Reservations</h1>
          <p className="res-sub">Manage and update all table orders</p>
        </div>
        <button className="refresh-btn" onClick={fetchReservations}>
          ↻ Refresh
        </button>
      </div>

      {/* ── STATS ── */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">{total}</span>
          <span className="stat-label">Total Orders</span>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-value">{pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card stat-active">
          <span className="stat-value">{active}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-card stat-done">
          <span className="stat-value">{delivered}</span>
          <span className="stat-label">Delivered</span>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="table-wrap">
        {loading ? (
          <div className="empty-state">Loading orders…</div>
        ) : reservations.length === 0 ? (
          <div className="empty-state">No reservations found.</div>
        ) : (
          <table className="res-table">
            <thead>
              <tr>
                <th>Table</th>
                <th>Qty</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Booked At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => {
                const meta       = STATUS_META[r.status] || STATUS_META.Pending;
                const isUpdating = updating === r._id;
                const currentIdx = STATUS_FLOW.indexOf(r.status); // 0 = Pending, 1 = Confirmation …

                // The action buttons only cover the 4 forward steps (skip "Pending" itself)
                const actionSteps = STATUS_FLOW.slice(1); // ["Confirmation","Preparing","In Delivery","Delivered"]

                return (
                  <tr key={r._id} className={isUpdating ? "row-updating" : ""}>
                    {/* TABLE NUMBER */}
                    <td>
                      <span className="table-badge">T{r.tableNumber}</span>
                    </td>

                    {/* TOTAL QUANTITY */}
                    <td className="center-cell">
                      {r.items.reduce((sum, i) => sum + i.qty, 0)}
                    </td>

                    {/* ITEMS LIST */}
                    <td>
                      <div className="items-list">
                        {r.items.map((item, idx) => (
                          <span key={idx} className="item-tag">
                            {item.food_name} × {item.qty}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* AMOUNT */}
                    <td className="amount-cell">₹{r.totalAmount}</td>

                    {/* PAYMENT */}
                    <td>
                      <span className="payment-badge">{r.paymentMethod}</span>
                    </td>

                    {/* STATUS */}
                    <td>
                      <span className={`status-badge ${meta.color}`}>
                        {meta.label}
                      </span>
                    </td>

                    {/* BOOKED AT */}
                    <td className="date-cell">
                      {new Date(r.createdAt).toLocaleString("en-IN", {
                        day: "2-digit", month: "short",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </td>

                    {/* ACTIONS
                        actionStepIdx: position of this button in the 4-button row (0–3)
                        fullIdx:       position in STATUS_FLOW (1–4)
                        A button is:
                          • next    → exactly one step ahead of current  → enabled, highlighted
                          • past    → already done (including current)   → disabled, dimmed
                          • future  → two or more steps ahead            → disabled
                    */}
                    <td>
                      <div className="action-btns">
                        {actionSteps.map((s) => {
                          const fullIdx   = STATUS_FLOW.indexOf(s); // 1–4
                          const isNext    = fullIdx === currentIdx + 1;
                          const isPast    = fullIdx <= currentIdx;
                          const isCurrent = fullIdx === currentIdx;

                          return (
                            <button
                              key={s}
                              className={[
                                "action-btn",
                                isCurrent ? "btn-current" : "",
                                isPast    ? "btn-past"    : "",
                                isNext    ? "btn-next"    : "",
                              ].join(" ").trim()}
                              disabled={isPast || isCurrent || !isNext || isUpdating}
                              onClick={() => updateStatus(r._id, s)}
                              title={s}
                            >
                              {isUpdating && isNext ? "…" : ACTION_LABELS[s]}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}