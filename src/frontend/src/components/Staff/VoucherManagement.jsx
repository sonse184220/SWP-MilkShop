// src/OrderManagement.js

import React, { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import "./VoucherManagement.css";
import Modal from "react-modal";

const VoucherManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [vouchers, setVouchers] = useState([
    {
      VoucherID: 1,
      Discount: "10%",
      Quantity: 100,
      Expiration: "2023-12-31",
      Content: "10% off on all products",
    },
    {
      VoucherID: 2,
      Discount: "20%",
      Quantity: 50,
      Expiration: "2024-01-15",
      Content: "20% off on orders over $50",
    },
    {
      VoucherID: 3,
      Discount: "15%",
      Quantity: 200,
      Expiration: "2024-06-30",
      Content: "15% off on selected items",
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
          <h1>Voucher Management</h1>
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
            <label>Search Voucher:</label>
            <input type="text" placeholder="Search" className="search-input" />
            <button className="searchProduct">Search</button>
            <button className="addOrder" onClick={() => setIsAddOpen(true)}>
              Add Voucher
            </button>
          </div>

          <table className="issues-table">
            <thead>
              <tr>
                <th>VoucherID</th>
                <th>Discount</th>
                <th>Quantity</th>
                <th>Expiration</th>
                <th>Content</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((voucher) => (
                <tr key={voucher.VoucherID}>
                  <td>{voucher.VoucherID}</td>
                  <td>{voucher.Discount}</td>
                  <td>{voucher.Quantity}</td>
                  <td>{voucher.Expiration}</td>
                  <td>{voucher.Content}</td>
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
                        <a href="#" onClick={() => setIsOpen(true)}>
                          Update
                        </a>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            className="custom-modal-voucher"
            overlayClassName="custom-overlay-voucher"
          >
            <h2>Update Voucher</h2>
            <label htmlFor="">Voucher Discount: </label>
            <input placeholder="Enter new voucher name" /> <br />
            <label htmlFor="">Voucher Quantity: </label>{" "}
            <input placeholder="Enter new voucher quantity" /> <br />
            <label htmlFor="">Voucher Content: </label>{" "}
            <input placeholder="Enter new voucher content" /> <br />
            <br />
            <div className="modal-actions-voucher">
              <button
                onClick={"handleMemberOrderAction"}
                className="btn-confirm-voucher"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-cancel-voucher"
              >
                Cancel
              </button>
            </div>
          </Modal>

          <Modal
            isOpen={isAddOpen}
            onRequestClose={() => setIsAddOpen(false)}
            className="custom-modal-product"
            overlayClassName="custom-overlay-product"
          >
            <h2>Add Voucher</h2>
            <label>Voucher ID: </label>
            <input name="voucherName" placeholder="Enter voucher id" />
            <br />
            <label>Voucher discount: </label>
            <input name="voucherName" placeholder="Enter voucher discount" />
            <br />
            <label>Voucher quantity: </label>
            <input name="quantity" placeholder="Enter voucher quantity" />
            <br />
            <label>Voucher expiration date: </label>
            <input
              name="date"
              placeholder="Enter voucher expiration date"
              type="date"
            />
            <br />
            <label>Voucher content: </label>
            <input name="content" placeholder="Enter voucher content" />
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

export default VoucherManagement;
