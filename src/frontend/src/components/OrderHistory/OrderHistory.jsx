import React from 'react';

export const OrderHistory = () => {
    return (
        <section className="section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div>
                            <div className="table-responsive">
                                <table className="table fs-15 align-middle table-nowrap">
                                    <thead>
                                        <tr>
                                            <th scope="col">Order ID</th>
                                            <th scope="col">Product</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Total Amount</th>
                                            <th scope="col">Status</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <a href="#" className="text-body">TBT15454841</a>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-3">
                                                    <div className="avatar-sm flex-shrink-0">
                                                        <div className="avatar-title bg-light rounded">
                                                            <img src="../assets/images/products/img-19.png" alt="" className="avatar-xs" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <a href="product-details.html">
                                                            <h6 className="fs-15 mb-1">World's Most Expensive T Shirt</h6>
                                                        </a>
                                                        <p className="mb-0 text-muted fs-13">Women's Clothes</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className="text-muted">01 Jul, 2022</span></td>
                                            <td className="fw-medium">$287.53</td>
                                            <td>
                                                <span className="badge bg-success-subtle text-success">Delivered</span>
                                            </td>
                                            <td>
                                                <a href="#invoiceModal" data-bs-toggle="modal" className="btn btn-secondary btn-sm">Invoice</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a href="#" className="text-body">TBT15425012</a>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-3">
                                                    <div className="avatar-sm flex-shrink-0">
                                                        <div className="avatar-title bg-danger-subtle rounded">
                                                            <img src="../assets/images/products/img-12.png" alt="" className="avatar-xs" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <a href="product-details.html">
                                                            <h6 className="fs-15 mb-1">Onyx SmartGRID Chair Red</h6>
                                                        </a>
                                                        <p className="mb-0 text-muted fs-13">Furniture &amp; Decor</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-muted">01 Feb, 2023</span></td>
                                            <td className="fw-medium">$39.99</td>
                                            <td>
                                                <span className="badge bg-secondary-subtle text-secondary">Shipping</span>
                                            </td>
                                            <td>
                                                <a href="#invoiceModal" data-bs-toggle="modal" className="btn btn-secondary btn-sm">Invoice</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a href="#" className="text-body">TBT1524563</a>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-3">
                                                    <div className="avatar-sm flex-shrink-0">
                                                        <div className="avatar-title bg-success-subtle rounded">
                                                            <img src="../assets/images/products/img-4.png" alt="" className="avatar-xs" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <a href="product-details.html">
                                                            <h6 className="fs-15 mb-1">Slippers Open Toe</h6>
                                                        </a>
                                                        <p className="mb-0 text-muted fs-13">Footwear</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-muted">09 Dec, 2022</span></td>
                                            <td className="fw-medium">$874.00</td>
                                            <td><span className="badge bg-danger-subtle text-danger">Out Of Delivery</span></td>
                                            <td>
                                                <a href="#invoiceModal" data-bs-toggle="modal" className="btn btn-secondary btn-sm">Invoice</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a href="#" className="text-body">TBT1524530</a>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-3">
                                                    <div className="avatar-sm flex-shrink-0">
                                                        <div className="avatar-title bg-secondary-subtle rounded">
                                                            <img src="../assets/images/products/img-1.png" alt="" className="avatar-xs" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <a href="product-details.html">
                                                            <h6 className="fs-15 mb-1">Hp Trendsetter Backpack</h6>
                                                        </a>
                                                        <p className="mb-0 text-muted fs-13">Handbags &amp; Clutches</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-muted">02 Jan, 2023</span></td>
                                            <td className="fw-medium">$32.00</td>
                                            <td>
                                                <span className="badge bg-success-subtle text-success">Delivered</span></td>
                                            <td>
                                                <a href="#invoiceModal" data-bs-toggle="modal" className="btn btn-secondary btn-sm">Invoice</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <a href="#" className="text-body">TBT13642870</a>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-3">
                                                    <div className="avatar-sm flex-shrink-0">
                                                        <div className="avatar-title bg-info-subtle rounded">
                                                            <img src="../assets/images/products/img-7.png" alt="" className="avatar-xs" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <a href="product-details.html">
                                                            <h6 className="fs-15 mb-1">Innovative education book</h6>
                                                        </a>
                                                        <p className="mb-0 text-muted fs-13">Books</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-muted">08 Jan, 2023</span></td>
                                            <td className="fw-medium">$18.32</td>
                                            <td>
                                                <span className="badge bg-warning-subtle text-warning">Pending</span></td>
                                            <td>
                                                <a href="#invoiceModal" data-bs-toggle="modal" className="btn btn-secondary btn-sm">Invoice</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="text-end">
                                <button className="btn btn-hover btn-primary">Continue Shopping <i className="ri-arrow-right-line align-middle ms-1"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
