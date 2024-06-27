import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./OrderManagement.css";

const OrderManagement = () => {
  const [orders, setOrders] = useState([
    {
      OrderDetailID: 1,
      OrderID: 101,
      ProductID: "P001",
      Quantity: 2,
      Price: 20.5,
    },
    {
      OrderDetailID: 2,
      OrderID: 102,
      ProductID: "P002",
      Quantity: 1,
      Price: 10.0,
    },
    {
      OrderDetailID: 3,
      OrderID: 103,
      ProductID: "P003",
      Quantity: 5,
      Price: 50.0,
    },
  ]);

  return (
    <div className="order-management-container">
      <Sidebar />
      <div className="content">
        <div className="content-header">
          <h1>Order Management</h1>
          <header>
            <button className="staff-name">Staff Name</button>
          </header>
        </div>
        <div className="table-container">
          <div className="table-actions">
            <label>Search Order:</label>
            <input type="text" placeholder="Search" className="search-input" />
            <button className="searchOrder">Search</button>
            <button className="addOrder">Add Order</button>
          </div>

          <table className="issues-table">
            <thead>
              <tr>
                <th>OrderDetailID</th>
                <th>OrderID</th>
                <th>ProductID</th>
                <th>Quantity</th>
                <th>Price</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.OrderDetailID}>
                  <td>{order.OrderDetailID}</td>
                  <td>{order.OrderID}</td>
                  <td>{order.ProductID}</td>
                  <td>{order.Quantity}</td>
                  <td>{order.Price}</td>
                  <td className="deleteDiv">
                    <div className="delete">
                      <button className="delete-button">
                        <a href="#">Delete</a>
                      </button>
                    </div>
                  </td>
                  <td className="deleteDiv">
                    <div className="delete">
                      <button className="delete-button">
                        <a href="#">Update</a>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
