import React from "react";
import { FaHome, FaSearch } from "react-icons/fa";
import "./Sidebar.css";
function Sidebar() {
  return (
    <div className="sidebar">
      <h1>Staff</h1>
      <div className="sidebar-content">
        <div>
          <a href="/Staff/OrderManagement">Order</a>
        </div>
        <div>
          <a href="/Staff/ProductManagement">Product</a>
        </div>
        <div>
          <a href="/Staff/BlogManagement">Blog</a>
        </div>
        <div>
          <a href="/Staff/VoucherManagement">Voucher</a>
        </div>
        <div>
          <a href="/Staff/ReportManagement">Report</a>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
