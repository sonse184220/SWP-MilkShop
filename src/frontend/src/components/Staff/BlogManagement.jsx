import React, { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

import "./BlogManagement.css"; // Import CSS file
import Sidebar from "./Sidebar";
import Modal from "react-modal";
import { fetchBlogs } from "../../services/blog/blogService";
import { AddBlog } from "../../services/staff/blog/addBlog";
import { blogDetail } from "../../services/blog/blogDetail";
import { UpdateBlog } from "../../services/staff/blog/updateBlog";
import { deleteBlog } from "../../services/staff/blog/deleteBlog";
import { Logout } from "../../services/login/logout";
import { searchBlogs } from "../../services/blog/searchBlogs";
const BlogManagement = () => {
  const navigate = useNavigate();

  const StaffToken = "Bearer " + sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("staffData")
    ? JSON.parse(sessionStorage.getItem("staffData")).UserID
    : "Guest";

  const staffData = sessionStorage.getItem("staffData");

  const staffName = staffData ? JSON.parse(staffData).Name : "";

  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({
    userId: "",
    title: "",
    content: "",
    productList: "",
  });
  const [updateBlog, setUpdateBlog] = useState({
    BlogID: "",
    userId: "",
    title: "",
    content: "",
    productList: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const toggleDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle("dropdown-menu");
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  const handleGetBlogs = async () => {
    try {
      let limit = 5;
      let page = currentPage;
      let sort = "";
      const response = await fetchBlogs(limit, page, sort);
      if (response.data.total > 0) {
        setBlogs(response.data.data);
        setPageCount(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleAddBlog = async () => {
    try {
      const formData = new FormData();
      // formData.append("userId", userId);
      formData.append("title", newBlog.title);
      formData.append("content", newBlog.content);
      formData.append("productList", newBlog.productList);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await AddBlog(StaffToken, formData);
      if (response.data.blog) {
        handleGetBlogs();
        setIsAddOpen(false);
        setNewBlog({
          userId: "",
          title: "",
          content: "",
          productList: "",
        });
        setImageFile(null);
        setImagePreview("");
        toast.success("Blog added successfully", {
          duration: 3000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error adding blog:", error);
      toast.error("Failed to add blog. Please try again!", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetABlog = async (blogId) => {
    try {
      const response = await blogDetail(blogId);
      console.log(response);
      if (response.blog) {
        const blog = response.blog;
        console.log("get a blog");
        const productIds = response.blogProducts
          ? response.blogProducts.map((product) => product.ProductID).join(", ")
          : "";
        setUpdateBlog({
          BlogID: blog.BlogID,
          userId: blog.UserID,
          title: blog.Title,
          content: blog.Content,
          productList: productIds,
        });
        setImagePreview(blog.Image);
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  const handleUpdateBlog = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("title", updateBlog.title);
      formData.append("content", updateBlog.content);
      formData.append("productList", updateBlog.productList);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await UpdateBlog(
        StaffToken,
        updateBlog.BlogID,
        formData
      );
      if (response.data.blog) {
        handleGetBlogs();
        setIsOpen(false);
        toast.success("Blog updated successfully", {
          duration: 3000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update blog. Please try again!", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    handleGetBlogs();
  }, []);

  useEffect(() => {
    handleGetBlogs();
  }, [currentPage]);

  const handleDeleteBlog = async () => {
    try {
      await deleteBlog(StaffToken, blogToDelete);
      toast.success("Blog deleted successfully", {
        duration: 3000,
        position: "top-right",
      });
      handleGetBlogs(); // Refresh the blog list
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog. Please try again!", {
        duration: 3000,
        position: "top-right",
      });
    }
    setIsDeleteModalOpen(false);
    setBlogToDelete(null);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    const token = "Bearer " + sessionStorage.getItem("token");
    await Logout(token);
    sessionStorage.clear();
    navigate("/Customer/home");
    window.location.reload();
  };

  const handleSearch = async () => {
    try {
      if (searchQuery.length === 0) {
        handleGetBlogs();

        return;
      }
      let limit = 5;
      let page = 1;
      let sort = "";
      const searchedBlogs = await searchBlogs(searchQuery, limit, page, sort);
      setBlogs(searchedBlogs.data);
      setPageCount(1);
    } catch (err) {
      console.error("Error searching blogs:", err);
    }
  };

  return (
    <div className="blog-management-container">
      <Sidebar />
      <ToastContainer style={{ top: "110px" }} />

      <div className="content">
        <div className="content-header">
          <h1>Blog Management</h1>
          <header>
            <button className="staff-name" onClick={toggleDropdown}>
              {staffName}
            </button>
            <div ref={dropdownRef} className="dropdown-menu">
              <ul className="dropdown">
                <li>
                  <a href="" onClick={handleLogout}>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </header>
        </div>

        <div className="table-container">
          <div className="table-actions">
            <div className="col-8">
              <label>Search Blog:</label>
              {/* <input type="text" placeholder="Search" className="search-input" /> */}
              <input
                type="text"
                placeholder="Search"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="searchProduct" onClick={handleSearch}>Search</button>
            </div>
            <button className="addOrder" onClick={() => setIsAddOpen(true)}>
              Add Blog
            </button>
          </div>
          {blogs.length > 0 ? (
            <table className="issues-table">
              <thead>
                <tr>
                  <th>Blog Image</th>
                  <th>BlogID</th>
                  <th>Author</th>
                  <th>BlogName</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.BlogID}>
                    <td>
                      <img
                        style={{ width: "100%" }}
                        src={`data:image/jpeg;base64,${blog.Image}`}
                        alt=""
                      />
                    </td>
                    <td>{blog.BlogID}</td>
                    <td>{blog.UserID}</td>
                    <td>{blog.Title}</td>
                    <td>{formatDate(blog.created)}</td>
                    <td>{formatDate(blog.updated)}</td>
                    <td className="deleteDiv">
                      <div className="delete">
                        <button
                          className="delete-button"
                          onClick={() => {
                            setBlogToDelete(blog.BlogID);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                    <td className="deleteDiv">
                      <div className="delete">
                        <button className="delete-button">
                          <a
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              handleGetABlog(blog.BlogID);
                            }}
                          >
                            Update
                          </a>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No blogs available</p>
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
          <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            className="custom-modal-product"
            overlayClassName="custom-overlay-blog"
          >
            <h2>Update Blog</h2>
            <div className="row">
              <div className="col-6">
                <label>Blog ID: </label>
                <input name="blogId" value={updateBlog.BlogID} readOnly />

                <label>Blog title: </label>
                <input
                  name="title"
                  value={updateBlog.title}
                  onChange={(e) =>
                    setUpdateBlog({ ...updateBlog, title: e.target.value })
                  }
                />

                <label>Blog content: </label>
                <ReactQuill
                  theme="snow"
                  value={updateBlog.content}
                  onChange={(content) =>
                    setUpdateBlog({ ...updateBlog, content: content })
                  }
                />

                <label>Product List: </label>
                <input
                  name="productList"
                  value={updateBlog.productList}
                  onChange={(e) =>
                    setUpdateBlog({
                      ...updateBlog,
                      productList: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-6">
                <div style={{ height: "50%" }}>
                  <img
                    style={{ width: "100%", height: "100%" }}
                    src={`data:image/jpeg;base64,${imagePreview}`}
                    alt="blog image"
                  />
                </div>
                <input
                  type="file"
                  name="file"
                  style={{ border: "none", width: "100%" }}
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="modal-actions-blog">
              <button onClick={handleUpdateBlog} className="btn-confirm-blog">
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
            overlayClassName="custom-overlay-blog"
          >
            <h2>Add Blog</h2>
            <div className="row">
              <div className="col-6">
                <label>Blog title: </label>
                <input
                  name="title"
                  placeholder="Enter blog title"
                  value={newBlog.title}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, title: e.target.value })
                  }
                />

                <label>Blog content: </label>
                <ReactQuill
                  theme="snow"
                  value={newBlog.content}
                  onChange={(content) =>
                    setNewBlog({ ...newBlog, content: content })
                  }
                />

                <label>Product List: </label>
                <input
                  name="productList"
                  placeholder="Enter product IDs (comma-separated)"
                  value={newBlog.productList}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, productList: e.target.value })
                  }
                />
              </div>
              <div className="col-6">
                <div style={{ height: "50%" }}>
                  <img
                    style={{ width: "100%", height: "100%" }}
                    src={imagePreview}
                    alt="blog image"
                  />
                </div>
                <input
                  type="file"
                  name="file"
                  style={{ border: "none", width: "100%" }}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="modal-actions-blog">
              <button onClick={handleAddBlog} className="btn-confirm-blog">
                Confirm
              </button>
              <button
                onClick={() => setIsAddOpen(false)}
                className="btn-cancel-blog"
              >
                Cancel
              </button>
            </div>
          </Modal>

          {/* Delete Brand Confirmation Modal */}
          <Modal
            isOpen={isDeleteModalOpen}
            onRequestClose={() => setIsDeleteModalOpen(false)}
            className="custom-modal-deletebrand"
            overlayClassName="custom-overlay-brand"
          >
            <h2>Confirm Delete</h2>
            <p>Do you want to delete this blog?</p>
            <div className="modal-actions-brand">
              <button onClick={handleDeleteBlog} className="btn-confirm-brand">
                Confirm
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn-cancel-brand"
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
