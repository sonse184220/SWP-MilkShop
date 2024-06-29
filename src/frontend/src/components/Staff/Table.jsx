import React from "react";
import "./Table.css";
import { useState } from "react";
import Modal from "react-modal";

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

function Table() {
  const [isOpen, setIsOpen] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="table-container">
      <div className="table-actions">
        <label>Search Product:</label>
        <input type="text" placeholder="Search" className="search-input" />
        <button className="searchProduct">Search</button>
        <button className="addOrder" onClick={() => setIsAddOpen(true)}>
          Add Product
        </button>
      </div>
      <table className="issues-table">
        <thead>
          <tr>
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
          <button onClick={"handleAddProduct"} className="btn-confirm-product">
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
  );
}

export default Table;
