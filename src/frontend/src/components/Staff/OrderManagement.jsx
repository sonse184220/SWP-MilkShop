import React, { useState, useRef, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { NavLink, useNavigate, Link, } from "react-router-dom";

import Sidebar from "./Sidebar";
import "./OrderManagement.css";

import Modal from "react-modal";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetAllOrders } from "../../services/staff/ordermanage/getAllOrders";
import { GetOrderDetail } from "../../services/order-history/getOrderDetail";
import { UpdateOrderStatus } from "../../services/staff/ordermanage/updateOrderStatus";
import { GetAllPreOrders } from "../../services/staff/pre-order/getAllPreOrder";
import { UpdatePreOrderStatus } from "../../services/staff/pre-order/updatePreOrderStatus";
import { UpdatePreOrderETA } from "../../services/staff/pre-order/updatePreOrderETA";
import { UpdateOrderPaymentStatus } from "../../services/staff/ordermanage/updatePaymentStatus";
import { UpdatePreOrderPaymentStatus } from "../../services/staff/pre-order/updatePOPaymentStatus";

const OrderManagement = () => {
  const navigate = useNavigate();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [POpageCount, setPOPageCount] = useState(1);
  const [POcurrentPage, setPOCurrentPage] = useState(1);

  const [isStatusChangeOpen, setIsStatusChangeOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [itemType, setItemType] = useState("");

  const [PreOrders, setPreOrders] = useState([]);
  const [Orders, setOrders] = useState([]);
  const [OrderDetail, setOrderDetail] = useState([]);
  const [OrderInfo, setOrderInfo] = useState({
    UserId: "",
    Name: "",
    Email: "",
    Phone: "",
    Address: "",
  });

  const StaffToken = "Bearer " + sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData")).UserID
    : "Guest";

  const dropdownRef = useRef(null);

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
      let sort = "";
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
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  const handlePOPageClick = (event) => {
    setPOCurrentPage(event.selected + 1);
  };

  const handleViewOrderDetail = async (orderId) => {
    try {
      const response = await GetOrderDetail(StaffToken, orderId);
      if (
        Array.isArray(response.data.detail) &&
        response.data.detail.length > 0
      ) {
        setOrderDetail(response.data.detail);
        setIsDetail(true);
      }
    } catch (error) { }
  };

  const handleGetCustomerInfo = async (orderId) => {
    try {
      const response = await GetOrderDetail(StaffToken, orderId);
      if (
        Array.isArray(response.data.detail) &&
        response.data.detail.length > 0
      ) {
        setOrderInfo({
          UserId: response.data.order.UserID
            ? response.data.order.UserID
            : "Guest",
          Name: response.data.order.Name,
          Email: response.data.order.Email,
          Phone: response.data.order.Phone,
          Address: response.data.order.Address,
        });
        setIsInfoOpen(true);
      }
    } catch (error) { }
  };

  const handleStatusChange = (id, newStatus, type) => {
    const items = type === "order" ? Orders : PreOrders;
    const item = items.find((i) =>
      type === "order" ? i.OrderID === id : i.PreorderID === id
    );
    if (item && item.Status !== newStatus) {
      setSelectedItem(item);
      setNewStatus(newStatus);
      setItemType(type);
      setIsStatusChangeOpen(true);
    }
  };

  const updateStatus = async () => {
    try {
      let response;
      if (itemType === "order") {
        response = await UpdateOrderStatus(StaffToken, selectedItem.OrderID, {
          status: newStatus,
        });
      } else {
        response = await UpdatePreOrderStatus(
          StaffToken,
          selectedItem.PreorderID,
          { status: newStatus }
        );
      }

      if (response.data[0].OrderID || response.data[0].PreorderID) {
        toast.success(
          `${itemType === "order" ? "Order" : "Pre-order"
          } status updated successfully!`,
          {
            duration: 3000,
            position: "top-right",
          }
        );
        itemType === "order" ? handleGetAllOrders() : handleGetAllPreOrders();
        setIsStatusChangeOpen(false);
        setSelectedItem(null);
        setNewStatus("");
        setItemType("");
      }
    } catch (error) {
      console.error(`Error updating ${itemType} status:`, error);
      setIsStatusChangeOpen(false);
      setSelectedItem(null);
      setNewStatus("");
      setItemType("");
      toast.error(`Failed to update ${itemType} status. Please try again.`, {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const handleGetAllPreOrders = async () => {
    try {
      let limit = 5;
      let page = POcurrentPage;
      let sort = "";
      const response = await GetAllPreOrders(StaffToken, limit, page, sort);
      if (response.data.total > 0) {
        setPreOrders(response.data.data);
        setPOPageCount(response.data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetPreOrderInfo = (preorderId) => {
    const order = PreOrders.find((o) => o.PreorderID === preorderId);
    if (order) {
      setOrderInfo({
        UserId: order.UserID,
        Name: order.Name,
        Email: order.Email,
        Phone: order.Phone,
        Address: order.Address,
      });
      setIsInfoOpen(true);
    }
  };

  const handleUpdatePreOrderETA = async (preOrderId, newETA) => {
    try {
      const ETADate = {
        "eta": formatDateForDisplay(newETA)
      }
      const response = await UpdatePreOrderETA(StaffToken, preOrderId, ETADate);
      console.log(ETADate);
      if (response.data && response.data.length > 0) {
        toast.success("Pre-order ETA updated successfully!", {
          duration: 3000,
          position: "top-right",
        });
        handleGetAllPreOrders();
      } else {
        throw new Error("Failed to update ETA");
      }
    } catch (error) {
      console.error("Error updating pre-order ETA:", error);
      toast.error("Failed to update pre-order ETA. Please try again.", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  function formatDateForDisplay(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns "YYYY-MM-DD"
  }

  const handleUpdateOrderPaymentStatus = async (orderId) => {
    try {
      const response = await UpdateOrderPaymentStatus(StaffToken, orderId);
      if (response.data[0].OrderID) {
        handleGetAllOrders();
        toast.success("Payment Status update successfully", {
          duration: 3000,
          position: "top-right",
        });
      }
    } catch (error) {

    }
  }

  const handleUpdatePreOrderPaymentStatus = async (orderId) => {
    try {
      const response = await UpdatePreOrderPaymentStatus(StaffToken, orderId);
      if (response.data[0].PreorderID) {
        handleGetAllPreOrders();
        toast.success("Payment Status update successfully", {
          duration: 3000,
          position: "top-right",
        });
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    handleGetAllOrders();
    handleGetAllPreOrders();
  }, []);

  useEffect(() => {
    handleGetAllOrders();
    handleGetAllPreOrders();
  }, [currentPage, POcurrentPage]);

  const handleLogout = () => {

    // event.preventDefault();
    sessionStorage.clear();
    navigate("/Customer/home");
    window.location.reload();
  }

  return (
    <div className="order-management-container">
      <ToastContainer style={{ top: "110px" }} />
      <Sidebar />
      <Modal
        isOpen={isStatusChangeOpen}
        onRequestClose={() => setIsStatusChangeOpen(false)}
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <h2>Confirm Change</h2>
        <p>Are you sure you want to update this order's status?</p>
        <div className="modal-actions">
          <button onClick={updateStatus} className="btn-confirm">
            Confirm
          </button>
          <button
            onClick={() => setIsStatusChangeOpen(false)}
            className="btn-cancel"
          >
            Cancel
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={isDetail}
        onRequestClose={() => setIsDetail(false)}
        className="custom-modal-history"
        overlayClassName="custom-overlay"
      >
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
          <tbody>
            {OrderDetail.map((detail) => (
              <tr>
                <td>{detail.OrderID}</td>
                <td>{detail.ProductID}</td>
                <td>{detail.Name}</td>
                <td>{detail.Price}</td>
                <td>{detail.Quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
      <Modal
        isOpen={isInfoOpen}
        onRequestClose={() => setIsInfoOpen(false)}
        className="custom-modal-history"
        overlayClassName="custom-overlay"
      >
        <div className="">
          <form>
            <h5 className="user-info-form-subtitle">Order Info</h5>
            <hr className="user-info-form-divider" />
            <div className="form-group mb-1">
              <label className="mb-1" htmlFor="firstName">
                UserId
              </label>
              <input
                className="form-control mb-1"
                id="firstName"
                type="text"
                placeholder="UserId"
                name="UserId"
                value={OrderInfo.UserId}
                readOnly
              />
            </div>
            <div className="form-group mb-1">
              <label className="mb-1" htmlFor="firstName">
                Name
              </label>
              <input
                className="form-control mb-1"
                id="firstName"
                type="text"
                placeholder="Name"
                name="Name"
                value={OrderInfo.Name}
                readOnly
              />
            </div>

            <div className="form-group mb-1">
              <label className="mb-1" htmlFor="lastName">
                Email
              </label>
              <input
                id="lastName"
                type="text"
                className="form-control mb-1"
                placeholder="Email"
                name="Email"
                value={OrderInfo.Email}
                readOnly
              />
            </div>
            <div className="form-group mb-1">
              <label className="mb-1">Phone</label>
              <input
                className="form-control mb-1"
                type="text"
                id="street1"
                placeholder="Phone Number"
                name="Phone"
                value={OrderInfo.Phone}
                readOnly
              />
            </div>

            <div className="form-group mb-1">
              <label className="mb-1" htmlFor="city">
                Address
              </label>
              <input
                type="text"
                id="city"
                className="form-control mb-1"
                placeholder="Address"
                name="Address"
                value={OrderInfo.Address}
                readOnly
              />
            </div>
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
                  <a href="" onClick={handleLogout}>Logout</a>
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
          <h2>Pre-Orders</h2>
          <div className="table-wrapper" style={{ width: '100%', overflowX: 'auto' }}>
            <table className="issues-table" style={{ width: '100%', minWidth: '1100px' }}>
              <thead>
                <tr>
                  <th>PreOrderID</th>
                  <th style={{ width: '10%' }}>Product</th>
                  <th>PreOrder Date</th>
                  <th>Update Date</th>
                  <th>Price</th>
                  <th style={{ width: '15%' }}>Estimated delivery date</th>
                  <th>Customer Info</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {PreOrders.map((order) => (
                  <tr key={order.PreorderID}>
                    <td>{order.PreorderID}</td>
                    <td style={{ width: "fit-content" }}>
                      <div className="flex-grow-1">
                        <h6 className="fs-15 mb-1">{order.ProductID}</h6>
                        <p className="mb-0 product-info">
                          <span className="info-label">Quantity:</span>
                          <span className="info-value">{order.Quantity}</span>
                        </p>
                      </div>
                    </td>
                    <td>{formatDate(order.created)}</td>
                    <td>{formatDate(order.updated)}</td>
                    <td>{order.TotalPrice}</td>
                    <td><input type="date" value={formatDateForDisplay(order.ETA)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        fontSize: '14px',
                        width: '150px',
                        cursor: 'pointer'
                      }}
                      onChange={(e) => handleUpdatePreOrderETA(order.PreorderID, e.target.value)}
                    /></td>
                    <td>
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          handleGetPreOrderInfo(order.PreorderID);
                        }}
                      >
                        View Customer Info
                      </a>
                    </td>
                    <td>{order.PaymentMethod}</td>
                    <td>
                      <div className="select1">
                        <select
                          id="statusDropdown"
                          value={order.Status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.PreorderID,
                              e.target.value,
                              "preorder"
                            )
                          }
                        >
                          <option value="Waiting">Waiting</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Shipping">Shipping</option>
                          <option value="Done">Done</option>
                        </select>
                      </div>
                    </td>

                    <td>
                      <div className="select1">
                        {order.PaymentStatus === 'Pending' ? (
                          <button
                            onClick={() => handleUpdatePreOrderPaymentStatus(order.PreorderID)}
                            className="btn-confirm"
                          >
                            Done
                          </button>
                        ) : (
                          <button
                            onClick={() => setIsStatusChangeOpen(false)}
                            className="btn-confirm"
                            disabled
                            style={{ opacity: 0.5, cursor: 'not-allowed' }}
                          >
                            Done
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <ReactPaginate
              breakLabel="..."
              nextLabel="Next >"
              onPageChange={handlePOPageClick}
              pageRangeDisplayed={5}
              pageCount={POpageCount}
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
          <h2 style={{ marginTop: "10px" }}>Orders</h2>
          <table className="issues-table">
            <thead>
              <tr>
                <th>OrderID</th>
                <th>Products</th>
                <th>Order Date</th>
                <th>Update Date</th>
                <th>Price</th>
                <th>VoucherId</th>
                <th>Customer Info</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {Orders.map((order) => (
                <tr key={order.OrderID}>
                  <td>{order.OrderID}</td>
                  <td>
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        handleViewOrderDetail(order.OrderID);
                      }}
                    >
                      View products in this order
                    </a>
                  </td>
                  <td>{formatDate(order.created)}</td>
                  <td>{formatDate(order.updated)}</td>
                  <td>{order.TotalPrice}</td>
                  <td>{order.VoucherID ? order.VoucherID : "No voucher"}</td>
                  <td>
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        handleGetCustomerInfo(order.OrderID);
                      }}
                    >
                      View Customer Info
                    </a>
                  </td>
                  <td>{order.PaymentMethod}</td>
                  <td>
                    <div className="select1">
                      <select
                        id="statusDropdown"
                        value={order.Status}
                        onChange={(e) =>
                          handleStatusChange(
                            order.OrderID,
                            e.target.value,
                            "order"
                          )
                        }
                      >
                        <option value="Waiting">Waiting</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Shipping">Shipping</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <div className="select1">
                      {/* <select id="statusDropdown">
                        <option value="Pending">Pending</option>
                        <option value="Done">Done</option>
                      </select> */}
                      {order.PaymentStatus === 'Pending' ? (
                        <button
                          onClick={() => handleUpdateOrderPaymentStatus(order.OrderID)}
                          className="btn-confirm"
                        >
                          Done
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsStatusChangeOpen(false)}
                          className="btn-confirm"
                          disabled
                          style={{ opacity: 0.5, cursor: 'not-allowed' }}
                        >
                          Done
                        </button>
                      )}
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
