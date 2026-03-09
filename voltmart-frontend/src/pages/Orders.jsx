import { useEffect, useState } from "react";
import { ordersApi } from "../api/api";
import "../styles/orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await ordersApi.list();

      setOrders(response.data);
    } catch (error) {
      console.error("Failed to load orders", error);
    }
  };

  return (
    <div className="ordersPage">
      <h1>Orders</h1>
      <p>Track all orders generated from the POS.</p>

      <div className="ordersTableContainer">
        <h2>All Orders</h2>

        <table className="ordersTable">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Phone</th>
              <th>Total Amount</th>
              <th>Order Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5">No records found</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>

                  <td>{order.customerPhone}</td>

                  <td>₹{order.totalAmount}</td>

                  <td>
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleString()
                      : "-"}
                  </td>

                  <td>Completed</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
