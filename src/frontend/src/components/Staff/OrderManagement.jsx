import React, { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import "./OrderManagement.css";

import Modal from "react-modal";

const OrderManagement = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);
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
  const toggleDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle("dropdown-menu");
    }
  };
  return (
    <div className="order-management-container">
      <Sidebar />
      <div className="content">
        <div className="content-header">
          <h1>Order Management</h1>
          <header>
            <button className="staff-name" onClick={toggleDropdown}>
              Staff Name
            </button>
            <div ref={dropdownRef} className="dropdown-menu">
              <ul className="dropdown">
                <li>
                  <a href="#">Profile</a>
                </li>
                <li>
                  <a href="#">Logout</a>
                </li>
              </ul>
            </div>
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
            <h2>Add Order</h2>
            <label>Order ID: </label>
            <input name="ordertName" placeholder="Enter order id" />
            <br />
            <label>Order name: </label>
            <input name="orderName" placeholder="Enter order name" />
            <br />
            <label>Order quantity: </label>
            <input name="quantity" placeholder="Enter order quantity" />
            <br />
            <label>Order price: </label>
            <input name="price" placeholder="Enter order price" />
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
