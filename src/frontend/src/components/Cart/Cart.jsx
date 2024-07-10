import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
// import { CheckCircle } from 'lucide-react';
// import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
// import { Alert, AlertTitle, AlertDescription } from '../../ui/alert';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Alert, AlertTitle } from "@mui/material";
import { X } from 'lucide-react';

import "./Cart.css";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { Voucher } from "../Voucher/Voucher";
import { TotalPrice } from "../TotalPrice/TotalPrice";
import { ViewCart } from "../../services/cart/viewCart";
import Quantity from "../Quantity/Quantity";
import { AddToCart } from "../../services/cart/addToCart";
import { UpdateCart } from "../../services/cart/updateCart";
import { RemoveCart } from "../../services/cart/removeCart";
import { UserInfoForm } from "../UserInfoForm/UserInfoForm";
import { getUser } from "../../services/editprofile/getUser";
import { MemberOrder } from "../../services/order/memberOrder";
import { GetAllVouchers } from "../../services/voucher/GetAllVouchers";
import { GetAllVouchersMember } from "../../services/voucher/getVoucherMember";

export const Cart = ({ isMember }) => {
  const navigate = useNavigate();
  const [CartItems, setCartItems] = useState([]);
  const [UserInfo, setUserInfo] = useState();
  const [userFormData, setUserFormData] = useState({
    Name: "",
    Email: "",
    Phone: "",
    Address: "",
    RewardPoints: "",
    useRewardPoints: false,
    paymentMethod: "COD",
  });
  const [vouchers, setVouchers] = useState([]);
  const [AppliedVoucher, setAppliedVoucher] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const MemberToken = "Bearer " + sessionStorage.getItem("token");

  const handleGetVouchers = async () => {
    try {
      // const MemberToken = 'Bearer ' + localStorage.getItem('token');
      const response = await GetAllVouchersMember(MemberToken);
      if (Array.isArray(response.data)) setVouchers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMemberOrderAction = async () => {
    try {
      // const MemberToken = 'Bearer ' + localStorage.getItem('token');
      const OrderInfo = {
        PaymentMethod: userFormData.paymentMethod,
        VoucherIDs: AppliedVoucher ? [AppliedVoucher] : [],
        useRewardPoints: userFormData.useRewardPoints,
        Name: userFormData.Name,
        Email: userFormData.Email,
        Phone: userFormData.Phone,
        Address: userFormData.Address,
      };
      const response = await MemberOrder(MemberToken, OrderInfo);
      if (response.data.orderId) {
        console.log("order success==========", response.data.message);
        handleViewCart();
        setAppliedVoucher(null);
        handleGetVouchers();
        handleGetUserInfo();
        setIsOpen(false);
        setIsSuccessModalOpen(true);
      }
    } catch (error) {
      if (error) {
        if (error.response.data.error) {
          toast.error(error.response.data.error, {
            theme: "colored",
          });
          setIsOpen(false);
        }
      }
    }
  };

  const handleGetUserInfo = () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("userData"));
      if (user) {
        // setUserInfo(user);
        setUserFormData({
          Name: user.Name,
          Email: user.Email,
          Phone: user.Phone,
          Address: user.Address,
          RewardPoints: user.RewardPoints,
          useRewardPoints: false,
          paymentMethod: "COD",
        });
      }
    } catch (error) { }
  };

  const handleRemoveCart = async (pID) => {
    try {
      // const MemberToken = 'Bearer ' + localStorage.getItem('token');
      console.log(MemberToken);
      const prID = {
        ProductID: pID,
      };
      const response = await RemoveCart(MemberToken, prID);
      // console.log(response);
      if (response.data.message) {
        handleViewCart();
        toast.success("Product removed from cart", {
          theme: "colored",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleIncrement = async (pID, currentQuantity) => {
    try {
      // const MemberToken = 'Bearer ' + localStorage.getItem('token');
      console.log(MemberToken);
      const prInfo = {
        ProductID: pID,
        CartQuantity: currentQuantity + 1,
      };
      const response = await UpdateCart(MemberToken, prInfo);
      console.log(response);
      if (response.data.message) {
        handleViewCart();
        console.log("cart", response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDecrement = async (pID, currentQuantity) => {
    try {
      if (currentQuantity === 1) {
        // If quantity is 1, call remove from cart API
        await handleRemoveCart(pID);
      } else {
        // If quantity is greater than 1, update the cart
        const prInfo = {
          ProductID: pID,
          CartQuantity: currentQuantity - 1,
        };
        const response = await UpdateCart(MemberToken, prInfo);
        if (response.data.message) {
          handleViewCart();
          console.log("cart updated", response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the cart", {
        theme: "colored",
      });
    }
  };

  const handleViewCart = async () => {
    try {
      // const MemberToken = 'Bearer ' + localStorage.getItem('token');
      console.log(MemberToken);
      const response = await ViewCart(MemberToken);
      console.log(response);
      if (response.data && response.data.length > 0) {
        setCartItems(response.data);
        console.log("cart", response.data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleViewCart();
    handleGetUserInfo();
    handleGetVouchers();
  }, []);

  return (
    <>
      <Header isMember={isMember} />
      <img className="image" src="/img/milkbuying.jpeg" alt="Header Image" />
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <h2>Confirm Order</h2>
        <p>Are you sure you want to place this order?</p>
        <div className="modal-actions">
          <button onClick={handleMemberOrderAction} className="btn-confirm">
            Confirm
          </button>
          <button onClick={() => setIsOpen(false)} className="btn-cancel">
            Cancel
          </button>
        </div>
      </Modal>

      {/* <Modal
                isOpen={isSuccessModalOpen}
                onRequestClose={() => setIsSuccessModalOpen(false)}
                className="custom-modal success-modal"
                overlayClassName="custom-overlay"
            >
                <Alert variant="default">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                        Your order has been placed successfully.
                    </AlertDescription>
                </Alert>
                <button onClick={() => setIsSuccessModalOpen(false)} className="btn-close mt-4">
                    Close
                </button>
            </Modal> */}

      <Modal
        isOpen={isSuccessModalOpen}
        onRequestClose={() => setIsSuccessModalOpen(false)}
        className="custom-modal success-modal"
        overlayClassName="custom-overlay"
      >
        {/* <button className='x-close-btn' onClick={() => setIsSuccessModalOpen(false)}>
          <X size={20} />
        </button> */}
        <Alert severity="success" icon={<CheckCircleIcon />}>
          <AlertTitle>Success!</AlertTitle>
          Your order has been placed successfully.
        </Alert>
        {/* <button
          onClick={() => setIsSuccessModalOpen(false)}
          className="btn-close"
        >
          Close
        </button> */}
      </Modal>
      <div className="middle-part">
        <ToastContainer style={{ top: "110px" }} />

        <div className="cart">
          <section className="h-100 gradient-custom">
            <div className="container py-5">
              <div className="row d-flex justify-content-center my-4">
                <div className="col-md-8">
                  <div className="card mb-4">
                    <div className="card-header py-3">
                      <h5 className="mb-0">Cart - {CartItems.length} items</h5>
                    </div>
                    <div className="cart-list">
                      {CartItems.length > 0 ? (
                        CartItems.map((item) => (
                          <div className="card-body" key={item.ProductID}>
                            <div className="row">
                              <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                                <div
                                  className="bg-image hover-overlay hover-zoom ripple rounded"
                                  data-mdb-ripple-color="light"
                                >
                                  <img
                                    src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Vertical/12a.webp"
                                    className="w-100"
                                    alt="Blue Jeans Jacket"
                                  />
                                </div>
                              </div>

                              <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">
                                <p className="title">
                                  <strong>{item.Name}</strong>
                                </p>
                                {/* <p><strong>{item.Name}</strong></p> */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveCart(item.ProductID)
                                  }
                                  data-mdb-button-init
                                  data-mdb-ripple-init
                                  className="btn btn-primary btn-sm me-1 mb-2"
                                  data-mdb-tooltip-init
                                  title="Remove item"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>

                              <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                                <div className="price">
                                  <strong>
                                    {item.Price.toLocaleString()}đ
                                  </strong>
                                </div>

                                <div className="quantity">
                                  <Quantity
                                    value={item.CartQuantity}
                                    increment={() =>
                                      handleIncrement(
                                        item.ProductID,
                                        item.CartQuantity
                                      )
                                    }
                                    decrement={() =>
                                      handleDecrement(
                                        item.ProductID,
                                        item.CartQuantity
                                      )
                                    }
                                  />
                                </div>
                                <div className="total-price">
                                  <p className="total">
                                    Total:{" "}
                                    <strong>
                                      {(
                                        item.Price * item.CartQuantity
                                      ).toLocaleString()}{" "}
                                      VND
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            </div>

                            <hr className="my-4" />
                          </div>
                        ))
                      ) : (
                        <div className="empty-cart-section section-fluid">
                          <div className="emptycart-wrapper">
                            <div className="container">
                              <div className="row">
                                <div className="emptycart-content text-center">
                                  <div className="cart-image">
                                    <img
                                      className="img-fluid"
                                      src="/img/empty-cart.png"
                                      alt="Empty Cart"
                                    />
                                  </div>
                                  <h4 className="title">Your Cart is Empty</h4>
                                  <h6 className="sub-title">
                                    Sorry... No item Found inside your cart!
                                  </h6>
                                  <a
                                    href=""
                                    onClick={(e) => {
                                      e.preventDefault();
                                      navigate("/Customer/home");
                                    }}
                                    className="btn btn-lg btn-golden"
                                  >
                                    Continue Shopping
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="voucher">
          <Voucher
            vouchers={vouchers}
            AppliedVoucher={AppliedVoucher}
            setAppliedVoucher={setAppliedVoucher}
          />
        </div>
      </div>
      <div className="middle2">
        <div className="totalpricebox">
          <TotalPrice
            CartItems={CartItems}
            handleMemberOrderAction={handleMemberOrderAction}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            AppliedVoucher={AppliedVoucher}
          />
        </div>
        <div className="infoform">
          <UserInfoForm
            userFormData={userFormData}
            setUserFormData={setUserFormData}
            isMember={isMember}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};
