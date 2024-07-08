import React, { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import "./VoucherManagement.css";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addVoucher } from "../../services/voucher/addVoucher";

const VoucherManagement = () => {
  const StaffToken = "Bearer " + sessionStorage.getItem("token");
  console.log("Retrieved Staff Token:", StaffToken); // Debugging line

  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [vouchers, setVouchers] = useState([
    {
      VoucherID: 1,
      Discount: "10%",
      Quantity: 100,
      Expiration: "2023-12-31",
      Content: "10% off on all products",
    },
    {
      VoucherID: 2,
      Discount: "20%",
      Quantity: 50,
      Expiration: "2024-01-15",
      Content: "20% off on orders over $50",
    },
    {
      VoucherID: 3,
      Discount: "15%",
      Quantity: 200,
      Expiration: "2024-06-30",
      Content: "15% off on selected items",
    },
  ]);

  const [newVoucher, setNewVoucher] = useState({
    VoucherID: "",
    Discount: "",
    Quantity: "",
    Expiration: "",
    Content: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const toggleDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle("dropdown-menu");
    }
  };

  const handleAddVoucher = async () => {
    try {
      const formData = new FormData();
      formData.append("VoucherID", newVoucher.VoucherID);
      formData.append("Discount", newVoucher.Discount);
      formData.append("Quantity", newVoucher.Quantity);
      formData.append("Expiration", newVoucher.Expiration);
      formData.append("Content", newVoucher.Content);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await addVoucher(StaffToken, formData);
      console.log("API response:", response); // Debugging line

      if (response.data.voucher) {
        setVouchers([...vouchers, response.data.voucher]);
        setIsAddOpen(false);
        setNewVoucher({
          VoucherID: "",
          Discount: "",
          Quantity: "",
          Expiration: "",
          Content: "",
        });
        setImageFile(null);
        toast.success("Voucher added successfully", {
          duration: 3000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error adding voucher:", error);
      toast.error("Failed to add voucher. Please try again!", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

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
                  <a href="#">Logout</a>
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
                  <td>{voucher.Quantity}</td>
                  <td>{voucher.Expiration}</td>
                  <td>{voucher.Content}</td>
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
            className="custom-modal-voucher"
            overlayClassName="custom-overlay-voucher"
          >
            <h2>Update Voucher</h2>
            <label htmlFor="">Voucher Discount: </label>
            <input placeholder="Enter new voucher discount" /> <br />
            <label htmlFor="">Voucher Quantity: </label>{" "}
            <input placeholder="Enter new voucher quantity" /> <br />
            <label htmlFor="">Voucher Content: </label>{" "}
            <input placeholder="Enter new voucher content" /> <br />
            <br />
            <div className="modal-actions-voucher">
              <button
                onClick={handleFileChange}
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
            <label>Voucher ID: </label>
            <input
              name="VoucherID"
              placeholder="Enter voucher id"
              value={newVoucher.VoucherID}
              onChange={(e) =>
                setNewVoucher({ ...newVoucher, VoucherID: e.target.value })
              }
            />
            <br />
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
              value={newVoucher.Quantity}
              onChange={(e) =>
                setNewVoucher({ ...newVoucher, Quantity: e.target.value })
              }
            />
            <br />
            <label>Voucher Expiration Date: </label>
            <input
              name="Expiration"
              placeholder="Enter voucher expiration date"
              type="date"
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
