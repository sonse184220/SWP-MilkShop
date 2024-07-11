import React, { useState, useRef } from "react";
import "./ReportManagement.css"; // Import CSS file
import Sidebar from "./Sidebar";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

const ReportManagement = () => {
  const navigate = useNavigate();

  const StaffToken = "Bearer " + sessionStorage.getItem("token");
  console.log("Retrieved Staff Token:", StaffToken); // Debugging line

  const staffData = sessionStorage.getItem("staffData");

  const staffName = staffData ? JSON.parse(staffData).Name : "";

  const [isAddOpen, setIsAddOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [reports, setReports] = useState([
    {
      ReportID: 1,
      ReportName: "First Report",
      CreatedDate: "2024-01-01",
      Content: "This is the content of the first report.",
      created: "2024-01-01",
      updated: "2024-01-02",
    },
    {
      ReportID: 2,
      ReportName: "Second Report",
      CreatedDate: "2024-02-01",
      Content: "This is the content of the second report.",
      created: "2024-02-01",
      updated: "2024-02-02",
    },
  ]);
  const toggleDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle("dropdown-menu");
    }
  };

  const handleLogout = () => {
    // event.preventDefault();
    sessionStorage.clear();
    navigate("/Customer/home");
    window.location.reload();
  };
  return (
    <div className="report-management">
      <Sidebar />
      <div className="report-management__content">
        <div className="report-management__header">
          <h1>Report Management</h1>
          <header>
            <button className="staff-name" onClick={toggleDropdown}>
              {staffName}
            </button>
            <div ref={dropdownRef} className="dropdown-menu">
              <ul className="dropdown">
                <li>
                  <a href="/Staff/StaffProfile">Profile</a>
                </li>
                <li>
                  <a href="#" onClick={handleLogout}>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </header>
        </div>

        <div className="table-container">
          <div className="table-actions">
            <label>Search Report:</label>
            <input type="text" placeholder="Search" className="search-input" />
            <button className="searchProduct">Search</button>
          </div>
          <table className="issues-table">
            <thead>
              <tr>
                <th>ReportID</th>
                <th>ReportName</th>
                <th>CreatedDate</th>
                <th>Content</th>
                <th>Created</th>
                <th>Updated</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.ReportID}>
                  <td>{report.ReportID}</td>
                  <td>{report.ReportName}</td>
                  <td>{report.CreatedDate}</td>
                  <td>{report.Content}</td>
                  <td>{report.created}</td>
                  <td>{report.updated}</td>
                  <td>
                    <div className="select1">
                      <select id="statusDropdown">
                        <option value="Waiting">Waiting</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Shipping">Shipping</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <div className="select1">
                      <select id="statusDropdown">
                        <option value="Pending">Pending</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <button
                onClick={"handleAddProduct"}
                className="btn-confirm-product"
              >
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
      </div>
    </div>
  );
};

export default ReportManagement;
