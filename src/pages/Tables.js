import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Tables.css";

export default function Tables() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/tables?t=${Date.now()}`)
      .then((res) => setTables(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleToggle = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/tables/${id}`);
      setTables((prev) =>
        prev.map((t) => (t._id === id ? res.data : t))
      );
    } catch (err) {
      console.log("TOGGLE ERROR:", err);
    }
  };

  const available = tables.filter((t) => t.status === "Available").length;
  const occupied = tables.filter((t) => t.status === "Occupied").length;

  return (
    <div className="page">
      <h1>Table Management</h1>

      {/* Summary */}
      <div className="table-summary">
        <div className="summary-card available-card">
          <h2>{available}</h2>
          <p>Available</p>
        </div>
        <div className="summary-card occupied-card">
          <h2>{occupied}</h2>
          <p>Occupied</p>
        </div>
        <div className="summary-card total-card">
          <h2>{tables.length}</h2>
          <p>Total Tables</p>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="tables-grid">
        {tables.map((table) => (
          <div
            className={`table-card ${table.status === "Occupied" ? "occupied" : "available"}`}
            key={table._id}
          >
            <div className="table-icon">🪑</div>
            <h3>Table {table.tableNumber}</h3>

            <span className={`table-badge ${table.status === "Available" ? "badge-available" : "badge-occupied"}`}>
              {table.status}
            </span>

            {/* Toggle Switch */}
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={table.status === "Available"}
                onChange={() => handleToggle(table._id)}
              />
              <span className="slider"></span>
            </label>

            <p className="toggle-label">
              {table.status === "Available" ? "Mark Occupied" : "Mark Available"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}