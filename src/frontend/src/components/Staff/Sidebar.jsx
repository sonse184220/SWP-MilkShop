import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(null);

  const handleClick = (index) => {
    setActiveItem(index);
  };

  return (
    <div className="sidebar">
      <h1>Staff</h1>
      <div className="sidebar-content">
        <div
          className={
            activeItem === 0 || location.pathname === "/Staff/OrderManagement"
              ? "active"
              : ""
          }
        >
          <Link to="/Staff/OrderManagement" onClick={() => handleClick(0)}>
            Order
          </Link>
        </div>
        <div
          className={
            activeItem === 1 || location.pathname === "/Staff/ProductManagement"
              ? "active"
              : ""
          }
        >
          <Link to="/Staff/ProductManagement" onClick={() => handleClick(1)}>
            Product
          </Link>
        </div>
        <div
          className={
            activeItem === 2 || location.pathname === "/Staff/BlogManagement"
              ? "active"
              : ""
          }
        >
          <Link to="/Staff/BlogManagement" onClick={() => handleClick(2)}>
            Blog
          </Link>
        </div>
        <div
          className={
            activeItem === 3 || location.pathname === "/Staff/VoucherManagement"
              ? "active"
              : ""
          }
        >
          <Link to="/Staff/VoucherManagement" onClick={() => handleClick(3)}>
            Voucher
          </Link>
        </div>
        <div
          className={
            activeItem === 4 || location.pathname === "/Staff/ReportManagement"
              ? "active"
              : ""
          }
        >
          <Link to="/Staff/ReportManagement" onClick={() => handleClick(4)}>
            Report
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
