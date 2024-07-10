import React from "react";
import "./SidebarAdmin.css";
function SidebarAdmin() {
  return (
    <div className="sidebar">
      <h1>Admin</h1>
      <div className="sidebar-content">
        <div>
          <a href="/Admin/StaffManagement">User</a>
        </div>
        {/* <div>
          <a href="/Admin/MemberManagement">Member</a>
        </div> */}
        <div>
          <a href="/Admin/Dashboard">Dashboard</a>
        </div>
      </div>
    </div>
  );
}

export default SidebarAdmin;
