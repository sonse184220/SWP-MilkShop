import './ProductDetail.css'
import { ToastContainer, toast } from 'react-toastify';
import ReactReadMoreReadLess from "react-read-more-read-less";
import he from 'he';

import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

import { Oval } from 'react-loader-spinner';

// {blog.Content ? (
//     <>
//       <p>{truncateContent(blog.Content, 200)}</p>
//       {blog.Content.length > 200 && (
//         <Link to={`/Customer/BlogDetail/${blog.BlogID}`} className="read-more-link">
//           Show more
//         </Link>
//       )}
//     </>
//   ) : (
//     <p>No content available</p>
//   )}


import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import ProductList from '../Product/ProductList';
import Feedback from '../Feedback/Feedback';
import { useEffect, useState } from 'react';
import getProductById from '../../services/product/getProductByID';
import Page404 from '../404NotFound/404Page';
import { useNavigate, useParams } from 'react-router-dom';
import GetFeedback from '../../services/feedback/getFeedback';
import AddFeedback from '../../services/feedback/addNewFeedback';
import { AddWishlist } from '../../services/wishlist/addWishlist';
import { GetWishlist } from '../../services/wishlist/getAllWishlist';
import { RemoveWishlist } from '../../services/wishlist/removeWishlish';
import { DeleteFeedback } from '../../services/feedback/deleteFeedback';
import { AddToCart } from '../../services/cart/addToCart';
import { PreOrder } from '../../services/pre-order/pre-order';
import GetProductByBrandID from '../../services/product/getProductByBrandID';


