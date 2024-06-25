import React from "react";
import { FaHome, FaSearch } from "react-icons/fa";
import "./Sidebar.css";
function Sidebar() {
  return (
    <div className="sidebar">
      <h1>Staff</h1>
      <div className="sidebar-content">
        <div>
          <a href="#">Order</a>
        </div>
        <div>
          <a href="#">Product</a>
        </div>
        <div>
          <a href="#">Blog</a>
        </div>
        <div>
          <a href="#">Voucher</a>
        </div>
        <div>
          <a href="#">Report</a>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
