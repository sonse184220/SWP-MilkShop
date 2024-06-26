import React from 'react';

import './Voucher.css';

export const Voucher = () => {

    return (
        <>
            <div class="row mt-4">
                <h3>Available vouchers</h3>
                <div class="card mb-7">
                    <div class="card-body">
                        <div class="row">
                            {/* <span class="col-md-2">FD</span> */}
                            <div class="row col-md-12">
                                <div class="col-md-9">
                                    <h4 class="h5">Junior Frontend Developer</h4>
                                    <span class="badge bg-secondary">WORLDWIDE</span> <span class="badge bg-success">$60K - $100K</span>
                                </div>
                                <div class="applybtn col-md-3 ">
                                    <a href="#" class="btn btn-primary">Apply</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}