import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Alert, AlertTitle } from '@mui/material';

import './GuestCart.css';
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { Voucher } from "../Voucher/Voucher";
import { TotalPrice } from '../TotalPrice/TotalPrice';
import { ViewCart } from '../../services/cart/viewCart';
import Quantity from '../Quantity/Quantity';
import { AddToCart } from '../../services/cart/addToCart';
import { UpdateCart } from '../../services/cart/updateCart';
import { RemoveCart } from '../../services/cart/removeCart';
import { UserInfoForm } from '../UserInfoForm/UserInfoForm';
import { MemberOrder } from '../../services/order/memberOrder';
import { GuestOrder } from '../../services/order/guestOrder';

export const GuestCart = ({ isMember }) => {
    const navigate = useNavigate();
    const [CartItems, setCartItems] = useState([]);
    const [UserInfo, setUserInfo] = useState();
    const [userFormData, setUserFormData] = useState({
        Name: '',
        Email: '',
        Phone: '',
        Address: '',
        // RewardPoints: ''
    });
    const [isOpen, setIsOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);


    // const OrderInfo = {
    //     "PaymentMethod": "COD",
    //     "Name": userFormData.Name,
    //     "Email": userFormData.Email,
    //     "Phone": userFormData.Phone,
    //     "Address": userFormData.Address,
    //     "Orders": [
    //         {
    //             "ProductID":"p001",
    //             "Quantiy":3
    //         },
    //         {
    //             "ProductID":"p002",
    //             "Quantiy":5
    //         }
    //     ]
    // }

    const handleGuestOrderAction = async () => {
        try {
            if (userFormData.Name.length === 0 ||
                userFormData.Email.length === 0 ||
                userFormData.Phone.length === 0 ||
                userFormData.Address.length === 0) {
                toast.error("Please input all order info fields", {
                    theme: "colored",
                });
                setIsOpen(false);
                return;
            }
            const MemberToken = 'Bearer ' + localStorage.getItem('token');
            handleViewCart();
            const cart = CartItems.map(item => ({
                ProductID: item.ProductID,
                Quantity: item.CartQuantity
            }));
            console.log(cart);
            const OrderInfo = {
                "PaymentMethod": "COD",
                "VoucherID": [],
                "useRewardPoints": false,
                "Name": userFormData.Name,
                "Email": userFormData.Email,
                "Phone": userFormData.Phone,
                "Address": userFormData.Address,
                "cart": cart
            }
            const response = await GuestOrder(OrderInfo);
            if (response.data.orderId) {
                console.log("order success==========", response.data.message);
                handleViewCart();
                setIsOpen(false);
                setIsSuccessModalOpen(true);
            }
        } catch (error) {

        }
    }

    const handleGetUserInfo = () => {
        try {
            const user = JSON.parse(localStorage.getItem("userData"));
            if (user) {
                // setUserInfo(user);
                setUserFormData({
                    Name: user.Name,
                    Email: user.Email,
                    Phone: user.Phone,
                    Address: user.Address,
                    RewardPoints: user.RewardPoints
                })
            }
        } catch (error) {

        }
    }

    const handleRemoveCart = (productId) => {
        try {
            let cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
            const productIndex = cart.findIndex(item => item.ProductID === productId);
            if (productIndex !== -1) {
                cart.splice(productIndex, 1);
                sessionStorage.setItem('cart', JSON.stringify(cart));
                handleViewCart();
                toast.success("Product removed from cart", {
                    theme: "colored",
                });
            } else {
                toast.error("Product not found in cart cart", {
                    theme: "colored",
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    // const handleRemoveCart = async (pID) => {
    //     try {
    //         const MemberToken = 'Bearer ' + localStorage.getItem('token');
    //         console.log(MemberToken);
    //         const prID = {
    //             "ProductID": pID,
    //         }
    //         const response = await RemoveCart(MemberToken, prID);
    //         // console.log(response);
    //         if (response.data.message) {
    //             handleViewCart();
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const handleIncrement = (productId) => {
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item.ProductID === productId);

        if (existingProductIndex !== -1) {
            // If the product exists, increment the quantity
            cart[existingProductIndex].CartQuantity += 1;
            sessionStorage.setItem('cart', JSON.stringify(cart));
            // You might want to update state here if you're using React state to render the cart
            // setCartItems    }
            handleViewCart();
        }
    };

    // const handleIncrement = async (pID, currentQuantity) => {
    //     try {
    //         const MemberToken = 'Bearer ' + localStorage.getItem('token');
    //         console.log(MemberToken);
    //         const prInfo = {
    //             "ProductID": pID,
    //             "CartQuantity": currentQuantity + 1
    //         }
    //         const response = await UpdateCart(MemberToken, prInfo);
    //         console.log(response);
    //         if (response.data.message) {
    //             handleViewCart();
    //             console.log("cart", response.data.message);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const handleDecrement = (productId) => {
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item.ProductID === productId);

        if (existingProductIndex !== -1) {
            // If the product exists and quantity is greater than 1, decrement the quantity
            if (cart[existingProductIndex].CartQuantity > 1) {
                cart[existingProductIndex].CartQuantity -= 1;
            } else {
                // If quantity is 1, remove the item from the cart
                cart.splice(existingProductIndex, 1);
            }
            sessionStorage.setItem('cart', JSON.stringify(cart));       // You might want to update state here if you're using React state to render the cart
            // setCartItems(cart);
            handleViewCart();
        }
    };

    // const handleDecrement = async (pID, currentQuantity) => {
    //     try {
    //         const MemberToken = 'Bearer ' + localStorage.getItem('token');
    //         console.log(MemberToken);
    //         const prInfo = {
    //             "ProductID": pID,
    //             "CartQuantity": currentQuantity - 1
    //         }
    //         const response = await UpdateCart(MemberToken, prInfo);
    //         console.log(response);
    //         if (response.data.message) {
    //             handleViewCart();
    //             console.log("cart", response.data.message);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const handleViewCart = async () => {
        try {
            const MemberToken = 'Bearer ' + localStorage.getItem('token');
            console.log(MemberToken);
            // const response = await ViewCart(MemberToken);
            // console.log(response);
            // const cartitems = localStorage.getItem('cart')
            const cartitems = JSON.parse(sessionStorage.getItem('cart') || '[]');
            if (Array.isArray(cartitems) && cartitems.length > 0) {
                setCartItems(cartitems);
                console.log("cart");
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleViewCart();
        handleGetUserInfo();
    }, []);

    return (
        <>
            <Header isMember={isMember} />
            <img className='image' src="/img/milkbuying.jpeg" alt="Header Image" />
            <div className="GuestMiddle">
                {/* <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
                    <h2>Confirm Order</h2>
                    <p>Are you sure you want to place this order?</p>
                    <button onClick={() => {handle confirmation }}>Confirm</button>
                    <button onClick={() => setIsOpen(false)}>Cancel</button>
                </Modal> */}

                <Modal
                    isOpen={isOpen}
                    onRequestClose={() => setIsOpen(false)}
                    className="custom-modal"
                    overlayClassName="custom-overlay"
                >
                    <h2>Confirm Order</h2>
                    <p>Are you sure you want to place this order?</p>
                    <div className="modal-actions">
                        <button onClick={handleGuestOrderAction} className="btn-confirm">Confirm</button>
                        <button onClick={() => setIsOpen(false)} className="btn-cancel">Cancel</button>
                    </div>
                </Modal>

                <Modal
                    isOpen={isSuccessModalOpen}
                    onRequestClose={() => setIsSuccessModalOpen(false)}
                    className="custom-modal success-modal"
                    overlayClassName="custom-overlay"
                >
                    <Alert severity="success" icon={<CheckCircleIcon />}>
                        <AlertTitle>Success!</AlertTitle>
                        Your order has been placed successfully.
                    </Alert>
                    <button onClick={() => setIsSuccessModalOpen(false)} className="btn-close">
                        Close
                    </button>
                </Modal>

                <ToastContainer style={{ top: '110px' }} />


                <div className="GuestCart">
                    <section className="h-100 gradient-custom">
                        <div className="container py-5">
                            <div className="row d-flex justify-content-center my-4">
                                <div className="col-md-8">
                                    <div className="card mb-4">
                                        <div className="card-header py-3">
                                            <h5 className="mb-0">Cart - {CartItems.length} items</h5>
                                        </div>
                                        <div className='cart-list'>
                                            {CartItems.length > 0 ? (
                                                CartItems.map((item) => (
                                                    <div className="card-body" key={item.ProductID}>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                                                                <div className="bg-image hover-overlay hover-zoom ripple rounded" data-mdb-ripple-color="light">
                                                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Vertical/12a.webp" className="w-100" alt="Blue Jeans Jacket" />
                                                                </div>
                                                            </div>

                                                            <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">
                                                                <p className='title'><strong>{item.Name}</strong></p>
                                                                {/* <p><strong>{item.Name}</strong></p> */}
                                                                <button type="button" onClick={() => handleRemoveCart(item.ProductID)} data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-sm me-1 mb-2" data-mdb-tooltip-init title="Remove item">
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </div>

                                                            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                                                                <div className="price">
                                                                    <strong>{item.Price.toLocaleString()}đ</strong>
                                                                </div>

                                                                <div className='quantity'>
                                                                    <Quantity
                                                                        value={item.CartQuantity}
                                                                        increment={() => handleIncrement(item.ProductID)}
                                                                        decrement={() => handleDecrement(item.ProductID)} />

                                                                </div>
                                                                <div className="total-price">
                                                                    <p className="total">Total: <strong>{(item.Price * item.CartQuantity).toLocaleString()} VND</strong></p>
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
                                                                        <img className="img-fluid" src="/img/empty-cart.png" alt="Empty Cart" />
                                                                    </div>
                                                                    <h4 className="title">Your Cart is Empty</h4>
                                                                    <h6 className="sub-title">Sorry... No item Found inside your cart!</h6>
                                                                    <a href="" onClick={(e) => { e.preventDefault(); navigate('/Customer/home') }} className="btn btn-lg btn-golden">Continue Shopping</a>
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
                {/* <div className="voucher">
                    <Voucher />
                </div> */}
                <div className='GuestCartInfo'>
                    <div className='Guest-form-info'><UserInfoForm userFormData={userFormData} setUserFormData={setUserFormData} isMember={isMember} /></div>
                    <div className='Guest-total-box'><TotalPrice
                        // CartItems={CartItems}
                        // handleMemberOrderAction={handleMemberOrderAction}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    />
                    </div>

                </div>

            </div>

            <Footer />
        </>
    );
};
