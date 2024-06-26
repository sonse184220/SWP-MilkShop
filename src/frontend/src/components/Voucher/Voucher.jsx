import React from 'react';
import './Voucher.css';

export const Voucher = ({ vouchers, AppliedVoucher, setAppliedVoucher }) => {
    const handleVoucherClick = (voucherId) => {
        if (AppliedVoucher === voucherId) {
            setAppliedVoucher(null);
        } else {
            setAppliedVoucher(voucherId);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <>
            <div className="row mt-4">
                <h3>Available vouchers</h3>
                <div className="card mb-7">
                    <div className="card-body">
                        {vouchers.map((voucher, index) => (
                            <div className="row" key={index}>
                                <div className="row col-md-12">
                                    <div className="col-md-9">
                                        <h4 className="h5">{voucher.Content}</h4>
                                        <span className="badge bg-secondary">{formatDate(voucher.Expiration)}</span> <span className="badge bg-success">Quantity: {voucher.VoucherQuantity}</span>
                                    </div>
                                    <div className="applybtn col-md-3">
                                        {/* <button className="btn btn-primary" onClick={() => setAppliedVoucher(voucher.VoucherID)}>{AppliedVoucher === voucher.VoucherID ? 'Applied' : 'Apply'}</button> */}
                                        <button
                                            className={`btn ${AppliedVoucher === voucher.VoucherID ? 'btn-success' : 'btn-primary'}`}
                                            onClick={() => handleVoucherClick(voucher.VoucherID)}
                                        >
                                            {AppliedVoucher === voucher.VoucherID ? 'Applied' : 'Apply'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
