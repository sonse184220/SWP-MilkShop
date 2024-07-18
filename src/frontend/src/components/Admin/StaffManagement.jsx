import React, { useState, useRef, useEffect } from "react";
import ReactPaginate from "react-paginate";

import "./StaffManagement.css"; // Import CSS file
import Sidebar from "./SidebarAdmin";
import Modal from "react-modal";
import { GetAllAccount } from "../../services/admin/getAllAccount";
import { DisableAccount } from "../../services/admin/disableAccount";
import { EnableAccount } from "../../services/admin/enableAccount";
import { toast, ToastContainer } from "react-toastify";
import { AddStaff } from "../../services/admin/addStaff";
import { Logout } from "../../services/login/logout";
import { useNavigate } from "react-router-dom";

const StaffManagement = () => {
  const navigate = useNavigate();

  const AdminToken = "Bearer " + sessionStorage.getItem("token");

  const adminData = sessionStorage.getItem("adminData");

  const adminName = adminData ? JSON.parse(adminData).Name : "";
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isConfirm, setIsConfirm] = useState(false);
  const [action, setAction] = useState({
    type: "",
    userId: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const [staffMembers, setStaffMembers] = useState([]);

  const [newStaff, setNewStaff] = useState({
    Password: "",
    Name: "",
    Email: "",
    Phone: "",
    Address: "",
  });

  const handleGetAllAccount = async () => {
    try {
      let limit = 5;
      let page = currentPage;
      let sort = "";
      const response = await GetAllAccount(AdminToken, page, limit);
      if (response.data.totalAccounts > 0) {
        setStaffMembers(response.data.accounts.accounts);
        setPageCount(response.data.totalPages);
      }
    } catch (error) { }
  };

  useEffect(() => {
    handleGetAllAccount();
  }, []);

  useEffect(() => {
    handleGetAllAccount();
  }, [currentPage]);

  const toggleDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle("dropdown-menu");
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  const handleEnableDisable = async () => {
    try {
      const userID = {
        userId: action.userId,
      };

      if (action.type === "disable") {
        const response = await DisableAccount(AdminToken, userID);
        if (response.data.message) {
          toast.success(response.data.message, {
            duration: 3000,
            position: "top-right",
            // backgroundColor: 'red',
            // theme: "warning"
          });
          handleGetAllAccount();
          setAction({
            type: "",
            userId: "",
          });
        }
      }

      if (action.type === "enable") {
        const response = await EnableAccount(AdminToken, userID);
        console.log("check");
        if (response.data.message) {
          toast.success(response.data.message, {
            duration: 3000,
            position: "top-right",
            theme: "colored",
          });
          console.log("check");
          handleGetAllAccount();
          setAction({
            type: "",
            userId: "",
          });
        }
      }
    } catch (error) {
      console.error(`Error ${action.type}ing account:`, error);
      toast.error(`Failed to ${action.type} account. Please try again.`, {
        duration: 3000,
        position: "top-right",
        theme: "colored",
      });
    } finally {
      setIsConfirm(false);
    }
  };

  const handleOpenConfirm = async (Type, UserId) => {
    setAction({
      type: Type,
      userId: UserId,
    });
    setIsConfirm(true);
  };

  const handleAddStaff = async () => {
    try {
      const response = await AddStaff(AdminToken, newStaff);
      if (response.data.message) {
        toast.success("Staff added successfully", {
          duration: 3000,
          position: "top-right",
        });
        setIsAddOpen(false);
        setNewStaff({
          Password: "",
          Name: "",
          Email: "",
          Phone: "",
          Address: "",
        });
        handleGetAllAccount();
      }
    } catch (error) {
      toast.error(error.response.data.error[0].msg, {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const handleLogout = async () => {
    // event.preventDefault();
    const token = "Bearer " + sessionStorage.getItem("token");
    await Logout(token);
    sessionStorage.clear();
    navigate("/Customer/home");
    window.location.reload();
  };

  return (
    <div className="staff-management-container">
      <Sidebar />
      <ToastContainer />
      <Modal
        isOpen={isConfirm}
        onRequestClose={() => setIsConfirm(false)}
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <h2>Confirm Change</h2>
        <p>Are you sure you want to {action.type} this account?</p>
        <div className="modal-actions">
          <button onClick={handleEnableDisable} className="btn-confirm">
            Confirm
          </button>
          <button onClick={() => setIsConfirm(false)} className="btn-cancel">
            Cancel
          </button>
        </div>
      </Modal>
      <div className="content">
        <div className="content-header">
          <h1>User Management</h1>
          <header>
            <button className="admin-name" onClick={toggleDropdown}>
              {adminName}
            </button>
            <div ref={dropdownRef} className="dropdown-menu">
              <ul className="dropdownAdmin">
                <li>
                  <a
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </header>
        </div>

        <div className="table-container">
          <div className="table-actions">
            <label>Search Staff:</label>
            <input type="text" placeholder="Search" className="search-input" />
            <button className="searchStaff">Search</button>
            <button className="addStaff" onClick={() => setIsAddOpen(true)}>
              Add Staff
            </button>
          </div>
          <table className="staff-table">
            <thead>
              <tr>
                <th>UserID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Is Admin</th>
                <th>Is Staff</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.map((user) => (
                <tr key={user.UserID}>
                  <td>{user.UserID}</td>
                  <td>{user.Name}</td>
                  <td>{user.Email}</td>
                  <td>{user.Phone}</td>
                  <td>{user.Address}</td>
                  <td>{user.isAdmin}</td>
                  <td>{user.isStaff}</td>
                  {/* <td>{staff.updated}</td> */}
                  <td className="actionDiv">
                    <div className="action">
                      {/* <button className="action-button">
                        <a href="#" onClick={() => setIsOpen(true)}>
                          Update
                        </a>
                      </button> */}
                      {user.activeStatus === "active" ? (
                        <button
                          onClick={() =>
                            handleOpenConfirm("disable", user.UserID)
                          }
                          className="btn-confirm"
                          style={{ backgroundColor: "red" }}
                        >
                          Disable
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleOpenConfirm("enable", user.UserID)
                          }
                          className="btn-confirm"
                        // disabled
                        // style={{ opacity: 0.5, cursor: 'not-allowed' }}
                        >
                          Enable
                        </button>
                      )}
                    </div>
                  </td>
                  {/* <td className="actionDiv">
                    <div className="action">
                      <button className="action-button">
                        <a href="#">Delete</a>
                      </button>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "15px" }}>
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
          <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            className="custom-modal-staff"
            overlayClassName="custom-overlay-staff"
          >
            <h2>Update Staff</h2>
            <label htmlFor="">Staff name: </label>
            <input placeholder="Enter new staff name" /> <br />
            <label htmlFor="">Position: </label>
            <input placeholder="Enter new position" /> <br />
            <label htmlFor="">Email: </label>
            <input placeholder="Enter new email" /> <br />
            <br />
            <div className="modal-actions-staff">
              <button
                onClick={"handleUpdateStaff"}
                className="btn-confirm-staff"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-cancel-staff"
              >
                Cancel
              </button>
            </div>
          </Modal>
          <Modal
            isOpen={isAddOpen}
            onRequestClose={() => setIsAddOpen(false)}
            className="custom-modal-staff"
            overlayClassName="custom-overlay-staff"
          >
            <h2>Add Staff Account</h2>
            <label>Staff name: </label>
            <input
              value={newStaff.Name}
              onChange={(e) =>
                setNewStaff({ ...newStaff, Name: e.target.value })
              }
              placeholder="Enter staff name"
            />
            <br />
            <label>Password: </label>
            <input
              type="password"
              value={newStaff.Password}
              onChange={(e) =>
                setNewStaff({ ...newStaff, Password: e.target.value })
              }
              placeholder="Enter staff password"
            />
            <br />
            <label>Email: </label>
            <input
              type="email"
              value={newStaff.Email}
              onChange={(e) =>
                setNewStaff({ ...newStaff, Email: e.target.value })
              }
              placeholder="Enter email"
            />
            <br />
            <label>Phone: </label>
            <input
              value={newStaff.Phone}
              onChange={(e) =>
                setNewStaff({ ...newStaff, Phone: e.target.value })
              }
              placeholder="Enter phone"
            />
            <br />
            <label>Address: </label>
            <input
              value={newStaff.Address}
              onChange={(e) =>
                setNewStaff({ ...newStaff, Address: e.target.value })
              }
              placeholder="Enter address"
            />
            <br />
            <div className="modal-actions-staff">
              <button onClick={handleAddStaff} className="btn-confirm-staff">
                Confirm
              </button>
              <button
                onClick={() => setIsAddOpen(false)}
                className="btn-cancel-staff"
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

export default StaffManagement;