const ProductDetail = ({ isMember }) => {
    const navigate = useNavigate();

    const [isPreOrderLoading, setIsPreOrderLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { ProductID } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [CurrentProduct, setCurrentProduct] = useState(null);
    const [isOpenPreOrder, setIsOpenPreOrder] = useState(false);
    const [PreOrderFormData, setPreOrderFormData] = useState({
        Name: '',
        Email: '',
        Phone: '',
        Address: '',
    });
    const [relatedProduct, setRelatedProduct] = useState([]);

    const userId = sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')).UserID : "Guest";
    const MemberToken = 'Bearer ' + sessionStorage.getItem('token');

    const [feedbacks, setFeedbacks] = useState([])
    const [newFeedback, setNewFeedback] = useState({
        rating: 0,
        content: ''
    });
    const [inWishlist, setInWishlist] = useState(false);

    const handleGetRelatedProduct = async () => {
        try {
            const response = await GetProductByBrandID(CurrentProduct.BrandID);
            if (response.data.total > 0) {
                setRelatedProduct(response.data.data);
            }
        } catch (error) {

        }
    }

    const handlePreOrderAction = async () => {
        try {
            setIsPreOrderLoading(true);
            const PreOrderInfo = {
                "userId": userId,
                "productId": CurrentProduct.ProductID,
                "quantity": quantity,
                "paymentMethod": "Banking",
                "name": PreOrderFormData.Name,
                "email": PreOrderFormData.Email,
                "phone": PreOrderFormData.Phone,
                "address": PreOrderFormData.Address
            }
            const response = await PreOrder(MemberToken, PreOrderInfo);
            if (response.data[0].PreorderID) {
                setPreOrderFormData({
                    Name: '',
                    Email: '',
                    Phone: '',
                    Address: '',
                });
                setIsOpenPreOrder(false);
                toast.success('Pre-order placed successfully', {
                    theme: "colored",
                });
                navigate('/Customer/QRBanking');
            }
        } catch (error) {

        } finally {
            setIsPreOrderLoading(false);
        }
    }

    const handleGetUserInfo = () => {
        try {
            const user = JSON.parse(sessionStorage.getItem("userData"));
            if (user) {
                // setUserInfo(user);
                setPreOrderFormData({
                    Name: user.Name,
                    Email: user.Email,
                    Phone: user.Phone,
                    Address: user.Address,
                })
            }
        } catch (error) {

        }
    }

    const handleAddToCart = async (e) => {
        e.preventDefault();
        try {
            if (isMember) {
                // const MemberToken = 'Bearer ' + sessionStorage.getItem('token');
                console.log(MemberToken);
                const prInfo = {
                    "ProductID": ProductID,
                    "CartQuantity": quantity
                }
                const response = await AddToCart(MemberToken, prInfo);
                if (response.data.message) {
                    toast.success('Added to cart', {
                        theme: "colored",
                    });
                    console.log('adddddddddddddddd')
                }
            } else {

                let cart = JSON.parse(sessionStorage.getItem('cart')) || [];


                const existingProductIndex = cart.findIndex(item => item.ProductID === ProductID);

                if (existingProductIndex !== -1) {

                    cart[existingProductIndex].CartQuantity += quantity;
                } else {

                    cart.push({
                        ProductID: CurrentProduct.ProductID,
                        Name: CurrentProduct.Name,
                        Price: CurrentProduct.Price,
                        CartQuantity: quantity,
                        Image: CurrentProduct.Image
                    });
                }


                sessionStorage.setItem('cart', JSON.stringify(cart));

                toast.success('Added to cart', {
                    theme: "colored",
                });
            }
            // console.log('cart============', response)
        } catch (error) {
            console.log(error);
            toast.error('Failed to add to cart', {
                theme: "colored",
            });
        }
    }

    const checkIsWishlistState = async () => {
        if (!isMember) return;
        await handleGetWishlist();
        const wishlistItems = JSON.parse(sessionStorage.getItem("wishlist"));
        const matchItem = wishlistItems ? wishlistItems.find(product => product.ProductID === ProductID) : false;
        console.log("statussssssss", matchItem)
        setInWishlist(!!matchItem);
    }

    const handleGetWishlist = async () => {
        if (!isMember) return;
        try {
            const response = await GetWishlist(userId);
            if (response.data) {
                console.log(response.data);
                sessionStorage.setItem("wishlist", JSON.stringify(response.data));
            }
        } catch (error) {

        }
    }

    const handleAddRemoveWishList = async (e) => {
        if (!isMember) return;
        try {
            e.preventDefault();

            // const MemberToken = 'Bearer ' + sessionStorage.getItem('token');
            console.log("token======", MemberToken)
            if (!inWishlist) {
                setInWishlist(prevState => !prevState);
                const response = await AddWishlist(MemberToken, ProductID);
                console.log(response);
                if (response.data && response.data.msg) {
                    toast.success('Added to wishlist', {
                        theme: "colored",
                    });
                    checkIsWishlistState();
                }
                //  else {
                //     // If the response is not as expected, revert the state
                //     setInWishlist(prevState => !prevState);
                //     toast.error('Failed to add to wishlist', {
                //         theme: "colored",
                //     });
                // }
            } else {
                setInWishlist(prevState => !prevState);
                const response = await RemoveWishlist(MemberToken, ProductID);
                console.log(response.data.msg);
                if (response.data.msg) {
                    toast.success('Removed from wishlist', {
                        theme: "colored",
                    });
                    checkIsWishlistState();
                }
                else if (response.data.error) {
                    setInWishlist(prevState => !prevState);
                    toast.error('Failed to remove from wishlist', {
                        theme: "colored",
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteFeedback = async (e, feedbackid) => {
        if (!isMember) return;
        e.preventDefault();
        try {
            // const MemberToken = 'Bearer ' + sessionStorage.getItem('token');
            const response = await DeleteFeedback(feedbackid, MemberToken);
            if (response.data.msg) {
                toast.success('Feedback deleted successfully', {
                    theme: "colored",
                });
            } else if (response.data.error) {
                toast.error('Failed to delete feedback', {
                    theme: "colored",
                });
            }
            handleGetFeedback();
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddFeedback = async () => {
        if (!isMember) return;
        try {
            // const MemberToken = 'Bearer ' + sessionStorage.getItem('token');
            const response = await AddFeedback(MemberToken, ProductID, newFeedback);
            if (!response.data.error) {
                toast.success('Feedback added successfully', {
                    theme: "colored",
                });
                setNewFeedback({
                    rating: 0,
                    content: ''
                });

            } else if (response.data.error) {
                toast.error('Failed to add feedback', {
                    theme: "colored",
                });
            }
            handleGetFeedback();
        } catch (error) {
            console.log(error)
            if (error.response.data.msg) {
                toast.error(error.response.data.msg, {
                    theme: "colored",
                });
            }
        }
    }

    const handleGetFeedback = async () => {
        try {
            // const response = await GetFeedback(ProductID);
            const response = await getProductById(ProductID);
            console.log(response);
            setFeedbacks(response.data.feedbacks)
        } catch (error) {

        }
    }

    const handleGetProductByID = async () => {
        try {
            setIsLoading(true);
            const response = await getProductById(ProductID);
            console.log(response);
            if (response.data.product.Status === 'available') {
                setCurrentProduct(response.data.product);
                setIsLoading(false)
            }
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    const handleIncrement = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - 1);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPreOrderFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const decodeContent = (content) => {
        if (!content) return '';

        const decodedContent = he.decode(content);

        return decodedContent.replace(/<[^>]*>/g, '');
    };

    const truncateContent = (content, maxLength) => {
        const decodedContent = decodeContent(content);
        if (decodedContent.length <= maxLength) return decodedContent;
        return decodedContent.substr(0, maxLength) + '...';
    };

    useEffect(() => {
        handleGetProductByID();
        handleGetFeedback();
        handleGetWishlist();
        checkIsWishlistState();
        handleGetUserInfo();
        handleGetRelatedProduct();
    }, []);

    useEffect(() => {
        if (CurrentProduct) {
            handleGetRelatedProduct();
        }
    }, [CurrentProduct]);

    return (
        <div className='body'>
            <div><Header isMember={isMember} /></div>
            <img className='image' src="/img/pinkbg.jpg" />
            {CurrentProduct && (
                <Modal
                    isOpen={isOpenPreOrder}
                    onRequestClose={() => setIsOpenPreOrder(false)}
                    className="custom-modal-preorder"
                    overlayClassName="custom-overlay"
                >
                    <h2>Pre-Order</h2>
                    <p className='pre-order-intro'>The product is out-of-stock. Do you want to pre-order?</p>
                    <div className='pre-order-content'>
                        <div className='pre-order-product'>
                            <h3>{CurrentProduct.Name}</h3>
                            <h4>CATEGORY: {CurrentProduct.BrandName}</h4>
                            <div><img src={`data:image/jpeg;base64,${CurrentProduct.Image}`} /></div>
                            <div className="pre-order-quantity">
                                <span>Quantity</span>
                                <div className="product-variable-quantity">
                                    <input min="1" max="100" value={quantity} type="number"
                                        onChange={e => setQuantity(parseInt(e.target.value))}
                                        onIncrement={handleIncrement}
                                        onDecrement={handleDecrement} />
                                </div>
                            </div>
                        </div>
                        <div className='pre-order-form-btn'>
                            <div className='pre-order-form'>
                                <form>
                                    <div className='pre-order-form-group'>
                                        <label className='mb-1'>Name</label>
                                        <input
                                            className='form-control mb-1'
                                            type='text'
                                            name="Name"
                                            placeholder='Name'
                                            value={PreOrderFormData.Name}
                                            onChange={handleInputChange}
                                        />

                                    </div>
                                    <div style={{ height: '15px' }}>{PreOrderFormData.Name.length === 0 && <p className="pOinfo-error-message">*Please input name</p>}</div>
                                    <div className='pre-order-form-group'>
                                        <label className='mb-1'>Email</label>
                                        <input
                                            className='form-control mb-1'
                                            type='text'
                                            name="Email"
                                            placeholder='Email'
                                            value={PreOrderFormData.Email}
                                            onChange={handleInputChange}
                                        />

                                    </div>
                                    <div style={{ height: '15px' }}>{PreOrderFormData.Email.length === 0 && <p className="pOinfo-error-message">*Please input name</p>}</div>

                                    <div className='pre-order-form-group'>
                                        <label className='mb-1'>Phone</label>
                                        <input
                                            className='form-control mb-1'
                                            type='text'
                                            name="Phone"
                                            placeholder='Phone'
                                            value={PreOrderFormData.Phone}
                                            onChange={handleInputChange}
                                        />

                                    </div>
                                    <div style={{ height: '15px' }}> {PreOrderFormData.Phone.length === 0 && <p className="pOinfo-error-message">*Please input name</p>}</div>

                                    <div className='pre-order-form-group'>
                                        <label className='mb-1'>Address</label>
                                        <input
                                            className='form-control mb-1'
                                            type='text'
                                            name="Address"
                                            placeholder='Address'
                                            value={PreOrderFormData.Address}
                                            onChange={handleInputChange}
                                        />

                                    </div>
                                    <div style={{ height: '15px' }}>{PreOrderFormData.Address.length === 0 && <p className="pOinfo-error-message">*Please input name</p>}</div>
                                </form>
                            </div>
                            <a onClick={handlePreOrderAction} className="btn btn-block btn-lg btn-black-default-hover" >
                                {isPreOrderLoading ? (
                                    <div className="oval-container">
                                        <Oval
                                            height={20}
                                            width={20}
                                            color="#fff"
                                            style={{ display: 'flex', justifyContent: 'center' }}
                                        />
                                    </div>
                                ) : (
                                    'Place Pre-Order'
                                )}
                            </a>

                        </div>
                    </div>
                </Modal>
            )
            }
            {/* {isLoading ? ( */}

            {/* ) :  */}
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '15px auto' }}>
                    <Oval
                        // height={40}
                        // width={40}
                        color="#fff"
                        style={{ display: 'flex', justifyContent: 'center' }}
                    />
                </div>
            ) :
                ((CurrentProduct) ?
                    (
                        <div>
                            <div>
                                <ToastContainer style={{ top: '110px' }} />
                                <div className="product-detail">
                                    <div className="detail-img">
                                        {/* <img src={`${CurrentProduct[0].Image}`} /> */}
                                        {/* <img src={`data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, CurrentProduct[0].Image.data))}`} /> */}
                                        <img
                                            src={`data:image/jpeg;base64,${CurrentProduct.Image}`}
                                            alt={CurrentProduct.Name}
                                        />
                                    </div>
                                    <div className="product-details-content-area product-details--golden aos-init aos-animate detail-info" >
                                        <div className="product-details-text">
                                            <h4 className="title">{CurrentProduct.Name}</h4>
                                            <div className="price">{CurrentProduct.Price.toLocaleString()} VND</div>
                                            {/* <p>{CurrentProduct.Content}</p> */}
                                            <div dangerouslySetInnerHTML={{ __html: he.decode(CurrentProduct.Content) }}></div>
                                            {/* <>
                                        <ReactReadMoreReadLess
                                            charLimit={200}
                                            readMoreText={"Read more ▼"}
                                            readLessText={"Read less ▲"}
                                            readMoreClassName="read-more-less--more"
                                            readLessClassName="read-more-less--less"
                                        >
                                            {decodeContent(CurrentProduct.Content)}
                                        </ReactReadMoreReadLess>
                                    </> */}

                                        </div>
                                        <div className="product-details-variable">
                                            <h4 className="title">Available Options</h4>

                                            <div className="variable-single-item">
                                                <div className="product-stock"> <span className="product-stock-in"><i className="zmdi zmdi-check-circle"></i></span> {CurrentProduct.Quantity} IN STOCK</div>
                                            </div>

                                            <div className="d-flex align-items-center ">
                                                <div className="variable-single-item ">
                                                    <span>Quantity</span>
                                                    <div className="product-variable-quantity">
                                                        <input min="1" max="100" value={quantity} type="number"
                                                            onChange={e => setQuantity(parseInt(e.target.value))}
                                                            onIncrement={handleIncrement}
                                                            onDecrement={handleDecrement} />
                                                    </div>
                                                </div>

                                                <div className="product-add-to-cart-btn">
                                                    {/* {(isMember && CurrentProduct.Quantity === 0) ?
                                                (<a href="#" onClick={(e) => { e.preventDefault(); setIsOpenPreOrder(true) }} className="btn btn-block btn-lg btn-black-default-hover" data-bs-toggle="modal" data-bs-target="#modalAddcart">Pre-Order</a>)
                                                :
                                                (<a href="#" onClick={handleAddToCart} className="btn btn-block btn-lg btn-black-default-hover" data-bs-toggle="modal" data-bs-target="#modalAddcart">+ Add To Cart</a>)
                                            } */}
                                                    {(!isMember && CurrentProduct.Quantity === 0) ? (
                                                        <button
                                                            className="btn btn-block btn-lg btn-black-default-hover disabled-button"
                                                            disabled
                                                            style={{ cursor: 'not-allowed', opacity: 0.6 }}
                                                        >
                                                            Out of Stock
                                                        </button>
                                                    ) : (isMember && CurrentProduct.Quantity === 0) ? (
                                                        <a
                                                            href="#"
                                                            onClick={(e) => { e.preventDefault(); setIsOpenPreOrder(true) }}
                                                            className="btn btn-block btn-lg btn-black-default-hover"

                                                        >
                                                            Pre-Order
                                                        </a>
                                                    ) : (
                                                        <a
                                                            href="#"
                                                            onClick={handleAddToCart}
                                                            className="btn btn-block btn-lg btn-black-default-hover"

                                                        >
                                                            + Add To Cart
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            {isMember && (
                                                <div className="product-details-meta mb-20" style={{ display: 'flex' }}>
                                                    <a href="" onClick={handleAddRemoveWishList} className="icon-space-right"><i className={`zmdi ${inWishlist ? 'zmdi-favorite' : 'zmdi-favorite-outline'}`}></i>{inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}</a>
                                                    {/* <a href="compare.html" className="icon-space-right"><i className="zmdi zmdi-refresh"></i>Compare</a> */}
                                                    <p className='wislist-prompt'>(Mark as your favorite product)</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="product-details-catagory mb-2">
                                            <span className="title">CATEGORY:</span>
                                            <ul>
                                                <li><a href="#" disabled style={{ cursor: 'disabled' }}>{CurrentProduct.BrandName}</a></li>
                                                {/* <li><a href="#">KITCHEN UTENSILS</a></li>
                                        <li><a href="#"></a></li> */}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className='feedback'>
                                    <Feedback
                                        feedbacks={feedbacks}
                                        onAddFeedback={handleAddFeedback}
                                        onDeleteFeedback={handleDeleteFeedback}
                                        newFeedback={newFeedback}
                                        setNewFeedback={setNewFeedback}
                                        userId={userId}
                                        isMember={isMember}
                                    /></div>
                                {/* <div><ProductList products={products} /></div> */}
                                <div>
                                    {relatedProduct.length > 0 && <ProductList products={relatedProduct} />}
                                </div>
                            </div>
                        </div>
                    )
                    : (
                        // <div>No product data available</div>
                        <div><Page404 /></div>
                        // <div style={{ display: 'flex', justifyContent: 'center' }}>
                        //     <Oval
                        //         // height={40}
                        //         // width={40}
                        //         color="#fff"
                        //         style={{ display: 'flex', justifyContent: 'center' }}
                        //     />
                        // </div>
                    )
                )}


            <div><Footer /></div>
        </div >
    );
}

export default ProductDetail;