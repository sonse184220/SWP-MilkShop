import React from 'react';

import './Cart.css'
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { Voucher } from "../Voucher/Voucher";
import { TotalPrice } from '../TotalPrice/TotalPrice';

export const Cart = () => {
    return (
        <>
            <div><Header /></div>
            <img className='image' src="/img/P004.jpg" />
            <div className="middle-part">
                <div className="cart-container">
                    <div className="col-md-10">
                        <div className="card mb-4">
                            <div className="card-header py-3">
                                <h5 className="mb-0">Cart - 2 items</h5>
                            </div>
                            <div className="card-body">

                                <div className="row">
                                    <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">

                                        <div className="bg-image hover-overlay hover-zoom ripple rounded" data-mdb-ripple-color="light">
                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Vertical/12a.webp"
                                                className="w-100" alt="Blue Jeans Jacket" />
                                            <a href="#!">
                                                <div className="mask" style={{ backgroundColor: 'rgba(251, 251, 251, 0.2)' }}></div>
                                            </a>
                                        </div>

                                    </div>

                                    <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">

                                        <p><strong>Blue denim shirt</strong></p>
                                        <p>Color: blue</p>
                                        <p>Size: M</p>
                                        <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-sm me-1 mb-2" data-mdb-tooltip-init
                                            title="Remove item">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                        <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-danger btn-sm mb-2" data-mdb-tooltip-init
                                            title="Move to the wish list">
                                            <i className="fas fa-heart"></i>
                                        </button>

                                    </div>

                                    <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">

                                        <div className="d-flex mb-4" style={{ maxWidth: '300px' }}>
                                            <button data-mdb-button-init data-mdb-ripple-init className="btn btn-primary px-3 me-2"
                                                onClick={() => this.parentNode.querySelector('input[type=number]').stepDown()}>
                                                <i className="fas fa-minus"></i>
                                            </button>

                                            <div data-mdb-input-init className="form-outline">
                                                <input id="form1" min="0" name="quantity" defaultValue="1" type="number" className="form-control" />
                                                <label className="form-label" htmlFor="form1">Quantity</label>
                                            </div>

                                            <button data-mdb-button-init data-mdb-ripple-init className="btn btn-primary px-3 ms-2"
                                                onClick={() => this.parentNode.querySelector('input[type=number]').stepUp()}>
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>

                                        <p className="text-start text-md-center">
                                            <strong>$17.99</strong>
                                        </p>

                                    </div>
                                </div>

                                <hr className="my-4" />

                                <div className="row">
                                    <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">

                                        <div className="bg-image hover-overlay hover-zoom ripple rounded" data-mdb-ripple-color="light">
                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Vertical/13a.webp"
                                                className="w-100" alt="Red Hoodie" />
                                            <a href="#!">
                                                <div className="mask" style={{ backgroundColor: 'rgba(251, 251, 251, 0.2)' }}></div>
                                            </a>
                                        </div>

                                    </div>

                                    <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">

                                        <p><strong>Red hoodie</strong></p>
                                        <p>Color: red</p>
                                        <p>Size: M</p>

                                        <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-sm me-1 mb-2" data-mdb-tooltip-init
                                            title="Remove item">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                        <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-danger btn-sm mb-2" data-mdb-tooltip-init
                                            title="Move to the wish list">
                                            <i className="fas fa-heart"></i>
                                        </button>

                                    </div>

                                    <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">

                                        <div className="d-flex mb-4" style={{ maxWidth: '300px' }}>
                                            <button data-mdb-button-init data-mdb-ripple-init className="btn btn-primary px-3 me-2"
                                                onClick={() => this.parentNode.querySelector('input[type=number]').stepDown()}>
                                                <i className="fas fa-minus"></i>
                                            </button>

                                            <div data-mdb-input-init className="form-outline">
                                                <input id="form2" min="0" name="quantity" defaultValue="1" type="number" className="form-control" />
                                                <label className="form-label" htmlFor="form2">Quantity</label>
                                            </div>

                                            <button data-mdb-button-init data-mdb-ripple-init className="btn btn-primary px-3 ms-2"
                                                onClick={() => this.parentNode.querySelector('input[type=number]').stepUp()}>
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>

                                        <p className="text-start text-md-center">
                                            <strong>$17.99</strong>
                                        </p>

                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="card mb-4">
                            <div className="card-body">
                                <p><strong>Expected shipping delivery</strong></p>
                                <p className="mb-0">12.10.2020 - 14.10.2020</p>
                            </div>
                        </div>
                        <div className="card mb-4 mb-lg-0">
                            <div className="card-body">
                                <p><strong>We accept</strong></p>
                                <img className="me-2" width="45px"
                                    src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg"
                                    alt="Visa" />
                                <img className="me-2" width="45px"
                                    src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/amex.svg"
                                    alt="American Express" />
                                <img className="me-2" width="45px"
                                    src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg"
                                    alt="Mastercard" />
                                <img className="me-2" width="45px"
                                    src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce/includes/gateways/paypal/assets/images/paypal.webp"
                                    alt="PayPal acceptance mark" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <Voucher />
                </div>
            </div>
            <div><TotalPrice /></div>
            <Footer />
        </>
    );
};