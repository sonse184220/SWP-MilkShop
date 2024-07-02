import React, { useState, useRef } from "react";
import "./StaffManagement.css"; // Import CSS file
import Sidebar from "./SidebarAdmin";
import Modal from "react-modal";

const StaffManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [staffMembers, setStaffMembers] = useState([
    {
      StaffID: 1,
      StaffName: "John Doe",
      JoinedDate: "2024-01-01",
      Position: "Manager",
      Email: "john.doe@example.com",
      updated: "2024-01-02",
    },
    {
      StaffID: 2,
      StaffName: "Jane Smith",
      JoinedDate: "2024-02-01",
      Position: "Assistant",
      Email: "jane.smith@example.com",
      updated: "2024-02-02",
    },
  ]);

  const toggleDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle("dropdown-menu");
    }
  };

  return (
    <div className="staff-management-container">
      <Sidebar />
      <div className="content">
        <div className="content-header">
          <h1>Staff Management</h1>
          <header>
            <button className="admin-name" onClick={toggleDropdown}>
              Admin Name
            </button>
            <div ref={dropdownRef} className="dropdown-menu">
              <ul className="dropdownAdmin">
                <li>
                  <a href="/Admin/Profile">Profile</a>
                </li>
                <li>
                  <a href="#">Logout</a>
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
                <th>StaffID</th>
                <th>StaffName</th>
                <th>Position</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Updated</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.map((staff) => (
                <tr key={staff.StaffID}>
                  <td>{staff.StaffID}</td>
                  <td>{staff.StaffName}</td>
                  <td>{staff.Position}</td>
                  <td>{staff.Email}</td>
                  <td>{staff.JoinedDate}</td>
                  <td>{staff.updated}</td>
                  <td className="actionDiv">
                    <div className="action">
                      <button className="action-button">
                        <a href="#" onClick={() => setIsOpen(true)}>
                          Update
                        </a>
                      </button>
                    </div>
                  </td>
                  <td className="actionDiv">
                    <div className="action">
                      <button className="action-button">
                        <a href="#">Delete</a>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <h2>Add Staff</h2>
            <label>Staff ID: </label>
            <input name="staffID" placeholder="Enter staff id" />
            <br />
            <label>Staff name: </label>
            <input name="staffName" placeholder="Enter staff name" />
            <br />
            <label>Position: </label>
            <input name="position" placeholder="Enter position" />
            <br />
            <label>Email: </label>
            <input name="email" placeholder="Enter email" />
            <br />
            <label>Joined date: </label>
            <input
              name="joinedDate"
              placeholder="Enter joined date"
              type="date"
            />
            <br />
            <div className="modal-actions-staff">
              <button onClick={"handleAddStaff"} className="btn-confirm-staff">
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
