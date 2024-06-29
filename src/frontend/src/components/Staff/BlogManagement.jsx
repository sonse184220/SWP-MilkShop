import React, { useState } from "react";
import "./BlogManagement.css"; // Import CSS file
import Sidebar from "./Sidebar";
import Modal from "react-modal";
const BlogManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
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

  return (
    <div className="blog-management-container">
      <Sidebar />
      <div className="content">
        <div className="content-header">
          <h1>Blog Management</h1>
          <header>
            <button className="staff-name">Staff Name</button>
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
                <th>CreatedDate</th>
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
                  <td>{blog.CreatedDate}</td>
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
            <label htmlFor="">Blog content: </label>{" "}
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

export default BlogManagement;
