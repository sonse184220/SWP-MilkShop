import React from "react";
import Sidebar from "./Sidebar";
import Table from "./Table";
import "./ProductManagement.css";
import Footer from "../Footer/Footer";
import { useRef } from "react";

function ProductManagement() {
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
          <Table />
        </div>
      </div>
    </>
  );
}

export default ProductManagement;
