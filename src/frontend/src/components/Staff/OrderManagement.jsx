import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./OrderManagement.css";

import Modal from "react-modal";

const OrderManagement = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
            <button className="addOrder" onClick={() => setIsAddOpen(true)}>
              Add Order
            </button>
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
                  <td>
                    <div className="select1">
                      <select id="statusDropdown">
                        <option value="Waiting">Waiting</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Shipping">Shipping</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <div className="select1">
                      <select id="statusDropdown">
                        <option value="Pending">Pending</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal
            isOpen={isAddOpen}
            onRequestClose={() => setIsAddOpen(false)}
            className="custom-modal-product"
            overlayClassName="custom-overlay-product"
          >
            <h2>Add Product</h2>
            <label>Product ID: </label>
            <input name="productName" placeholder="Enter product id" />
            <br />
            <label>Product name: </label>
            <input name="productName" placeholder="Enter product name" />
            <br />
            <label>Product quantity: </label>
            <input name="quantity" placeholder="Enter product quantity" />
            <br />
            <label>Product date: </label>
            <input name="date" placeholder="Enter product date" type="date" />
            <br />
            <label>Product voucher: </label>
            <input name="voucher" placeholder="Enter product voucher" />
            <br />
            <div className="modal-actions-product">
              <button
                onClick={"handleAddProduct"}
                className="btn-confirm-product"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsAddOpen(false)}
                className="btn-cancel-product"
              >
                Cancel
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
