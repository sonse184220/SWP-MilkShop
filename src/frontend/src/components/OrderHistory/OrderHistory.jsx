import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Modal from 'react-modal';
import { Oval } from 'react-loader-spinner';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import './OrderHistory.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Get1UserOrder } from '../../services/order-history/getOrder1User';
import { GetOrderDetail } from '../../services/order-history/getOrderDetail';
import { GetPreOrderHistory } from '../../services/pre-order-history/getPreOrder1User';
import { useNavigate } from 'react-router-dom';
import { CancelOrder } from '../../services/order-history/cancelOrder';
import { CancelPreOrder } from '../../services/pre-order-history/cancelPreOrder';
import { SendReport } from '../../services/report/sendReport';

export const OrderHistory = ({ isMember }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [isReportOpen, setIsReportOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);
    const [itemType, setItemType] = useState('');
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

    const [newreport, setNewReport] = useState({
        orderType: "",
        orderId: "",
        preorderId: "",
        title: "",
        content: ""
    });

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

    const handleCancelOrder = (id, type) => {
        const items = type === 'order' ? orderhistory : preorderhistory;
        const item = items.find(i => type === 'order' ? i.OrderID === id : i.PreorderID === id);
        if (item && item.Status === 'Waiting') {
            setSelectedItem(item);
            setItemType(type);
            setIsCancelConfirm(true);
        }
    };

    const updateStatus = async () => {
        try {
            let response;
            if (itemType === 'order') {
                console.log(MemberToken)
                response = await CancelOrder(MemberToken, selectedItem.OrderID);

            } else {
                response = await CancelPreOrder(MemberToken, selectedItem.PreorderID);
            }
            if (Array.isArray(response.data)) {
                toast.success(`${itemType === 'order' ? 'Order' : 'Pre-order'} cancelled successfully!`, {
                    duration: 3000,
                    position: "top-right",
                });
                itemType === 'order' ? handleGetOrder1User() : handleGetPreOrder1User();
                setIsCancelConfirm(false);
                setSelectedItem(null);
                setItemType("");
            }
        } catch (error) {
            console.error(`Error cancelling ${itemType}:`, error);
            setIsCancelConfirm(false);
            setSelectedItem(null);
            setItemType("");
            toast.error(`Failed to cancel ${itemType}. Please try again.`, {
                duration: 3000,
                position: "top-right",
            });
        }
    };

    const openReportModal = (type, id) => {
        if (type === 'order') {
            setNewReport({
                ...newreport,
                orderType: type,
                orderId: id
            });
        } else if (type === 'preorder') {
            setNewReport({
                ...newreport,
                orderType: type,
                preorderId: id
            });
        }
        setIsReportOpen(true);
    };

    const handleSendReport = async () => {
        if (newreport.title.length === 0 || newreport.content.length === 0) {
            toast.error('Please filled all informations before submit', {
                duration: 3000,
                position: "top-right",
            });
            return;
        }
        try {
            const response = await SendReport(MemberToken, newreport);
            if (response.data[0].ReportID) {
                toast.success('Report submitted successfully!', {
                    duration: 3000,
                    position: "top-right",
                });
                setIsReportOpen(false);
                setNewReport({
                    orderType: '',
                    orderId: '',
                    title: '',
                    content: ''
                });
            }
        } catch (error) {
            console.error('Error sending report:', error);
            toast.error('Failed to submit report. Please try again.', {
                duration: 3000,
                position: "top-right",
            });
        }
    }

    const isReportDisabled = (updatedDate) => {
        const currentDate = new Date();
        const orderUpdatedDate = new Date(updatedDate);


        currentDate.setHours(0, 0, 0, 0);
        orderUpdatedDate.setHours(0, 0, 0, 0);


        const diffTime = currentDate - orderUpdatedDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        return diffDays > 3;
    };

    useEffect(() => {
        handleGetOrder1User();
        handleGetPreOrder1User();

    }, [currentPage, POcurrentPage])

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    handleGetOrder1User(),
                    handleGetPreOrder1User()
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [])

    return (
        <>
            <div><Header isMember={isMember} /></div>
            <img className='image' src="/img/pinkbg.jpg" />
            <ToastContainer style={{ top: "110px" }} />
            <h4 style={{ fontStyle: 'italic', textAlign: 'center' }}>Note: You can only cancel product when status is Waiting, and send report in 3 days after success order (Done status)</h4>
            <div className='history-order'>
                <Modal
                    isOpen={isReportOpen}
                    onRequestClose={() => setIsReportOpen(false)}
                    className="custom-modal-blog"
                    overlayClassName="custom-overlay-blog"
                >
                    {/* <h2>Report</h2>
                    <label htmlFor="old-password">OrderID: </label>
                    <input
                        type="password"
                        id="old-password"
                        placeholder="Enter old password"
                   
                    />
                    <br />
                    <label htmlFor="new-password">Title: </label>
                    <input
                        type="password"
                        id="new-password"
                        placeholder="Enter new password"
                    
                    />{" "}
                    <br />
                    <label htmlFor="confirm-new-password">
                        Content:
                    </label>{" "}
                    <input
                        type="password"
                        id="confirm-new-password"
                        placeholder="Confirm new password"
                    
                    />
                    <br />
                    <br /> */}
                    <h2>Report</h2>
                    <label htmlFor="report-title">Title: </label>
                    <input
                        type="text"
                        id="report-title"
                        placeholder="Enter report title"
                        value={newreport.title}
                        onChange={(e) => setNewReport({ ...newreport, title: e.target.value })}
                    />
                    <br />
                    <label htmlFor="report-content">Content: </label>
                    <textarea
                        id="report-content"
                        placeholder="Enter report content"
                        style={{ width: '100%', height: '90px' }}
                        value={newreport.content}
                        onChange={(e) => setNewReport({ ...newreport, content: e.target.value })}
                    />
                    <br />
                    <div className="modal-actions-blog">
                        <button className="btn-confirm-blog"
                            onClick={handleSendReport}
                        >
                            Send Report
                        </button>
                        <button onClick={() => setIsReportOpen(false)} className="btn-cancel-blog">
                            Cancel
                        </button>
                    </div>
                </Modal>
                <Modal
                    isOpen={isCancelConfirm}
                    onRequestClose={() => setIsCancelConfirm(false)}
                    className="custom-modal"
                    overlayClassName="custom-overlay"
                >
                    <h2>Confirm Cancel</h2>
                    <p>Are you sure you want to cancel this order?</p>
                    <div className="modal-actions">
                        <button onClick={updateStatus} className="btn-confirm">Confirm</button>
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
                                                        <th scope="col">Pre-Order Date</th>
                                                        <th scope="col">Estimate Shipping Date</th>
                                                        <th scope="col">Total Amount</th>
                                                        <th scope="col">Payment Method</th>
                                                        <th scope="col">Payment Status</th>
                                                        <th scope="col">Status</th>
                                                        <th scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className='OrderHistory-tbody'>
                                                    {isLoading ? (
                                                        <tr>
                                                            <td colSpan="6" style={{ padding: 0 }}>
                                                                <div style={{
                                                                    height: '200px',
                                                                    width: '100%'
                                                                }}>
                                                                    <Oval
                                                                        // height={20}
                                                                        // width={20}
                                                                        // color="#fff"
                                                                        wrapperStyle={{
                                                                            display: 'flex',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            height: '100%',
                                                                            width: '100%'
                                                                        }}
                                                                    />
                                                                </div></td>
                                                        </tr>
                                                    ) : (
                                                        (preorderhistory.map((preorder) => (
                                                            <tr key={preorder.PreorderID}>
                                                                <td>
                                                                    <a href="#" className="text-body">{preorder.PreorderID}</a>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex gap-3">
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
                                                                <td><span className="text-muted">{formatDate(preorder.ETA)}</span></td>
                                                                <td className="fw-medium">{formatPrice(preorder.TotalPrice)} VND</td>
                                                                <td className="fw-medium">{preorder.PaymentMethod}</td>
                                                                <td>
                                                                    <span className="badge bg-success-subtle text-success">{preorder.PaymentStatus}</span>
                                                                </td>
                                                                <td>
                                                                    <span className="badge bg-success-subtle text-success">{preorder.Status}</span>
                                                                </td>
                                                                <td>
                                                                    {/* <a href="" onClick={(e) => { e.preventDefault(); setIsCancelConfirm(true); }} data-bs-toggle="modal" className="btn btn-secondary btn-sm"
                                                                        {preorder.Status !== 'Waiting' ? (disabled
                                                                            style={{ opacity: 0.5, cursor: 'not-allowed' }})}>Cancel</a> */}
                                                                    {/* {preorder.Status !== 'Waiting' ? (
                                                                        <button
                                                                            className="btn btn-secondary btn-sm"
                                                                            disabled
                                                                            style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    ) : (
                                                                        <a
                                                                            href=""
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                handleCancelOrder(preorder.PreorderID, 'pre-order');
                                                                            }}
                                                                            className="btn btn-secondary btn-sm"
                                                                        >
                                                                            Cancel
                                                                        </a>
                                                                    )} */}
                                                                    {(() => {
                                                                        if (preorder.Status === 'Waiting') {
                                                                            return (
                                                                                <a
                                                                                    href=""
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        handleCancelOrder(preorder.PreorderID, 'pre-order');
                                                                                    }}
                                                                                    className="btn btn-secondary btn-sm"
                                                                                >
                                                                                    Cancel
                                                                                </a>
                                                                            );
                                                                        } else if (preorder.Status === 'Done') {
                                                                            const isDisabled = isReportDisabled(preorder.updated);
                                                                            return (
                                                                                <button
                                                                                    className="btn btn-warning btn-sm"
                                                                                    onClick={() => openReportModal('preorder', preorder.PreorderID)}
                                                                                    disabled={isDisabled}
                                                                                    style={isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                                                                >
                                                                                    Report
                                                                                </button>
                                                                            );
                                                                            // else if (preorder.Status === 'Done') {
                                                                            //     return (
                                                                            //         <button
                                                                            //             className="btn btn-warning btn-sm"
                                                                            //             onClick={() => openReportModal('preorder', preorder.PreorderID)}
                                                                            //         style={{ opacity: 0.7, cursor: 'not-allowed' }}
                                                                            //         >
                                                                            //             Report
                                                                            //         </button>
                                                                            //     );
                                                                        } else {
                                                                            return (
                                                                                <button
                                                                                    className="btn btn-secondary btn-sm"
                                                                                    disabled
                                                                                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                            );
                                                                        }
                                                                    })()}
                                                                </td>
                                                            </tr>
                                                        )))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="text-end">
                                            <button onClick={(e) => { e.preventDefault(); navigate('/Customer/home') }} className="btn btn-hover btn-primary">Continue Shopping <i className="ri-arrow-right-line align-middle ms-1"></i></button>
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
                </div >
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
                                                        <th scope="col">Payment Method</th>
                                                        <th scope="col">Payment Status</th>
                                                        <th scope="col">Status</th>
                                                        <th scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className='OrderHistory-tbody'>
                                                    {isLoading ? (
                                                        <tr>
                                                            <td colSpan="6" style={{ padding: 0 }}>
                                                                <div style={{
                                                                    height: '200px',
                                                                    width: '100%'
                                                                }}>
                                                                    <Oval
                                                                        // height={20}
                                                                        // width={20}
                                                                        // color="#fff"
                                                                        wrapperStyle={{
                                                                            display: 'flex',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            height: '100%',
                                                                            width: '100%'
                                                                        }}
                                                                    />
                                                                </div></td>
                                                        </tr>
                                                    ) : (
                                                        (orderhistory.map((order) => (
                                                            <tr key={order.OrderID}>
                                                                <td>
                                                                    <a href="#" className="text-body">{order.OrderID}</a>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex gap-3">
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
                                                                <td className="fw-medium">{order.PaymentMethod}</td>
                                                                <td>
                                                                    <span className="badge bg-success-subtle text-success">{order.PaymentStatus}</span>
                                                                </td>
                                                                <td>
                                                                    <span className="badge bg-success-subtle text-success">{order.Status}</span>
                                                                </td>
                                                                <td>
                                                                    {/* <a href="" onClick={(e) => { e.preventDefault(); setIsCancelConfirm(true); }} data-bs-toggle="modal" className="btn btn-secondary btn-sm">Cancel</a> */}
                                                                    {/* {order.Status !== 'Waiting' ? (
                                                                        <button
                                                                            className="btn btn-secondary btn-sm"
                                                                            disabled
                                                                            style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    ) : (
                                                                        <a
                                                                            href=""
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                handleCancelOrder(order.OrderID, 'order');
                                                                            }}
                                                                            className="btn btn-secondary btn-sm"
                                                                        >
                                                                            Cancel
                                                                        </a>
                                                                    )} */}
                                                                    {(() => {
                                                                        if (order.Status === 'Waiting') {
                                                                            return (
                                                                                <a
                                                                                    href=""
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        handleCancelOrder(order.OrderID, 'order');
                                                                                    }}
                                                                                    className="btn btn-secondary btn-sm"
                                                                                >
                                                                                    Cancel
                                                                                </a>
                                                                            );
                                                                        } else if (order.Status === 'Done') {
                                                                            const isDisabled = isReportDisabled(order.updated);
                                                                            return (
                                                                                <button
                                                                                    className="btn btn-warning btn-sm"
                                                                                    onClick={() => openReportModal('order', order.OrderID)}
                                                                                    disabled={isDisabled}
                                                                                    style={isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                                                                >
                                                                                    Report
                                                                                </button>
                                                                            );
                                                                            // else if (order.Status === 'Done') {
                                                                            //     return (
                                                                            //         <button
                                                                            //             className="btn btn-warning btn-sm"
                                                                            //             onClick={() => openReportModal('order', order.OrderID)}
                                                                            //         >
                                                                            //             Report
                                                                            //         </button>
                                                                            //     );
                                                                        } else {
                                                                            return (
                                                                                <button
                                                                                    className="btn btn-secondary btn-sm"
                                                                                    disabled
                                                                                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                            );
                                                                        }
                                                                    })()}
                                                                </td>
                                                            </tr>
                                                        )))
                                                    )}

                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="text-end">
                                            <button onClick={(e) => { e.preventDefault(); navigate('/Customer/home') }} className="btn btn-hover btn-primary">Continue Shopping <i className="ri-arrow-right-line align-middle ms-1"></i></button>
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
                            // nextClassName="page-item"
                            nextLinkClassName="page-link"
                            activeClassName="active"
                        />
                    </div>
                </div>
            </div >
            <div><Footer /></div>

        </>
    )
}
