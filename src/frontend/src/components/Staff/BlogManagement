
import React, { useState } from "react";
import "./BlogManagement.css"; // Import CSS file
import Sidebar from "./Sidebar";

const BlogManagement = () => {
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;
