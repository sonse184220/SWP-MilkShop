import React, { useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate, Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

import Sidebar from "./Sidebar";
import "./ProductManagement.css";
import { useRef } from "react";
import { useState } from "react";
import Modal from "react-modal";
import handleGetAllProduct from "../../services/product/getAllProductService";
import getProductById from "../../services/product/getProductByID";
import { UpdateProduct } from "../../services/staff/product/updateProduct";
import { AddProduct } from "../../services/staff/product/addProduct";
import { handleAllBrand } from "../../services/brand/getAllBrand";
import { Logout } from "../../services/login/logout";

function ProductManagement() {
  const navigate = useNavigate();

  const StaffToken = "Bearer " + sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData")).UserID
    : "Guest";

  const staffData = sessionStorage.getItem("staffData");

  const staffId = staffData ? JSON.parse(staffData).UserID : "";
  const staffName = staffData ? JSON.parse(staffData).Name : "";

  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const [brands, setBrands] = useState([]);

  const [products, setProducts] = useState([]);
  const [updateProduct, setUpdateProduct] = useState({
    ProductID: "",
    BrandID: "",
    Name: "",
    Price: 0,
    Expiration: "",
    Quantity: 0,
    Content: "",
    Status: "",
    Image: null,
  });
  const [newProduct, setNewProduct] = useState({
    ProductID: "",
    BrandID: "",
    Name: "",
    Price: 0,
    Expiration: "",
    Quantity: 0,
    Content: "",
    Status: "",
    Image: null,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const dropdownRef = useRef(null);
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

  function formatDateForDisplay(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Returns "YYYY-MM-DD"
  }

  const handleGetProducts = async () => {
    try {
      let limit = 5; // Adjust this value as needed
      let page = currentPage;
      // let sort = "";
      const response = await handleGetAllProduct(page, limit);
      if (response.data.totalProducts > 0) {
        setProducts(response.data.products);
        setPageCount(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleGetAProduct = async (pID) => {
    try {
      const response = await getProductById(pID);
      if (response.data.product) {
        const product = response.data.product;
        setUpdateProduct({
          ProductID: product.ProductID,
          BrandID: product.BrandID,
          Name: product.Name,
          Price: product.Price,
          Expiration: formatDateForDisplay(product.Expiration),
          Quantity: product.Quantity,
          Content: product.Content,
          Status: product.Status,
          // Image: product.Image,
        });
        setImagePreview(`data:image/jpeg;base64,${product.Image}`);
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleUpdateProduct = async () => {
    if (updateProduct.ProductID.length === 0) {
      console.error("ProductID is required");
      return;
    }

    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append("image", imageFile);
      }
      formData.append("Name", updateProduct.Name);
      formData.append("Price", updateProduct.Price);
      formData.append("Expiration", updateProduct.Expiration);
      formData.append("Quantity", updateProduct.Quantity);
      formData.append("Status", updateProduct.Status);
      formData.append("Content", updateProduct.Content);
      formData.append("BrandID", updateProduct.BrandID);

      const response = await UpdateProduct(
        StaffToken,
        updateProduct.ProductID,
        formData
      );
      if (response.data.message) {
        handleGetProducts();
        setIsOpen(false);
        toast.success("Product update successfully", {
          duration: 3000,
          position: "top-right",
        });
      }
      // Optionally, refresh the product list or show a success message
    } catch (error) {
      toast.error("Product update fail. Please try again!", {
        duration: 3000,
        position: "top-right",
      });
      setIsOpen(false);
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

  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append("image", imageFile);
      }
      // formData.append("ProductID", newProduct.ProductID);
      formData.append("Name", newProduct.Name);
      formData.append("Price", newProduct.Price);
      formData.append("Expiration", newProduct.Expiration);
      formData.append("Quantity", newProduct.Quantity);
      formData.append("Status", "available");
      formData.append("Content", newProduct.Content);
      formData.append("BrandID", newProduct.BrandID);
      // formData.append("Status", "out-of-stock");

      const response = await AddProduct(StaffToken, formData);
      if (response.data.message) {
        handleGetProducts();
        setIsAddOpen(false);
        setImagePreview("");
        setImageFile(null);
        setNewProduct({
          ProductID: "",
          BrandID: "",
          Name: "",
          Price: 0,
          Expiration: "",
          Quantity: 0,
          Content: "",
          Status: "",
          Image: null,
        });
        toast.success("Product added successfully", {
          duration: 3000,
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("Failed to add product. Please try again!", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const handleGetAllBrand = async () => {
    try {
      const response = await handleAllBrand();
      if (response.data.length > 0) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    handleGetProducts();
    handleGetAllBrand();
  }, []);

  useEffect(() => {
    handleGetProducts();
  }, [currentPage]);

  const handleLogout = async () => {
    // event.preventDefault();
    const token = 'Bearer ' + sessionStorage.getItem('token');
    await Logout(token);
    sessionStorage.clear();
    navigate("/Customer/home");
    window.location.reload();
  };

  return (
    <>
      <div className="app">
        <Sidebar />
        <ToastContainer style={{ top: "110px" }} />
        <div className="content">
          <div className="content-header">
            <h1>Manage product</h1>
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
              <label>Search Product:</label>
              <input
                type="text"
                placeholder="Search"
                className="search-input"
              />
              <button className="searchProduct">Search</button>
              <button className="addOrder" onClick={() => setIsAddOpen(true)}>
                Add Product
              </button>
            </div>
            <table className="issues-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>ProductID</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Created Date</th>
                  <th>Updated Date</th>
                  <th>Price</th>
                  <th>Expiration</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.ProductID}>
                    <td>
                      <img
                        src={`data:image/jpeg;base64,${item.Image}`}
                        alt={`${item.Name}`}
                      />
                    </td>
                    <td>{item.ProductID}</td>
                    <td>{item.Name}</td>
                    <td>{item.Quantity}</td>
                    <td>{formatDate(item.created)}</td>
                    <td>{formatDate(item.updated)}</td>
                    <td>{item.Price}</td>
                    <td>{formatDate(item.Expiration)}</td>
                    <td className="deleteDiv">
                      <div className="delete">
                        <button className="delete-button">
                          <a href="#">Delete</a>
                        </button>
                      </div>
                    </td>
                    <td className="updateDiv">
                      <div className="delete">
                        <button
                          className="delete-button"
                          onClick={() => handleGetAProduct(item.ProductID)}
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              overlayClassName="custom-overlay-product"
            >
              <h2>Update Product</h2>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="productId">ProductID: </label>
                  <input
                    type="text"
                    id="productId"
                    value={updateProduct.ProductID}
                    readOnly
                  />
                  <label htmlFor="productName">Product Name: </label>
                  <input
                    id="productName"
                    value={updateProduct.Name}
                    onChange={(e) =>
                      setUpdateProduct({
                        ...updateProduct,
                        Name: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="brandId">BrandID: </label>
                  {/* <input
                    id="brandId"
                    value={updateProduct.BrandID}
                    onChange={(e) =>
                      setUpdateProduct({
                        ...updateProduct,
                        BrandID: e.target.value,
                      })
                    }
                  /> */}
                  <select
                    id="brandId"
                    value={updateProduct.BrandID}
                    onChange={(e) =>
                      setUpdateProduct({
                        ...updateProduct,
                        BrandID: e.target.value,
                      })
                    }
                  >
                    <option value="">Select a brand</option>
                    {brands.map((brand) => (
                      <option key={brand.BrandID} value={brand.BrandID}>
                        {brand.Name}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="description">Description: </label>
                  <ReactQuill
                    theme="snow"
                    value={updateProduct.Content}
                    onChange={(content) =>
                      setUpdateProduct({ ...updateProduct, Content: content })
                    }
                  />
                  <label htmlFor="quantity">Quantity: </label>
                  <input
                    type="number"
                    id="quantity"
                    value={updateProduct.Quantity}
                    onChange={(e) =>
                      setUpdateProduct({
                        ...updateProduct,
                        Quantity: parseInt(e.target.value),
                      })
                    }
                  />
                  <label htmlFor="price">Price: </label>
                  <input
                    type="number"
                    id="price"
                    value={updateProduct.Price}
                    onChange={(e) =>
                      setUpdateProduct({
                        ...updateProduct,
                        Price: parseFloat(e.target.value),
                      })
                    }
                  />
                  <label htmlFor="expiration">Expiration date: </label>
                  <input
                    type="date"
                    id="expiration"
                    value={updateProduct.Expiration}
                    onChange={(e) =>
                      setUpdateProduct({
                        ...updateProduct,
                        Expiration: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-6">
                  <div style={{ height: "50%" }}>
                    <img
                      style={{ width: "100%", height: "100%" }}
                      src={imagePreview}
                      alt="product image"
                    />
                  </div>
                  <input
                    type="file"
                    name="file"
                    style={{ border: "none", width: "100%" }}
                    onChange={handleFileChange}
                  />

                  <label htmlFor="status">Status: </label>
                  <select
                    id="status"
                    value={updateProduct.Status}
                    onChange={(e) =>
                      setUpdateProduct({
                        ...updateProduct,
                        Status: e.target.value,
                      })
                    }
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions-product">
                <button
                  onClick={handleUpdateProduct}
                  className="btn-confirm-product"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn-cancel-product"
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
              <div className="row">
                <div className="col-6">
                  {/* <label htmlFor="newProductId">ProductID: </label>
                  <input
                    type="text"
                    id="newProductId"
                    value={newProduct.ProductID}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        ProductID: e.target.value,
                      })
                    }
                  /> */}
                  <label htmlFor="newProductName">Product Name: </label>
                  <input
                    id="newProductName"
                    value={newProduct.Name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, Name: e.target.value })
                    }
                  />
                  <label htmlFor="newBrandId">BrandID: </label>
                  {/* <input
                    id="newBrandId"
                    value={newProduct.BrandID}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, BrandID: e.target.value })
                    }
                  /> */}
                  <select
                    id="newBrandId"
                    value={newProduct.BrandID}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, BrandID: e.target.value })
                    }
                  >
                    <option value="">Select a brand</option>
                    {brands.map((brand) => (
                      <option key={brand.BrandID} value={brand.BrandID}>
                        {brand.Name}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="newDescription">Description: </label>
                  <ReactQuill
                    theme="snow"
                    value={newProduct.Content}
                    onChange={(content) =>
                      setNewProduct({ ...newProduct, Content: content })
                    }
                  />
                  <label htmlFor="newQuantity">Quantity: </label>
                  <input
                    type="number"
                    id="newQuantity"
                    value={newProduct.Quantity}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        Quantity: parseInt(e.target.value),
                      })
                    }
                  />
                  <label htmlFor="newPrice">Price: </label>
                  <input
                    type="number"
                    id="newPrice"
                    value={newProduct.Price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        Price: parseFloat(e.target.value),
                      })
                    }
                  />
                  <label htmlFor="newExpiration">Expiration date: </label>
                  <input
                    type="date"
                    id="newExpiration"
                    value={newProduct.Expiration}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        Expiration: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-6">
                  <div style={{ height: "50%" }}>
                    <img
                      style={{ width: "100%", height: "100%" }}
                      src={imagePreview}
                      alt="product image"
                    />
                  </div>
                  <input
                    type="file"
                    name="file"
                    style={{ border: "none", width: "100%" }}
                    onChange={(e) => handleFileChange(e, true)}
                  />
                </div>
              </div>
              <div className="modal-actions-product">
                <button
                  onClick={handleAddProduct}
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
    </>
  );
}

export default ProductManagement;
