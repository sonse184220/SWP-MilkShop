import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Modal from 'react-modal';


import './OrderHistory.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Get1UserOrder } from '../../services/order-history/getOrder1User';
import { GetOrderDetail } from '../../services/order-history/getOrderDetail';
import { GetPreOrderHistory } from '../../services/pre-order-history/getPreOrder1User';

export const OrderHistory = ({ isMember }) => {
    const [preorderhistory, setPreOrderHistory] = useState([]);
    const [orderhistory, setOrderHistory] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpenHistory, setIsOpenHistory] = useState(false);
    const [isCancelConfirm, setIsCancelConfirm] = useState(false);
    const [OrderDetail, setOrderDetail] = useState([]);

    const [POpageCount, setPOPageCount] = useState(1);
    const [POcurrentPage, setPOCurrentPage] = useState(1);

    const MemberToken = 'Bearer ' + sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')).UserID : "Guest";

    const handleGetOrder1User = async () => {
        try {
            let limit = 5;
            let page = currentPage;
            let sort = '';

            const response = await Get1UserOrder(MemberToken, userId, limit, page, sort);
            if (response.data.total > 0) {
                // console.log(response.data.data);
                setOrderHistory(response.data.data);
                setPageCount(response.data.totalPages);
            }
        } catch (error) {

        }
    }

    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
    };

    const handlePOPageClick = (event) => {
        setPOCurrentPage(event.selected + 1);
    };

    function formatPrice(price) {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;

        const formatted = numPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        return formatted;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    }

    const handleViewOrderDetail = async (orderId) => {
        try {
            const response = await GetOrderDetail(MemberToken, orderId);
            if (Array.isArray(response.data.detail) && response.data.detail.length > 0) {
                // console.log("Okkkk");
                setOrderDetail(response.data.detail);
                setIsOpenHistory(true);
            }
        } catch (error) {

        }
    }

    const handleGetPreOrder1User = async () => {
        try {
            let limit = 5;
            let page = POcurrentPage;
            let sort = '';

            const response = await GetPreOrderHistory(MemberToken, userId, limit, page, sort);
            if (response.data.total > 0) {
                // console.log(response.data.data);
                console.log("pre-order")
                setPreOrderHistory(response.data.data);
                setPOPageCount(response.data.totalPages);
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        handleGetOrder1User();
        handleGetPreOrder1User();

    }, [currentPage])

    useEffect(() => {
        handleGetOrder1User();
        handleGetPreOrder1User();
    }, [])

    return (
        <>
            <div><Header isMember={isMember} /></div>
            <img className='image' src="/img/milkbuying.jpeg" />
            <div className='history-order'>
                <Modal
                    isOpen={isCancelConfirm}
                    onRequestClose={() => setIsCancelConfirm(false)}
                    className="custom-modal"
                    overlayClassName="custom-overlay"
                >
                    <h2>Confirm Cancel</h2>
                    <p>Are you sure you want to cancel this order?</p>
                    <div className="modal-actions">
                        <button className="btn-confirm">Confirm</button>
                        <button onClick={() => setIsCancelConfirm(false)} className="btn-cancel">Cancel</button>
                    </div>
                </Modal>
                {OrderDetail.length > 0 && (
                    <Modal
                        isOpen={isOpenHistory}
                        onRequestClose={() => setIsOpenHistory(false)}
                        className="custom-modal-history"
                        overlayClassName="custom-overlay">
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Order ID</th>
                                    <th scope="col">Product ID</th>
                                    <th scope="col">Product Name</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {OrderDetail.map((detail) => (
                                    <tr>
                                        <td>{detail.OrderID}</td>
                                        <td>{detail.ProductID}</td>
                                        <td>{detail.OrderID}</td>
                                        <td>{detail.Price}</td>
                                        <td>{detail.Quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Modal>
                )}
                <div className='Order-PreOrderHistory'>
                    <section className="section">
                        <div className="container">
                            <h3>Pre-Orders</h3>
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
                                                <tbody className='OrderHistory-tbody'>
                                                    {preorderhistory.map((preorder) => (
                                                        <tr key={preorder.PreorderID}>
                                                            <td>
                                                                <a href="#" className="text-body">{preorder.PreorderID}</a>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-3">
                                                                    <div className="avatar-sm flex-shrink-0">
                                                                        <div className="avatar-title bg-light rounded">
                                                                            <img src="/img/" alt="" className="avatar-xs" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-grow-1">
                                                                        <h6 className="fs-15 mb-1">{preorder.productName}</h6>
                                                                        {/* <p className="mb-0 text-muted fs-13">Quantity: {preorder.Quantity}</p> */}
                                                                        <p className="mb-0 product-info">
                                                                            <span className="info-label">Quantity:</span>
                                                                            <span className="info-value">{preorder.Quantity}</span>
                                                                        </p>


                                                                        {/* <p className="mb-0 text-muted fs-13">CATEGORY: {preorder.brandName}</p> */}
                                                                        <p className="mb-0 product-info">
                                                                            <span className="info-label">Category:</span>
                                                                            <span className="info-value">{preorder.brandName}</span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td><span className="text-muted">{formatDate(preorder.created)}</span></td>
                                                            <td className="fw-medium">{formatPrice(preorder.TotalPrice)} VND</td>
                                                            <td>
                                                                <span className="badge bg-success-subtle text-success">{preorder.Status}</span>
                                                            </td>
                                                            <td>
                                                                <a href="" onClick={(e) => { e.preventDefault(); setIsCancelConfirm(true); }} data-bs-toggle="modal" className="btn btn-secondary btn-sm">Cancel</a>
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
                            onPageChange={handlePOPageClick}
                            pageRangeDisplayed={5}
                            pageCount={POpageCount}
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
                <div>
                    <section className="section">
                        <div className="container">
                            <h3>Orders</h3>
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
                                                <tbody className='OrderHistory-tbody'>
                                                    {orderhistory.map((order) => (
                                                        <tr key={order.OrderID}>
                                                            <td>
                                                                <a href="#" className="text-body">{order.OrderID}</a>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-3">
                                                                    <div className="avatar-sm flex-shrink-0">
                                                                        <div className="avatar-title bg-light rounded">
                                                                            <img src="/img/" alt="" className="avatar-xs" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-grow-1">
                                                                        <a href="" className="view-products-link" onClick={(e) => { e.preventDefault(); handleViewOrderDetail(order.OrderID) }}>
                                                                            <h6 className="fs-15 mb-1">View Your Products</h6>
                                                                        </a>
                                                                        {/* <p className="mb-0 text-muted fs-13">Women's Clothes</p> */}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td><span className="text-muted">{formatDate(order.created)}</span></td>
                                                            <td className="fw-medium">{formatPrice(order.TotalPrice)} VND</td>
                                                            <td>
                                                                <span className="badge bg-success-subtle text-success">{order.Status}</span>
                                                            </td>
                                                            <td>
                                                                <a href="" onClick={(e) => { e.preventDefault(); setIsCancelConfirm(true); }} data-bs-toggle="modal" className="btn btn-secondary btn-sm">Cancel</a>
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
            </div>
            <div><Footer /></div>

        </>
    )
}
