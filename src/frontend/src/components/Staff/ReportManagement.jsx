import React, { useState } from "react";
import "./ReportManagement.css"; // Import CSS file
import Sidebar from "./Sidebar";

const ReportManagement = () => {
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

  return (
    <div className="report-management">
      <Sidebar />
      <div className="report-management__content">
        <div className="report-management__header">
          <h1>Report Management</h1>
          <button className="staff-name">Staff Name</button>
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
        </div>
      </div>
    </div>
  );
};

export default ReportManagement;
