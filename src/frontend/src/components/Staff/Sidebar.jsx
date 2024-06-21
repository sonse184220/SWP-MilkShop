import React from "react";
import { FaHome, FaSearch } from "react-icons/fa";
import "./Sidebar.css";
function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-1">
        <h1>Staff</h1>
        <div className="settings">
          <button className="home-button">
            <FaHome /> Home
          </button>
          <button className="browse-button">
            <FaSearch /> Browse
          </button>
        </div>
      </div>
      <div className="sidebar-2">
        <button className="create-voucher">Create Voucher</button>
      </div>
    </div>
  );
}

export default Sidebar;
