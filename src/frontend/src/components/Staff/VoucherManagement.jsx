import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./VoucherManagement.css";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate, Link, } from "react-router-dom";

import { addVoucher } from "../../services/voucher/addVoucher";
import { GetAllVouchers } from "../../services/voucher/GetAllVouchers";
import { deleteVoucher } from "../../services/voucher/deleteVoucher";
import { UpdateVoucher } from "../../services/voucher/updateVoucher";
const VoucherManagement = () => {
  const navigate = useNavigate();

  const StaffToken = "Bearer " + sessionStorage.getItem("token");
  console.log("Retrieved Staff Token:", StaffToken); // Debugging line

  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [vouchers, setVouchers] = useState([]);
  const [newVoucher, setNewVoucher] = useState({
    Discount: "",
    Quantity: "",
    Expiration: "",
    Content: "",
  });
  const [updatedVoucherInfo, setUpdatedVoucherInfo] = useState({
    Discount: "",
    Quantity: "",
    Content: "",
  });

  const [voucherID, setVoucherID] = useState("");
  const openUpdateModal = (voucher) => {
    if (voucher) {
      setUpdatedVoucherInfo({
        Discount: voucher.Discount ? voucher.Discount.toString() : "",
        Quantity: voucher.VoucherQuantity
          ? voucher.VoucherQuantity.toString()
          : "",
        Content: voucher.Content || "",
      });
      setVoucherID(voucher.VoucherID);
      setIsOpen(true);
    }
  };

  const fetchVouchers = async () => {
    try {
      const response = await GetAllVouchers(StaffToken);
      setVouchers(response.data || []);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      toast.error("Failed to fetch vouchers. Please try again!", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [StaffToken]);

  const toggleDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle("dropdown-menu");
    }
  };

  const handleAddVoucher = async () => {
    // Function to convert date from MM/DD/YYYY to YYYY-MM-DD
    const formatDate = (dateString) => {
      const [month, day, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    };

    const voucherData = {
      Discount: parseInt(newVoucher.Discount, 10), // Convert to integer
      Quantity: parseInt(newVoucher.Quantity, 10), // Convert to integer
      Expiration: formatDate(newVoucher.Expiration), // Convert to correct date format
      Content: newVoucher.Content.trim(), // Trim any whitespace
    };

    console.log("Voucher Data:", voucherData); // Debugging line

    if (
      isNaN(voucherData.Discount) ||
      isNaN(voucherData.Quantity) ||
      voucherData.Discount <= 0 ||
      voucherData.Discount > 20 ||
      voucherData.Quantity <= 1 ||
      !voucherData.Expiration ||
      !/^\d{4}-\d{2}-\d{2}$/.test(voucherData.Expiration) ||
      !voucherData.Content
    ) {
      console.error("Invalid voucher data", voucherData);
      toast.error("Invalid voucher data. Please check the inputs.", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    try {
      const response = await addVoucher(StaffToken, voucherData);
      if (response.data) {
        fetchVouchers();
        setIsAddOpen(false);
        setNewVoucher({
          Discount: "",
          Quantity: "",
          Expiration: "",
          Content: "",
        });
        toast.success("Voucher added successfully", {
          duration: 3000,
          position: "top-right",
        });
      } else {
        console.error("Failed to add voucher. Response:", response);
        toast.error("Failed to add voucher. Please try again!", {
          duration: 3000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error(
        "Error adding voucher:",
        error.response ? error.response.data : error
      );
      toast.error("Failed to add voucher. Please try again!", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const handleDeleteVoucher = async (voucherID) => {
    try {
      await deleteVoucher(StaffToken, voucherID);
      toast.success("Voucher deleted successfully", {
        duration: 3000,
        position: "top-right",
      });
      fetchVouchers(); // Fetch updated list of vouchers after deletion
    } catch (error) {
      console.error("Error deleting voucher:", error);
      toast.error("Failed to delete voucher. Please try again!", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const handleUpdateVoucher = async () => {
    try {
      const response = await UpdateVoucher(
        StaffToken,
        voucherID,
        updatedVoucherInfo
      );
      if (response.data) {
        fetchVouchers();
        setIsOpen(false);
        toast.success("Voucher updated successfully", {
          duration: 3000,
          position: "top-right",
        });
      } else {
        console.error("Failed to update voucher. Response:", response);
        toast.error("Failed to update voucher. Please try again!", {
          duration: 3000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error(
        "Error updating voucher:",
        error.response ? error.response.data : error
      );
      toast.error("Failed to update voucher. Please try again!", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const handleLogout = () => {

    // event.preventDefault();
    sessionStorage.clear();
    navigate("/Customer/home");
    window.location.reload();
  }

  return (
    <div className="order-management-container">
      <Sidebar />
      <ToastContainer />
      <div className="content">
        <div className="content-header">
          <h1>Voucher Management</h1>
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
            <label>Search Voucher:</label>
            <input type="text" placeholder="Search" className="search-input" />
            <button className="searchProduct">Search</button>
            <button className="addOrder" onClick={() => setIsAddOpen(true)}>
              Add Voucher
            </button>
          </div>

          {vouchers.length > 0 ? (
            <table className="issues-table">
              <thead>
                <tr>
                  <th>VoucherID</th>
                  <th>Discount</th>
                  <th>Quantity</th>
                  <th>Expiration</th>
                  <th>Content</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((voucher) => (
                  <tr key={voucher.VoucherID}>
                    <td>{voucher.VoucherID}</td>
                    <td>{voucher.Discount}</td>
                    <td>{voucher.VoucherQuantity}</td>
                    <td>{new Date(voucher.Expiration).toLocaleDateString()}</td>
                    <td>{voucher.Content}</td>
                    <td className="deleteDiv">
                      <div className="delete">
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteVoucher(voucher.VoucherID)}
                        >
                          <a href="#">Delete</a>
                        </button>
                      </div>
                    </td>
                    <td className="deleteDiv">
                      <div className="delete">
                        <button className="delete-button">
                          <a href="#" onClick={() => openUpdateModal(voucher)}>
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
            <p>No vouchers available</p>
          )}

          <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            className="custom-modal-voucher"
            overlayClassName="custom-overlay-voucher"
          >
            <h2>Update Voucher</h2>
            <label htmlFor="">Voucher Discount: </label>
            <input
              placeholder="Enter new voucher discount"
              value={updatedVoucherInfo.Discount}
              onChange={(e) =>
                setUpdatedVoucherInfo({
                  ...updatedVoucherInfo,
                  Discount: e.target.value,
                })
              }
            />{" "}
            <br />
            <label htmlFor="">Voucher Quantity: </label>{" "}
            <input
              placeholder="Enter new voucher quantity"
              value={updatedVoucherInfo.Quantity}
              onChange={(e) =>
                setUpdatedVoucherInfo({
                  ...updatedVoucherInfo,
                  Quantity: e.target.value,
                })
              }
            />{" "}
            <br />
            <label htmlFor="">Voucher Content: </label>{" "}
            <input
              placeholder="Enter new voucher content"
              value={updatedVoucherInfo.Content}
              onChange={(e) =>
                setUpdatedVoucherInfo({
                  ...updatedVoucherInfo,
                  Content: e.target.value,
                })
              }
            />{" "}
            <br />
            <br />
            <div className="modal-actions-voucher">
              <button
                onClick={() =>
                  handleUpdateVoucher(voucherID, updatedVoucherInfo)
                }
                className="btn-confirm-voucher"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-cancel-voucher"
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
            <h2>Add Voucher</h2>
            <label>Voucher Discount: </label>
            <input
              name="Discount"
              placeholder="Enter voucher discount"
              value={newVoucher.Discount}
              onChange={(e) =>
                setNewVoucher({ ...newVoucher, Discount: e.target.value })
              }
            />
            <br />
            <label>Voucher Quantity: </label>
            <input
              name="Quantity"
              placeholder="Enter voucher quantity"
              value={newVoucher.VoucherQuantity}
              onChange={(e) =>
                setNewVoucher({
                  ...newVoucher,
                  VoucherQuantity: e.target.value,
                })
              }
            />
            <br />
            <label>Voucher Expiration Date: </label>
            <input
              name="Expiration"
              placeholder="Enter voucher expiration date"
              type="date" // Ensure this is set to date
              value={newVoucher.Expiration}
              onChange={(e) =>
                setNewVoucher({ ...newVoucher, Expiration: e.target.value })
              }
            />
            <br />
            <label>Voucher Content: </label>
            <input
              name="Content"
              placeholder="Enter voucher content"
              value={newVoucher.Content}
              onChange={(e) =>
                setNewVoucher({ ...newVoucher, Content: e.target.value })
              }
            />
            <br />
            <div className="modal-actions-product">
              <button
                onClick={handleAddVoucher}
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

export default VoucherManagement;
