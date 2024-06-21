import React from "react";
import "./Table.css";

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
  return (
    <div className="table-container">
      <div className="table-actions">
        <label>Search Product:</label>
        <input type="text" placeholder="Search" className="search-input" />
        <button className="searchProduct">Search</button>
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
              <td>{item.voucher}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
