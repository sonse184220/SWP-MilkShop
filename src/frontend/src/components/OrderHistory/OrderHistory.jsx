import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

import './OrderHistory.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Get1UserOrder } from '../../services/order-history/getOrder1User';

export const OrderHistory = ({ isMember }) => {
    const [orderhistory, setOrderHistory] = useState([]);
    const [pageCount, setPageCount] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);

    const MemberToken = 'Bearer ' + sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')).UserID : "Guest";

    const handleGetOrder1User = async () => {
        try {
            let limit, page, sort;
            const response = await Get1UserOrder(MemberToken, userId, limit, page, sort);
            if (response.data.data) {
                console.log(response.data.data);
                setOrderHistory(response.data.data);
            }
        } catch (error) {

        }
    }

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    useEffect(() => {
        handleGetOrder1User();
    }, [])

    return (
        <>
            <div><Header isMember={isMember} /></div>
            <img className='image' src="/img/milkbuying.jpeg" />
            <div className='history-order'>
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
                                                {orderhistory.map((order) => (
                                                    <tr key={order.OrderID}>
                                                        <td>
                                                            <a href="#" className="text-body">TBT15454841</a>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-3">
                                                                <div className="avatar-sm flex-shrink-0">
                                                                    <div className="avatar-title bg-light rounded">
                                                                        <img src="/img/" alt="" className="avatar-xs" />
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
                                                ))}
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
                <div>

                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="Next >"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel="< Previous"
                        renderOnZeroPageCount={null}
                        containerClassName="pagination justify-content-center"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        activeClassName="active"
                    />
                </div>
            </div>
            <div><Footer /></div>

        </>
    )
}
