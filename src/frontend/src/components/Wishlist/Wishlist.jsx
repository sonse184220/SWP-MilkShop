import { useState } from 'react';
import './Wishlist.css';

export const Wishlist = () => {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <>
            <div className="wishlist-section">
                <div className="wishlish-table-wrapper aos-init aos-animate" data-aos="fade-up" data-aos-delay="0">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="table_desc">
                                    <div className="table_page table-responsive">
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
                                                <tr>
                                                    <td className="product_remove"><a href="#"><i className="fa fa-trash-alt"></i></a></td>
                                                    <td className="product_thumb"><a href="product-details-default.html"><img src="assets/images/product/default/home-1/default-1.jpg" alt="" /></a></td>
                                                    <td className="product_name"><a href="product-details-default.html">Handbag fringilla</a></td>
                                                    <td className="product-price">$65.00</td>
                                                    <td className="product_stock">In Stock</td>
                                                    <td className="product_addcart"><a href="#" className="btn btn-md btn-golden" onClick={openModal}>Add To Cart</a></td>
                                                </tr>
                                                <tr>
                                                    <td className="product_remove"><a href="#"><i className="fa fa-trash-alt"></i></a></td>
                                                    <td className="product_thumb"><a href="product-details-default.html"><img src="assets/images/product/default/home-1/default-2.jpg" alt="" /></a></td>
                                                    <td className="product_name"><a href="product-details-default.html">Handbags justo</a></td>
                                                    <td className="product-price">$90.00</td>
                                                    <td className="product_stock">In Stock</td>
                                                    <td className="product_addcart"><a href="#" className="btn btn-md btn-golden" onClick={openModal}>Add To Cart</a></td>
                                                </tr>
                                                <tr>
                                                    <td className="product_remove"><a href="#"><i className="fa fa-trash-alt"></i></a></td>
                                                    <td className="product_thumb"><a href="product-details-default.html"><img src="assets/images/product/default/home-1/default-3.jpg" alt="" /></a></td>
                                                    <td className="product_name"><a href="product-details-default.html">Handbag elit</a></td>
                                                    <td className="product-price">$80.00</td>
                                                    <td className="product_stock">In Stock</td>
                                                    <td className="product_addcart"><a href="#" className="btn btn-md btn-golden" onClick={openModal}>Add To Cart</a></td>
                                                </tr>
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
                                                    <img className="img-fluid" src="assets/images/product/default/home-1/default-1.jpg" alt="no img found" />
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
                                            <li><strong><i className="icon-shopping-cart"></i> There Are 5 Items In Your Cart.</strong></li>
                                            <li><strong>TOTAL PRICE: </strong> <span>$187.00</span></li>
                                            <li className="modal-continue-button"><a href="#" data-bs-dismiss="modal" onClick={closeModal}>CONTINUE SHOPPING</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
