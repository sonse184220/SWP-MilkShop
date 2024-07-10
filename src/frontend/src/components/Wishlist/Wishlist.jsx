import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

import './Wishlist.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { GetWishlist } from '../../services/wishlist/getAllWishlist';
import { RemoveWishlist } from '../../services/wishlist/removeWishlish';
import { AddToCart } from '../../services/cart/addToCart';
import { ViewCart } from '../../services/cart/viewCart';

export const Wishlist = ({ isMember }) => {
    const navigate = useNavigate();

    const MemberToken = 'Bearer ' + sessionStorage.getItem('token');

    const [showModal, setShowModal] = useState(false);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [CartItems, setCartItems] = useState([]);
    const [lastPrToCart, setLastPrToCart] = useState('');

    const openModal = (e) => { e.preventDefault(); setShowModal(true); }
    const closeModal = (e) => { e.preventDefault(); setShowModal(false); }

    const calculateTotalPrice = () => {
        return CartItems.reduce((total, item) => {
            return total + (item.Price * item.CartQuantity);
        }, 0);
    };

    const handleViewCart = async () => {
        try {
            // const MemberToken = 'Bearer ' + sessionStorage.getItem('token');
            console.log(MemberToken);
            const response = await ViewCart(MemberToken);
            console.log(response);
            if (response.data && response.data.length > 0) {
                setCartItems(response.data);
                console.log("cart", response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddToCart = async (e, pID) => {
        e.preventDefault();
        try {
            // const MemberToken = 'Bearer ' + sessionStorage.getItem('token');
            const prInfo = {
                "ProductID": pID,
                "CartQuantity": 1
            }
            const response = await AddToCart(MemberToken, prInfo);
            if (response.data.message) {
                // toast.success('Added to cart', {
                //     theme: "colored",
                // });
                handleViewCart();
                setLastPrToCart(pID);
                openModal(e);
            }
            // console.log('cart============', response)
        } catch (error) {
            console.log(error);
        }
    }

    const handleRemoveWishlist = async (e, pID) => {
        try {
            e.preventDefault();
            const response = await RemoveWishlist(MemberToken, JSON.parse(sessionStorage.getItem("userData")).UserID, pID);
            if (response.data.msg) {
                // setMessage('Remove success');
                // showWishlistMessage();
                toast.success('Removed from wishlist', {
                    theme: "colored",
                });
                handleGetWishlist();
            } else if (response.data.error) {
                toast.error('Failed to remove', {
                    theme: "colored",
                });
                // showWishlistMessage();
            }
        } catch (error) {

        }
    }

    // const showWishlistMessage = () => {
    //     const message = document.getElementById('wishlistMessage');
    //     message.style.display = 'block';
    //     setTimeout(() => {
    //         message.style.display = 'none';
    //     }, 3000); // Hide after 3 seconds
    // };

    const handleGetWishlist = async () => {
        try {
            const response = await GetWishlist(JSON.parse(sessionStorage.getItem("userData")).UserID);
            if (response.data) {
                console.log(response.data);
                setWishlistItems(response.data);
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        handleGetWishlist();
    }, [])

    return (
        <>
            <div><Header isMember={isMember} /></div>
            <img className='image' src="/img/milkbuying.jpeg" />
            {/* <div id="wishlistMessage" className="wishlist-message">
                {message}
            </div> */}
            <ToastContainer style={{ top: '110px' }} />
            <div className="wishlist-section">
                <div className="wishlist-item-count">
                    {wishlistItems.length + ' items in wishlist'}
                </div>
                <div className="wishlish-table-wrapper aos-init aos-animate" data-aos="fade-up" data-aos-delay="0">
                    <div className="container" style={{ width: '80%' }}>
                        <div className="row">
                            <div className="col-12">
                                <div className="">
                                    <div className="table_page table-responsive table-bx">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th className="product_remove">Delete</th>
                                                    <th className="product_thumb">Image</th>
                                                    <th className="product_name">Product</th>
                                                    <th className="product-price">Price</th>
                                                    <th className="product_stock">Stock Status</th>
                                                    <th className="product_addcart">Add To Cart</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {wishlistItems.length > 0 ? (
                                                    (
                                                        wishlistItems.map((item) => (
                                                            <tr>
                                                                <td className="product_remove"><a onClick={(e) => handleRemoveWishlist(e, item.ProductID)} href=""><i className="fa fa-trash-alt"></i></a></td>
                                                                <td className="product_thumb"><a href="product-details-default.html"><img src={`/img/${item.ProductID}.jpg`} alt="" /></a></td>
                                                                <td className="product_name"><a href="product-details-default.html">{item.Name}</a></td>
                                                                <td className="product-price">{item.Price.toLocaleString()} VND</td>
                                                                <td className="product_stock">{item.Status}</td>
                                                                <td className="product_addcart"><a href="#" className="btn btn-md btn-golden" onClick={(e) => handleAddToCart(e, item.ProductID)}>Add To Cart</a></td>
                                                            </tr>
                                                        ))
                                                    )
                                                ) : (
                                                    <tr><td colSpan={6}>
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
                                                                            <h4 className="title">Your Wishlist is Empty</h4>
                                                                            <h6 className="sub-title">
                                                                                Sorry... No item Found inside your wishlist!
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
                                                    </td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`modal fade ${showModal ? 'show' : ''}`} id="modalAddcart" tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }} aria-hidden={!showModal} aria-modal={showModal ? 'true' : undefined} role={showModal ? 'dialog' : undefined}>
                <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col text-right">
                                        <button type="button" className="close modal-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}>
                                            <span aria-hidden="true"><i className="fa fa-times"></i></span>
                                        </button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-7">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="modal-add-cart-product-img">
                                                    <img className="img-fluid" src={`/img/${lastPrToCart}.jpg`} alt="no img found" />
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="modal-add-cart-info"><i className="fa fa-check-square"></i>Added to cart successfully!</div>
                                                <div className="modal-add-cart-product-cart-buttons">
                                                    <a href="cart.html">View Cart</a>
                                                    <a href="checkout.html">Checkout</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-5 modal-border">
                                        <ul className="modal-add-cart-product-shipping-info">
                                            <li><strong><i className="icon-shopping-cart"></i> There Are {CartItems.length} Items In Your Cart.</strong></li>
                                            <li><strong>TOTAL PRICE: </strong> <span>{calculateTotalPrice().toLocaleString()} VND</span></li>
                                            <li className="modal-continue-button"><a href="#" data-bs-dismiss="modal" onClick={closeModal}>CONTINUE SHOPPING</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div><Footer /></div>
        </>
    );
}
