import React, { useState, useRef } from "react";
import "./BlogManagement.css"; // Import CSS file
import Sidebar from "./Sidebar";
import Modal from "react-modal";

const BlogManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [blogs, setBlogs] = useState([
    {
      BlogID: 1,
      BlogName: "First Blog",
      CreatedDate: "2024-01-01",
      Content: "This is the content of the first blog.",
      created: "2024-01-01",
      updated: "2024-01-02",
    },
    {
      BlogID: 2,
      BlogName: "Second Blog",
      CreatedDate: "2024-02-01",
      Content: "This is the content of the second blog.",
      created: "2024-02-01",
      updated: "2024-02-02",
    },
  ]);

  const toggleDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle("dropdown-menu");
    }
  };

  return (
    <div className="blog-management-container">
      <Sidebar />
      <div className="content">
        <div className="content-header">
          <h1>Blog Management</h1>
          <header>
            <button className="staff-name" onClick={toggleDropdown}>
              Staff Name
            </button>
            <div ref={dropdownRef} className="dropdown-menu">
              <ul className="dropdown">
                <li>
                  <a href="#">Profile</a>
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
            <label>Search Blog:</label>
            <input type="text" placeholder="Search" className="search-input" />
            <button className="searchProduct">Search</button>
            <button className="addOrder" onClick={() => setIsAddOpen(true)}>
              Add Blog
            </button>
          </div>
          <table className="issues-table">
            <thead>
              <tr>
                <th>BlogID</th>
                <th>BlogName</th>
                <th>Content</th>
                <th>Created</th>
                <th>Updated</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.BlogID}>
                  <td>{blog.BlogID}</td>
                  <td>{blog.BlogName}</td>
                  <td>{blog.Content}</td>
                  <td>{blog.created}</td>
                  <td>{blog.updated}</td>
                  <td className="deleteDiv">
                    <div className="delete">
                      <button className="delete-button">
                        <a href="#">Delete</a>
                      </button>
                    </div>
                  </td>
                  <td className="deleteDiv">
                    <div className="delete">
                      <button className="delete-button">
                        <a href="#" onClick={() => setIsOpen(true)}>
                          Update
                        </a>
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
            className="custom-modal-blog"
            overlayClassName="custom-overlay-blog"
          >
            <h2>Update Blog</h2>
            <label htmlFor="">Blog name: </label>
            <input placeholder="Enter new blog name" /> <br />
            <label htmlFor="">Blog content: </label>
            <input placeholder="Enter new blog content" /> <br />
            <br />
            <div className="modal-actions-blog">
              <button
                onClick={"handleMemberOrderAction"}
                className="btn-confirm-blog"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-cancel-blog"
              >
                Cancel
              </button>
            </div>
          </Modal>
          <Modal
            isOpen={isAddOpen}
            onRequestClose={() => setIsAddOpen(false)}
            className="custom-modal-product"
            overlayClassName="custom-overlay-product"
          >
            <h2>Add Blog</h2>
            <label>Blog ID: </label>
            <input name="blogID" placeholder="Enter blog id" />
            <br />
            <label>Blog name: </label>
            <input name="blogtName" placeholder="Enter blog name" />
            <br />
            <label>Blog quantity: </label>
            <input name="content" placeholder="Enter blog content" />
            <br />
            <label>Created date: </label>
            <input
              name="createdDate"
              placeholder="Enter blog created date"
              type="date"
            />
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

export default BlogManagement;
