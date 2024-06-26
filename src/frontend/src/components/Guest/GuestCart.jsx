import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import '../Cart/Cart.css';
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

export const GuestCart = ({ isMember }) => {
    const [CartItems, setCartItems] = useState([]);
    const [UserInfo, setUserInfo] = useState();
    const [userFormData, setUserFormData] = useState({
        Name: '',
        Email: '',
        Phone: '',
        Address: '',
        RewardPoints: ''
    });
    const [isOpen, setIsOpen] = useState(false);

    const handleMemberOrderAction = async () => {
        try {
            const MemberToken = 'Bearer ' + localStorage.getItem('token');
            const OrderInfo = {
                "PaymentMethod": "COD",
                "VoucherID": "V001",
                "useRewardPoints": false,
                "Name": userFormData.Name,
                "Email": userFormData.Email,
                "Phone": userFormData.Phone,
                "Address": userFormData.Address
            }
            const response = await MemberOrder(MemberToken, OrderInfo);
            if (response.data.orderId) {
                console.log("order success==========", response.data.message);
                handleViewCart();
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

    const handleRemoveCart = async (pID) => {
        try {
            const MemberToken = 'Bearer ' + localStorage.getItem('token');
            console.log(MemberToken);
            const prID = {
                "ProductID": pID,
            }
            const response = await RemoveCart(MemberToken, prID);
            // console.log(response);
            if (response.data.message) {
                handleViewCart();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleIncrement = async (pID, currentQuantity) => {
        try {
            const MemberToken = 'Bearer ' + localStorage.getItem('token');
            console.log(MemberToken);
            const prInfo = {
                "ProductID": pID,
                "CartQuantity": currentQuantity + 1
            }
            const response = await UpdateCart(MemberToken, prInfo);
            console.log(response);
            if (response.data.message) {
                handleViewCart();
                console.log("cart", response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDecrement = async (pID, currentQuantity) => {
        try {
            const MemberToken = 'Bearer ' + localStorage.getItem('token');
            console.log(MemberToken);
            const prInfo = {
                "ProductID": pID,
                "CartQuantity": currentQuantity - 1
            }
            const response = await UpdateCart(MemberToken, prInfo);
            console.log(response);
            if (response.data.message) {
                handleViewCart();
                console.log("cart", response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleViewCart = async () => {
        try {
            const MemberToken = 'Bearer ' + localStorage.getItem('token');
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
    }

    useEffect(() => {
        handleViewCart();
        handleGetUserInfo();
    }, []);

    return (
        <>
            <Header isMember={isMember} />
            <img className='image' src="/img/P004.jpg" alt="Header Image" />
            <div className="middle-part">
                <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
                    <h2>Confirm Order</h2>
                    <p>Are you sure you want to place this order?</p>
                    <button onClick={() => {/* handle confirmation */ }}>Confirm</button>
                    <button onClick={() => setIsOpen(false)}>Cancel</button>
                </Modal>

                <div className="cart">
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
                                                                        increment={() => handleIncrement(item.ProductID, item.CartQuantity)}
                                                                        decrement={() => handleDecrement(item.ProductID, item.CartQuantity)} />

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
                                                                    <a href="#" className="btn btn-lg btn-golden">Continue Shopping</a>
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
                    <Voucher />
                </div>

            </div>
            <div className='middle2'>
                <div className='totalpricebox'><TotalPrice
                    CartItems={CartItems}
                    handleMemberOrderAction={handleMemberOrderAction}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen} />
                </div>
                <div className='infoform'><UserInfoForm userFormData={userFormData} setUserFormData={setUserFormData} /></div>
            </div>
            <Footer />
        </>
    );
};