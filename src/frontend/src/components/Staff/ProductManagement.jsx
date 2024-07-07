import React, { useEffect } from "react";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./Sidebar";
import "./ProductManagement.css";
import { useRef } from "react";
import { useState } from "react";
import Modal from "react-modal";
import handleGetAllProduct from "../../services/product/getAllProductService";
import getProductById from "../../services/product/getProductByID";
import { UpdateProduct } from "../../services/staff/product/updateProduct";
import { AddProduct } from "../../services/staff/product/addProduct";

function ProductManagement() {

  const StaffToken = 'Bearer ' + sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')).UserID : "Guest";

  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

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
  const [imagePreview, setImagePreview] = useState('');

  const dropdownRef = useRef(null);
  const toggleDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle("dropdown-menu");
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  function formatDateForDisplay(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns "YYYY-MM-DD"
  }

  // function formatDateForState(dateString) {
  //   if (!dateString) return '';
  //   const [year, month, day] = dateString.split('-');
  //   return `${day}/${month}/${year}`;
  // }


  // function formatDateISO(dateString) {
  //   const date = new Date(dateString);
  //   const day = date.getDate().toString().padStart(2, '0');
  //   const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //   const year = date.getFullYear();
  //   return `${year}/${month}/${day}`;
  // }

  // function formatDateDMY(dateString) {
  //   const date = new Date(dateString);
  //   const day = date.getDate().toString().padStart(2, '0');
  //   const month = (date.getMonth() + 1).toString().padStart(2, '0');
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // }

  const getImageSrc = (imageData) => {
    if (!imageData || !imageData.data) return '';

    try {
      const base64 = btoa(
        imageData.data.reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Error converting image data:', error);
      return '';
    }
  };

  const handleGetProducts = async () => {
    try {
      const response = await handleGetAllProduct();
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      }
    } catch (error) {

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
        setImagePreview(
          `data:image/jpeg;base64,${btoa(
            String.fromCharCode.apply(null, product.Image.data)
          )}`
        );
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

      const response = await UpdateProduct(StaffToken, updateProduct.ProductID, formData);
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
      formData.append("ProductID", newProduct.ProductID);
      formData.append("Name", newProduct.Name);
      formData.append("Price", newProduct.Price);
      formData.append("Expiration", newProduct.Expiration);
      formData.append("Quantity", newProduct.Quantity);
      formData.append("Status", newProduct.Status);
      formData.append("Content", newProduct.Content);
      formData.append("BrandID", newProduct.BrandID);

      const response = await AddProduct(StaffToken, formData);
      if (response.data.message) {
        handleGetProducts();
        setIsAddOpen(false);
        setImagePreview('');
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

  useEffect(() => {
    handleGetProducts();
  }, []);

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
                Staff Name
              </button>
              <div ref={dropdownRef} className="dropdown-menu">
                <ul className="dropdown">
                  <li>
                    <a href="/Staff/StaffProfile">Profile</a>
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
                      <img src={getImageSrc(item.Image)} alt="" />
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
                        <button className="delete-button" onClick={() => handleGetAProduct(item.ProductID)}>
                          Update
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
              className="custom-modal-product"
              overlayClassName="custom-overlay-product"
            >
              <h2>Update Product</h2>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="productId">ProductID: </label>
                  <input type="text" id="productId" value={updateProduct.ProductID} readOnly />
                  <label htmlFor="productName">Product Name: </label>
                  <input id="productName" value={updateProduct.Name} onChange={(e) => setUpdateProduct({ ...updateProduct, Name: e.target.value })} />
                  <label htmlFor="brandId">BrandID: </label>
                  <input id="brandId" value={updateProduct.BrandID} onChange={(e) => setUpdateProduct({ ...updateProduct, BrandID: e.target.value })} />
                  <label htmlFor="description">Description: </label>
                  <ReactQuill theme="snow" value={updateProduct.Content} onChange={(content) => setUpdateProduct({ ...updateProduct, Content: content })} />
                  <label htmlFor="quantity">Quantity: </label>
                  <input type="number" id="quantity" value={updateProduct.Quantity} onChange={(e) => setUpdateProduct({ ...updateProduct, Quantity: parseInt(e.target.value) })} />
                  <label htmlFor="price">Price: </label>
                  <input type="number" id="price" value={updateProduct.Price} onChange={(e) => setUpdateProduct({ ...updateProduct, Price: parseFloat(e.target.value) })} />
                  <label htmlFor="expiration">Expiration date: </label>
                  <input type="date" id="expiration" value={updateProduct.Expiration} onChange={(e) => setUpdateProduct({ ...updateProduct, Expiration: e.target.value })} />
                </div>
                <div className="col-6">
                  <div style={{ height: '50%' }}>
                    <img style={{ width: '100%', height: '100%' }} src={imagePreview} alt="product image" />
                  </div>
                  <input
                    type="file"
                    name="file"
                    style={{ border: 'none', width: '100%' }}
                    onChange={handleFileChange}
                  />

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

            {/* <Modal
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
            </Modal> */}
            <Modal
              isOpen={isAddOpen}
              onRequestClose={() => setIsAddOpen(false)}
              className="custom-modal-product"
              overlayClassName="custom-overlay-product"
            >
              <h2>Add Product</h2>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="newProductId">ProductID: </label>
                  <input type="text" id="newProductId" value={newProduct.ProductID} onChange={(e) => setNewProduct({ ...newProduct, ProductID: e.target.value })} />
                  <label htmlFor="newProductName">Product Name: </label>
                  <input id="newProductName" value={newProduct.Name} onChange={(e) => setNewProduct({ ...newProduct, Name: e.target.value })} />
                  <label htmlFor="newBrandId">BrandID: </label>
                  <input id="newBrandId" value={newProduct.BrandID} onChange={(e) => setNewProduct({ ...newProduct, BrandID: e.target.value })} />
                  <label htmlFor="newDescription">Description: </label>
                  <ReactQuill theme="snow" value={newProduct.Content} onChange={(content) => setNewProduct({ ...newProduct, Content: content })} />
                  <label htmlFor="newQuantity">Quantity: </label>
                  <input type="number" id="newQuantity" value={newProduct.Quantity} onChange={(e) => setNewProduct({ ...newProduct, Quantity: parseInt(e.target.value) })} />
                  <label htmlFor="newPrice">Price: </label>
                  <input type="number" id="newPrice" value={newProduct.Price} onChange={(e) => setNewProduct({ ...newProduct, Price: parseFloat(e.target.value) })} />
                  <label htmlFor="newExpiration">Expiration date: </label>
                  <input type="date" id="newExpiration" value={newProduct.Expiration} onChange={(e) => setNewProduct({ ...newProduct, Expiration: e.target.value })} />
                </div>
                <div className="col-6">
                  <div style={{ height: '50%' }}>
                    <img style={{ width: '100%', height: '100%' }} src={imagePreview} alt="product image" />
                  </div>
                  <input
                    type="file"
                    name="file"
                    style={{ border: 'none', width: '100%' }}
                    onChange={(e) => handleFileChange(e, true)}
                  />
                </div>
              </div>
              <div className="modal-actions-product">
                <button onClick={handleAddProduct} className="btn-confirm-product">Confirm</button>
                <button onClick={() => setIsAddOpen(false)} className="btn-cancel-product">Cancel</button>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductManagement;
