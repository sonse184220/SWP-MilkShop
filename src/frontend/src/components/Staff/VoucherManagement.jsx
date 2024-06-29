// src/OrderManagement.js

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./VoucherManagement.css";
import Modal from "react-modal";
<<<<<<< Updated upstream
const VoucherManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
=======

const VoucherManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
>>>>>>> Stashed changes
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

  return (
    <div className="order-management-container">
      <Sidebar />
      <div className="content">
        <div className="content-header">
          <h1>Voucher Management</h1>
          <header>
            <button className="staff-name">Staff Name</button>
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
<<<<<<< Updated upstream
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
=======
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  );
};

export default VoucherManagement;
