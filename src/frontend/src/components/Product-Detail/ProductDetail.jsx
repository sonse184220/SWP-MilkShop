import './ProductDetail.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';


import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import ProductList from '../Product/ProductList';
import Feedback from '../Feedback/Feedback';
import { useEffect, useState } from 'react';
import getProductById from '../../services/product/getProductByID';
import Page404 from '../404NotFound/404Page';
import { useParams } from 'react-router-dom';
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
    const products = [
        {
            name: 'Product 1',
            description: 'This is the description for Product 1.',
            image: 'https://via.placeholder.com/150',
            url: 'https://example.com/product1'
        },
        {
            name: 'Product 2',
            description: 'This is the description for Product 2.',
            image: 'https://via.placeholder.com/150',
            url: 'https://example.com/product2'
        },
        {
            name: 'Product 3',
            description: 'This is the description for Product 3.',
            image: 'https://via.placeholder.com/150',
            url: 'https://example.com/product3'
        },
        {
            name: 'Product 4',
            description: 'This is the description for Product 4.',
            image: 'https://via.placeholder.com/150',
            url: 'https://example.com/product4'
        },
        {
            name: 'Product 5',
            description: 'This is the description for Product 5.',
            image: 'https://via.placeholder.com/150',
            url: 'https://example.com/product5'
        }
    ];

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
        userId: userId,
        rating: 0,
        content: ''
    });
    const [inWishlist, setInWishlist] = useState(false);

    const handleGetRelatedProduct = async () => {
        try {
            const response = await GetProductByBrandID(CurrentProduct.BrandID);
            // console.log('related', response);
            if (response.data.total > 0) {
                setRelatedProduct(response.data.data);
            }
        } catch (error) {

        }
    }

    const handlePreOrderAction = async () => {
        try {
            const PreOrderInfo = {
                "userId": userId,
                "productId": CurrentProduct.ProductID,
                "quantity": quantity,
                "paymentMethod": "COD",
                "name": PreOrderFormData.Name,
                "email": PreOrderFormData.Email,
                "phone": PreOrderFormData.Phone,
                "address": PreOrderFormData.Address
            }
            const response = await PreOrder(MemberToken, PreOrderInfo);
            if (response.data.PreorderID) {
                console.log("preorder sucess")
            }
        } catch (error) {

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
                // Handle localStorage cart for non-members
                let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

                // Check if the product is already in the cart
                const existingProductIndex = cart.findIndex(item => item.ProductID === ProductID);

                if (existingProductIndex !== -1) {
                    // If the product exists, update the quantity
                    cart[existingProductIndex].CartQuantity += quantity;
                } else {
                    // If the product doesn't exist, add it to the cart
                    cart.push({
                        ProductID: CurrentProduct.ProductID,
                        Name: CurrentProduct.Name,
                        Price: CurrentProduct.Price,
                        CartQuantity: quantity,
                    });
                }

                // Save the updated cart back to localStorage
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
        const wishlistItems = JSON.parse(localStorage.getItem("wishlist"));
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
                localStorage.setItem("wishlist", JSON.stringify(response.data));
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
                const response = await AddWishlist(MemberToken, userId, ProductID);
                console.log(response);
                if (response.data && response.data.ProductID === ProductID) {
                    toast.success('Added to wishlist', {
                        theme: "colored",
                    });
                    checkIsWishlistState();
                } else {
                    // If the response is not as expected, revert the state
                    setInWishlist(prevState => !prevState);
                    toast.error('Failed to add to wishlist', {
                        theme: "colored",
                    });
                }
            } else {
                setInWishlist(prevState => !prevState);
                const response = await RemoveWishlist(MemberToken, userId, ProductID);
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
                    userId: userId,
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
            const response = await getProductById(ProductID);
            console.log(response);
            setCurrentProduct(response.data.product);
        } catch (error) {

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

    const getImageSrc = (imageData) => {
        if (!imageData || !imageData.data) return '';

        try {
            const base64 = btoa(
                imageData.data.reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            return `data:image/jpeg;base64,${base64}`;
        } catch (error) {
            console.error('Error converting image data:', error);
            return '';
        }
    };

    return (
        <div className='body'>
            <div><Header isMember={isMember} /></div>
            <img className='image' src="/img/milkbuying.jpeg" />
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
                                    {PreOrderFormData.Name.length === 0 && <p className="pOinfo-error-message">*Please input name</p>}
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
                                    {PreOrderFormData.Email.length === 0 && <p className="pOinfo-error-message">*Please input name</p>}

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
                                    {PreOrderFormData.Phone.length === 0 && <p className="pOinfo-error-message">*Please input name</p>}

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
                                    {PreOrderFormData.Address.length === 0 && <p className="pOinfo-error-message">*Please input name</p>}
                                </form>
                            </div>
                            <a onClick={handlePreOrderAction} className="btn btn-block btn-lg btn-black-default-hover" data-bs-toggle="modal" data-bs-target="#modalAddcart">Submit Order</a>

                        </div>
                    </div>
                </Modal>
            )}
            {CurrentProduct ? (
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
                        <div className="product-details-content-area product-details--golden aos-init aos-animate detail-info" data-aos="fade-up" data-aos-delay="200">
                            <div className="product-details-text">
                                <h4 className="title">{CurrentProduct.Name}</h4>
                                <div className="price">{CurrentProduct.Price.toLocaleString()} VND</div>
                                <p>{CurrentProduct.Content}</p>
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
                                                data-bs-toggle="modal"
                                                data-bs-target="#modalAddcart"
                                            >
                                                Pre-Order
                                            </a>
                                        ) : (
                                            <a
                                                href="#"
                                                onClick={handleAddToCart}
                                                className="btn btn-block btn-lg btn-black-default-hover"
                                                data-bs-toggle="modal"
                                                data-bs-target="#modalAddcart"
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
                                    <li><a href="#">{CurrentProduct.BrandName}</a></li>
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
            ) : (
                <div><Page404 /></div>
            )
            };
            <div><Footer /></div>
        </div >
    );
}

export default ProductDetail;