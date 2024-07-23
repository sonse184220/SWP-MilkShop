import React, { useState, useRef, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./ReportManagement.css"; // Import CSS file
import Sidebar from "./Sidebar";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { GetAllReport } from "../../services/staff/report/getAllReport";
import { GetReportDetail } from "../../services/staff/report/getReportDetail";
import { UpdateReport } from "../../services/staff/report/updateReport";
import { Logout } from "../../services/login/logout";

const ReportManagement = () => {
  const navigate = useNavigate();

  const StaffToken = "Bearer " + sessionStorage.getItem("token");
  console.log("Retrieved Staff Token:", StaffToken); // Debugging line

  const staffData = sessionStorage.getItem("staffData");

  const staffName = staffData ? JSON.parse(staffData).Name : "";

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const dropdownRef = useRef(null);
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const [currentReport, setCurrentReport] = useState(null);
  const [updateReport, setUpdateReport] = useState({
    response: "",
  });

  const toggleDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle("dropdown-menu");
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    const token = "Bearer " + sessionStorage.getItem("token");
    await Logout(token);
    sessionStorage.clear();
    navigate("/Customer/home");
    window.location.reload();
  };

  const handleGetAllReport = async () => {
    try {
      let limit = 5; // Adjust this value as needed
      let page = currentPage;
      let sort = "";
      let status = "";
      const response = await GetAllReport(
        StaffToken,
        limit,
        page,
        sort,
        status
      );
      if (response.data.total > 0) {
        setReports(response.data.data);
        setPageCount(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch reports. Please try again!", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  const handleViewReportDetail = async (reportId) => {
    try {
      const response = await GetReportDetail(StaffToken, reportId);
      if (response.data.length > 0) {
        setCurrentReport(response.data[0]);
        setIsAddOpen(true);
      }
    } catch (error) { }
  };

  const handleOpenResponseModal = async (reportId) => {
    const response = await GetReportDetail(StaffToken, reportId);
    if (response.data.length > 0) {
      setCurrentReport(response.data[0]);
      setIsUpdateOpen(true);
    }
  };

  const handleSendResponse = async () => {
    try {
      console.log("worked");
      const response = await UpdateReport(
        StaffToken,
        currentReport.ReportID,
        updateReport
      );
      if (response.data.length > 0) {
        setIsUpdateOpen(false);
        setUpdateReport({
          response: "",
        });
        handleGetAllReport();
        toast.success("Report response updated", {
          duration: 3000,
          position: "top-right",
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      toast.error(error.response.data.error, {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateReport((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  useEffect(() => {
    handleGetAllReport();
  }, [currentPage]);

  return (
    <div className="report-management">
      <ToastContainer />
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
                  <a href="#" onClick={handleLogout}>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </header>
        </div>

        <div className="table-container">
          {reports.length > 0 ? (
            <table className="issues-table">
              <thead>
                <tr>
                  <th>ReportID</th>
                  <th>User</th>
                  <th>Staff</th>
                  <th>Detail</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th></th>
                  {/* <th></th> */}
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.ReportID}>
                    <td>{report.ReportID}</td>
                    <td>
                      {report.UserID} - {report.userName}
                    </td>
                    <td>
                      {report.StaffID} - {report.staffName}
                    </td>
                    <td>
                      <button
                        onClick={() => handleViewReportDetail(report.ReportID)}
                      >
                        View report details
                      </button>
                    </td>
                    <td>{formatDate(report.created)}</td>
                    <td>{formatDate(report.updated)}</td>
                    <td>
                      <div className="action">
                        <button
                          onClick={() =>
                            handleOpenResponseModal(report.ReportID)
                          }
                          className="btn-confirm"
                          style={{
                            padding: "10px",
                          }}
                        >
                          Response
                        </button>
                      </div>
                    </td>
                    {/* <td>
                      <div className="action">
                        <button
                          onClick={"() => handleDisable(user.UserID)"}
                          className="btn-confirm"
                        style={{ backgroundColor: 'red' }}
                        >
                          Solve
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No reports available</p>
          )}
          <div>
            <ReactPaginate
              breakLabel="..."
              nextLabel="Next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="< Previous"
              renderOnZeroPageCount={null}
              containerClassName="pagination justify-content-center"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              activeClassName="active"
            />
          </div>
          {currentReport && (
            <>
              <Modal
                isOpen={isAddOpen}
                onRequestClose={() => {
                  setIsAddOpen(false);
                  setCurrentReport(null);
                }}
                className="custom-modal-blog"
                overlayClassName="custom-overlay-blog"
              >
                <>
                  <h2>Report Detail</h2>
                  <label>Report ID </label>
                  <input
                    className="form-control"
                    value={currentReport.ReportID}
                    readOnly
                  />
                  <label>Title </label>
                  <input
                    className="form-control"
                    value={currentReport.Title}
                    readOnly
                  />
                  <label>Content </label>
                  <textarea
                    className="form-control"
                    value={currentReport.Content}
                    readOnly
                    style={{ height: "110px" }}
                  />
                </>
              </Modal>
              <Modal
                isOpen={isUpdateOpen}
                onRequestClose={() => {
                  setIsUpdateOpen(false);
                  setCurrentReport(null);
                }}
                className="custom-modal-blog"
                overlayClassName="custom-overlay-blog"
              >
                <>
                  <h2>Send Response</h2>
                  <label>Report ID</label>
                  <input
                    className="form-control"
                    value={currentReport.ReportID}
                    readOnly
                  />
                  <label>Response</label>
                  <textarea
                    className="form-control"
                    name="response"
                    value={updateReport.response}
                    onChange={handleInputChange}
                    style={{ height: "110px" }}
                  />
                  <button onClick={handleSendResponse} className="btn-confirm">
                    Send Response
                  </button>
                </>
              </Modal>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportManagement;
