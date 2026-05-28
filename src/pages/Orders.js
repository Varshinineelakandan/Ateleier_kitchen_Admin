import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const handleDeliver = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, {
        status: "Delivered",
      });

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, status: "Delivered" } : o
        )
      );
    } catch (err) {
      console.log("UPDATE ERROR:", err);
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/orders?t=${Date.now()}`)
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="page">
      <h1>Live Orders</h1>

      <div className="orders-grids">
        {orders.map((order) => (
          <div className="order-cards" key={order._id}>

            <div className="tops">
              <h3>Table {order.tableNumber}</h3>
              <span className="badges">{order.paymentMethod}</span>
            </div>

            <div className="items">
              {order.items.map((item, index) => (
                <p key={index}>
                  {item.food_name} × {item.qty}
                </p>
              ))}
            </div>

            <div className="bottom">
              <h2>₹{order.totalAmount}</h2>
              <p>{new Date(order.createdAt).toLocaleTimeString()}</p>
            </div>

            {/* Status Badge */}
            <span className={`status-badge ${order.status === "Delivered" ? "delivered" : "pending"}`}>
              {order.status === "Delivered" ? "Delivered" : " Pending"}
            </span>

            {/* Hide button once delivered */}
            {order.status !== "Delivered" && (
              <button
                type="button"
                className="remove-btn"
                onClick={() => handleDeliver(order._id)}
              >
                Mark as Delivered
              </button>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}