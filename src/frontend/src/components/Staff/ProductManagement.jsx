import React from "react";
import Sidebar from "./Sidebar";
import "./ProductManagement.css";
import { useRef } from "react";
import { useState } from "react";
import Modal from "react-modal";

function ProductManagement() {
  const data = [
    {
      productId: "P01",
      productName: "Product 1",
      quantity: 5,
      date: "Dec 5",
      userId: "Uid1",
      voucher: "5%",
    },
    {
      productId: "P02",
      productName: "Product 2",
      quantity: 1,
      date: "Dec 5",
      userId: "Uid1",
      voucher: "none",
    },
    {
      productId: "P03",
      productName: "Product 3",
      quantity: 3,
      date: "Dec 5",
      userId: "Uid7",
      voucher: "none",
    },
    {
      productId: "P04",
      productName: "Product 4",
      quantity: 1,
      date: "Dec 5",
      userId: "Uid2",
      voucher: "none",
    },
    {
      productId: "P04",
      productName: "Product 4",
      quantity: 1,
      date: "Dec 5",
      userId: "Uid2",
      voucher: "none",
    },
    {
      productId: "P04",
      productName: "Product 4",
      quantity: 1,
      date: "Dec 5",
      userId: "Uid2",
      voucher: "none",
    },
    {
      productId: "P04",
      productName: "Product 4",
      quantity: 1,
      date: "Dec 5",
      userId: "Uid2",
      voucher: "none",
    },
    {
      productId: "P04",
      productName: "Product 4",
      quantity: 1,
      date: "Dec 5",
      userId: "Uid2",
      voucher: "none",
    },
    {
      productId: "P04",
      productName: "Product 4",
      quantity: 1,
      date: "Dec 5",
      userId: "Uid2",
      voucher: "none",
    },
  ];
  const [isOpen, setIsOpen] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);

  const dropdownRef = useRef(null);
  const toggleDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle("dropdown-menu");
    }
  };

  return (
    <>
      <div className="app">
        <Sidebar />
        <div className="content">
          <div className="content-header">
            <h1>Manage product</h1>
            <header>
              <button className="staff-name" onClick={toggleDropdown}>
                Staff Name
              </button>
              <div ref={dropdownRef} className="dropdown-menu">
                <ul className="dropdown">
                  <li>
                    <a href="/Staff/StaffProfile">Profile</a>
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
              <label>Search Product:</label>
              <input
                type="text"
                placeholder="Search"
                className="search-input"
              />
              <button className="searchProduct">Search</button>
              <button className="addOrder" onClick={() => setIsAddOpen(true)}>
                Add Product
              </button>
            </div>
            <table className="issues-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>ProductID</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>UserID</th>
                  <th>Voucher</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.productId}>
                    <td>
                      <img src="https://via.placeholder.com/100" alt="" />
                    </td>
                    <td>{item.productId}</td>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.date}</td>
                    <td>{item.userId}</td>
                    <td>{item.voucher}</td>{" "}
                    <td className="deleteDiv">
                      <div className="delete">
                        <button className="delete-button">
                          <a href="#">Delete</a>
                        </button>
                      </div>
                    </td>
                    <td className="updateDiv">
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
              className="custom-modal-product"
              overlayClassName="custom-overlay-product"
            >
              <h2>Update Product</h2>
              <label htmlFor="">Product name: </label>
              <input placeholder="Enter new product name" /> <br />
              <label htmlFor="">Product quantity: </label>{" "}
              <input placeholder="Enter new product quantity" /> <br />
              <label htmlFor="">Product date: </label>{" "}
              <input placeholder="Enter new product date" /> <br />
              <label htmlFor="">Product voucher: </label>{" "}
              <input placeholder="Enter new product voucher" />
              <br />
              <div className="modal-actions-product">
                <button
                  onClick={"handleMemberOrderAction"}
                  className="btn-confirm-product"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn-cancel-product"
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
    </>
  );
}

export default ProductManagement;
