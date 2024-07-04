import React, { useState, useRef } from "react";
import "./MemberManagement.css"; // Import CSS file
import Sidebar from "./SidebarAdmin";
import Modal from "react-modal";

const MemberManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [members, setMembers] = useState([
    {
      MemberID: 1,
      MemberName: "Alice Brown",
      JoinedDate: "2024-01-01",
      Email: "alice.brown@example.com",
      updated: "2024-01-02",
    },
    {
      MemberID: 2,
      MemberName: "Bob Green",
      JoinedDate: "2024-02-01",
      Email: "bob.green@example.com",
      updated: "2024-02-02",
    },
  ]);

  const toggleDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle("dropdown-menu");
    }
  };

  return (
    <div className="member-management-container">
      <Sidebar />
      <div className="content">
        <div className="content-header">
          <h1>Member Management</h1>
          <header>
            <button className="admin-name" onClick={toggleDropdown}>
              Admin Name
            </button>
            <div ref={dropdownRef} className="dropdown-menu">
              <ul className="dropdownAdmin">
                <li>
                  <a href="/Admin/AdminProfile">Profile</a>
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
            <label>Search Member:</label>
            <input type="text" placeholder="Search" className="search-input" />
            <button className="searchMember">Search</button>
            <button className="addMember" onClick={() => setIsAddOpen(true)}>
              Add Member
            </button>
          </div>
          <table className="member-table">
            <thead>
              <tr>
                <th>MemberID</th>
                <th>MemberName</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Updated</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.MemberID}>
                  <td>{member.MemberID}</td>
                  <td>{member.MemberName}</td>
                  <td>{member.Email}</td>
                  <td>{member.JoinedDate}</td>
                  <td>{member.updated}</td>
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
            className="custom-modal-member"
            overlayClassName="custom-overlay-member"
          >
            <h2>Update Member</h2>
            <label htmlFor="">Member name: </label>
            <input placeholder="Enter new member name" /> <br />
            <label htmlFor="">Email: </label>
            <input placeholder="Enter new email" /> <br />
            <br />
            <div className="modal-actions-member">
              <button
                onClick={"handleUpdateMember"}
                className="btn-confirm-member"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-cancel-member"
              >
                Cancel
              </button>
            </div>
          </Modal>
          <Modal
            isOpen={isAddOpen}
            onRequestClose={() => setIsAddOpen(false)}
            className="custom-modal-member"
            overlayClassName="custom-overlay-member"
          >
            <h2>Add Member</h2>
            <label>Member ID: </label>
            <input name="memberID" placeholder="Enter member id" />
            <br />
            <label>Member name: </label>
            <input name="memberName" placeholder="Enter member name" />
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
            <div className="modal-actions-member">
              <button
                onClick={"handleAddMember"}
                className="btn-confirm-member"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsAddOpen(false)}
                className="btn-cancel-member"
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

export default MemberManagement;
