import React from "react";
import Sidebar from "./Sidebar";
import Table from "./Table";
import "./ProductManagement.css";
import Footer from "../Footer/Footer";

function ProductManagement() {
  return (
    <>
      <div className="app">
        <Sidebar />
        <div className="content">
          <div className="content-header">
            <h1>Manage product</h1>
            <header>
              <button className="staff-name">Staff Name</button>
            </header>
          </div>
          <Table />
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}

export default ProductManagement;
