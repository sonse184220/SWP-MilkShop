import React, { useState, useRef, useEffect } from "react";
import ReactPaginate from 'react-paginate';


import Sidebar from "./Sidebar";
import "./OrderManagement.css";

import Modal from "react-modal";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetAllOrders } from "../../services/staff/ordermanage/getAllOrders";

const OrderManagement = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);


  const [Orders, setOrders] = useState([]);

  const StaffToken = 'Bearer ' + sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')).UserID : "Guest";

  const dropdownRef = useRef(null);
  // const [orders, setOrders] = useState([
  //   {
  //     OrderDetailID: 1,
  //     OrderID: 101,
  //     ProductID: "P001",
  //     Quantity: 2,
  //     Price: 20.5,
  //   },
  //   {
  //     OrderDetailID: 2,
  //     OrderID: 102,
  //     ProductID: "P002",
  //     Quantity: 1,
  //     Price: 10.0,
  //   },
  //   {
  //     OrderDetailID: 3,
  //     OrderID: 103,
  //     ProductID: "P003",
  //     Quantity: 5,
  //     Price: 50.0,
  //   },
  // ]);

  const location = useLocation();

  useEffect(() => {
    console.log("Location changed:", location);
    console.log("Location state:", location.state);
    if (location.state && location.state.showLoginSuccess) {
      console.log("Showing login success toast");
      toast.success("Login successful!", {
        duration: 3000,
        position: "top-right",
      });
      console.log("sssssssss");
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const toggleDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle("dropdown-menu");
    }
  };

  const handleGetAllOrders = async () => {
    try {
      let limit = 5;
      let page = currentPage;
      let sort = '';
      const response = await GetAllOrders(StaffToken, limit, page, sort);
      if (response.data.total > 0) {
        setOrders(response.data.data);
        setPageCount(response.data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  useEffect(() => {
    handleGetAllOrders();
  }, []);

  useEffect(() => {
    handleGetAllOrders();
  }, [currentPage])

  return (
    <div className="order-management-container">
      <ToastContainer style={{ top: "110px" }} />
      <Sidebar />
      {/* <Modal
            isOpen={isAddOpen}
            onRequestClose={() => setIsAddOpen(false)}
            className="custom-modal-product"
            overlayClassName="custom-overlay-product"
          >
            <h2>Add Order</h2>
            <label>Order ID: </label>
            <input name="ordertName" placeholder="Enter order id" />
            <br />
            <label>Order name: </label>
            <input name="orderName" placeholder="Enter order name" />
            <br />
            <label>Order quantity: </label>
            <input name="quantity" placeholder="Enter order quantity" />
            <br />
            <label>Order price: </label>
            <input name="price" placeholder="Enter order price" />
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
        className="custom-modal-history"
        overlayClassName="custom-overlay">
        <table>
          <thead>
            <tr>
              <th scope="col">Order ID</th>
              <th scope="col">Product ID</th>
              <th scope="col">Product Name</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
            </tr>
          </thead>
          {/* <tbody>
                {OrderDetail.map((detail) => (
                  <tr>
                    <td>{detail.OrderID}</td>
                    <td>{detail.ProductID}</td>
                    <td>{detail.OrderID}</td>
                    <td>{detail.Price}</td>
                    <td>{detail.Quantity}</td>
                  </tr>
                ))}
              </tbody> */}
        </table>
      </Modal>
      <Modal
        isOpen={isInfoOpen}
        onRequestClose={() => setIsInfoOpen(false)}
        className="custom-modal-history"
        overlayClassName="custom-overlay">
        <div className=''>
          <form>
            <h5 className='user-info-form-subtitle'>Order Info</h5>
            {/* <p className='promptorder'>This info will be used for your order. Do you want to change?</p> */}
            <hr className='user-info-form-divider' />
            <div className='form-group mb-1'>
              <label className='mb-1' htmlFor='firstName'>Name</label>
              <input className='form-control mb-1' id='firstName' type='text' placeholder='Name'
                name='Name'
              // value={name}
              // onChange={handleInputChange} 
              />

            </div>
            {/* {name.length === 0 && <p className="info-error-message">*Please input name</p>} */}

            <div className='form-group mb-1'>
              <label className='mb-1' htmlFor='lastName'>Email</label>
              <input id='lastName' type='text' className='form-control mb-1' placeholder='Email'
                name='Email'
              // value={email}
              // onChange={handleInputChange} 
              />

            </div>
            {/* {email.length === 0 && <p className="info-error-message">*Please input email</p>} */}
            <div className='form-group mb-1'>
              <label className='mb-1'>Phone</label>
              <input className='form-control mb-1' type='text' id='street1' placeholder='Phone Number'
                name='Phone'
              // value={phone}
              // onChange={handleInputChange} 
              />
            </div>
            {/* {phone.length === 0 && <p className="info-error-message">*Please input phone number</p>} */}

            <div className='form-group mb-1'>
              <label className='mb-1' htmlFor='city'>Address</label>
              <input type='text' id='city' className='form-control mb-1' placeholder='Address'
                name='Address'
              // value={address}
              // onChange={handleInputChange}
              />
            </div>
            {/* {address.length === 0 && <p className="info-error-message">*Please input address</p>} */}

            <div className='form-group mb-1 rewardpoint'>
              <label className='mb-1' htmlFor='rewardPoints'>Reward Points</label>
              <div className='d-flex'>
                <input
                  type='text'
                  id='rewardPoints'
                  className='form-control mr-2'
                  placeholder='Available reward points'
                  // value={rewardPoints}
                  readOnly
                />
                <select
                  className='form-control'
                  id='useRewardPoints'
                // value={useRewardPoints ? 'yes' : 'no'}
                // onChange={handleRewardPointsChange}
                >
                  <option value='yes'>Apply all points</option>
                  <option value='no'>Don't apply</option>
                </select>
              </div>
            </div>

            {/* <button className='btn btn-primary mt-4 user-info-form-button' type='submit'>
                    <i className="fas fa-lock mr-2 user-info-form-icon"></i>Submit Payment
                </button> */}
          </form>
        </div>
      </Modal>
      <div className="content">
        <div className="content-header">
          <h1>Order Management</h1>
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
            <label>Search Order:</label>
            <input type="text" placeholder="Search" className="search-input" />
            <button className="searchOrder">Search</button>
            <button className="addOrder" onClick={() => setIsAddOpen(true)}>
              Add Order
            </button>
          </div>
          <table className="issues-table">
            <thead>
              <tr>
                <th>OrderID</th>
                <th>Products</th>
                <th>Order Date</th>
                <th>Update Date</th>
                <th>Price</th>
                <th>VoucherId</th>
                <th>CustomerInfo</th>
                <th>Status</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {Orders.map((order) => (
                <tr key={order.OrderID}>
                  <td>{order.OrderID}</td>
                  <td><a href="">View products in this order</a></td>
                  <td>{formatDate(order.created)}</td>
                  <td>{formatDate(order.updated)}</td>
                  <td>{order.TotalPrice}</td>
                  <td>{order.VoucherID ? order.VoucherID : 'No voucher'}</td>
                  <td><a href="">View Customer Info</a></td>
                  <td>
                    <div className="select1">
                      <select id="statusDropdown">
                        <option value="Waiting">Waiting</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Shipping">Shipping</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <div className="select1">
                      <select id="statusDropdown">
                        <option value="Pending">Pending</option>
                        <option value="Done">Done</option>
                      </select>
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
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
