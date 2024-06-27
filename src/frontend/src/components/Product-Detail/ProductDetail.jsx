import './ProductDetail.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    const userId = sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')).UserID : "Guest";
    const MemberToken = 'Bearer ' + localStorage.getItem('token');

    const [feedbacks, setFeedbacks] = useState([])
    const [newFeedback, setNewFeedback] = useState({
        userId: userId,
        rating: 0,
        content: ''
    });
    const [inWishlist, setInWishlist] = useState(false);



    const handleAddToCart = async (e) => {
        e.preventDefault();
        try {
            if (isMember) {
                const MemberToken = 'Bearer ' + sessionStorage.getItem('token');
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
                let cart = JSON.parse(localStorage.getItem('cart')) || [];

                // Check if the product is already in the cart
                const existingProductIndex = cart.findIndex(item => item.ProductID === ProductID);

                if (existingProductIndex !== -1) {
                    // If the product exists, update the quantity
                    cart[existingProductIndex].CartQuantity += quantity;
                } else {
                    // If the product doesn't exist, add it to the cart
                    cart.push({
                        ProductID: CurrentProduct[0].ProductID,
                        Name: CurrentProduct[0].Name,
                        Price: CurrentProduct[0].Price,
                        CartQuantity: quantity,
                    });
                }

                // Save the updated cart back to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));

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

            const MemberToken = 'Bearer ' + sessionStorage.getItem('token');
            console.log("token======", MemberToken)
            if (!inWishlist) {
                setInWishlist(prevState => !prevState);
                const response = await AddWishlist(MemberToken, userId, ProductID);
                console.log(response);
                if (response.data && response.data[0].ProductID === ProductID) {
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
            const MemberToken = 'Bearer ' + sessionStorage.getItem('token');
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
            const MemberToken = 'Bearer ' + sessionStorage.getItem('token');
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
            const response = await GetFeedback(ProductID);
            console.log(response);
            setFeedbacks(response.data)
        } catch (error) {

        }
    }

    const handleGetProductByID = async () => {
        try {
            const response = await getProductById(ProductID);
            console.log(response);
            setCurrentProduct(response.data);
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


    useEffect(() => {
        handleGetProductByID();
        handleGetFeedback();
        handleGetWishlist();
        checkIsWishlistState();
    }, [])

    return (
        <div className='body'>
            <div><Header isMember={isMember} /></div>
            <img className='image' src="/img/milkbuying.jpeg" />
            {CurrentProduct ? (
                <div>
                    <ToastContainer style={{ top: '110px' }} />
                    <div className="product-detail">
                        <div className="detail-img">
                            <img src={`/img/${CurrentProduct[0].ProductID}.jpg`} />
                        </div>
                        <div className="product-details-content-area product-details--golden aos-init aos-animate detail-info" data-aos="fade-up" data-aos-delay="200">
                            <div className="product-details-text">
                                <h4 className="title">{CurrentProduct[0].Name}</h4>
                                <div className="price">{CurrentProduct[0].Price.toLocaleString()} VND</div>
                                <p>{CurrentProduct[0].Content}</p>
                            </div>
                            <div className="product-details-variable">
                                <h4 className="title">Available Options</h4>

                                <div className="variable-single-item">
                                    <div className="product-stock"> <span className="product-stock-in"><i className="zmdi zmdi-check-circle"></i></span> {CurrentProduct[0].Quantity} IN STOCK</div>
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
                                        <a href="#" onClick={handleAddToCart} className="btn btn-block btn-lg btn-black-default-hover" data-bs-toggle="modal" data-bs-target="#modalAddcart">+ Add To Cart</a>
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
                                    <li><a href="#">{CurrentProduct[0].BrandName}</a></li>
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
                    <div><ProductList products={products} /></div></div>
            ) : (
                <div><Page404 /></div>
            )
            };
            <div><Footer /></div>
        </div >
    );
}

export default ProductDetail;