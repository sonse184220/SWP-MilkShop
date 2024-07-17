import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SidebarAdmin.css";

function SidebarAdmin() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(null);

  const handleClick = (index) => {
    setActiveItem(index);
  };

  return (
    <div className="sidebar">
      <h1>Admin</h1>
      <div className="sidebar-content">
        <div
          className={
            activeItem === 0 || location.pathname === "/Admin/UserManagement"
              ? "active"
              : ""
          }
        >
          <Link to="/Admin/UserManagement" onClick={() => handleClick(0)}>
            User
          </Link>
        </div>
        {/* <div
          className={
            activeItem === 1 || location.pathname === "/Admin/MemberManagement"
              ? "active"
              : ""
          }
        >
          <Link to="/Admin/MemberManagement" onClick={() => handleClick(1)}>
            Member
          </Link>
        </div> */}
        <div
          className={
            activeItem === 1 || location.pathname === "/Admin/Dashboard"
              ? "active"
              : ""
          }
        >
          <Link to="/Admin/Dashboard" onClick={() => handleClick(2)}>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SidebarAdmin;
