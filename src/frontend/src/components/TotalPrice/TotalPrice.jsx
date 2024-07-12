import React, { useState } from 'react';


import './TotalPrice.css'

export const TotalPrice = ({ CartItems, AppliedVoucher, userFormData, setIsOpen, isMember }) => {


    const calculateTotalPrice = () => {
        let totalPrice = 0;

        if (CartItems) {
            totalPrice = CartItems.reduce((total, item) => {
                return total + (item.Price * item.CartQuantity);
            }, 0);
        }

        // Apply voucher discount
        if (isMember) {
            if (AppliedVoucher) {
                totalPrice *= (1 - AppliedVoucher.Discount / 100);
            }

            // Apply reward points discount
            if (userFormData.useRewardPoints) {
                totalPrice -= userFormData.RewardPoints;
            }
        }

        return Math.max(totalPrice, 0);
    };

    return (
        <section className="h-100 gradient-custom">
            <div className="container py-5">
                <div className="row d-flex justify-content-center my-4">

                    <div className="col-md-4">
                        <div className="card mb-4">
                            <div className="card-header py-3">
                                <h5 className="mb-0">Summary</h5>
                            </div>
                            <div className="card-body">
                                <ul className="list-group list-group-flush">
                                    <li
                                        className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                                        Products
                                        <span>{calculateTotalPrice().toLocaleString()} VND</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        Shipping
                                        <span>COD</span>
                                    </li>
                                    <li
                                        className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                                        <div>
                                            <strong>Total amount</strong>
                                            {/* <strong>
                                                <p className="mb-0">(including VAT)</p>
                                            </strong> */}
                                        </div>
                                        <span><strong>{calculateTotalPrice().toLocaleString()} VND</strong></span>
                                    </li>
                                </ul>
                                {/* onClick={handleMemberOrderAction} */}
                                <button onClick={() => setIsOpen(true)} type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-lg btn-block">
                                    Go to checkout
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
