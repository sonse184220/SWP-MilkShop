import './ProductDetail.css'

import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import ProductList from '../Product/ProductList';
import Feedback from '../Feedback/Feedback';
import { useEffect, useState } from 'react';
import getProductById from '../../services/getProductByID';
import Page404 from '../404NotFound/404Page';
import { useParams } from 'react-router-dom';
import GetFeedback from '../../services/getFeedback';
import AddFeedback from '../../services/addNewFeedback';
import { AddWishlist } from '../../services/addWishlist';
import { GetWishlist } from '../../services/getAllWishlist';
import { RemoveWishlist } from '../../services/removeWishlish';


const ProductDetail = () => {
    const { ProductID } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [CurrentProduct, setCurrentProduct] = useState(null);
    const [feedbacks, setFeedbacks] = useState([])
    const [newFeedback, setNewFeedback] = useState({
        userId: JSON.parse(localStorage.getItem('userData')).UserID,
        rating: 0,
        content: ''
    });
    const [inWishlist, setInWishlist] = useState(false);

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

    const checkIsWishlistState = () => {
        const wishlistItems = JSON.parse(localStorage.getItem("wishlist"));
        const matchItem = wishlistItems.find(product => product.ProductID === ProductID);
        setInWishlist(!!matchItem);
    }

    const handleGetWishlist = async () => {
        try {
            const response = await GetWishlist(JSON.parse(localStorage.getItem("userData")).UserID);
            if (response.data) {
                console.log(response.data);
                localStorage.setItem("wishlist", JSON.stringify(response.data));
            }
        } catch (error) {

        }
    }

    const handleAddRemoveWishList = async (e) => {
        try {
            e.preventDefault();


            if (!inWishlist) {
                setInWishlist(prevState => !prevState);
                const response = await AddWishlist(JSON.parse(localStorage.getItem("userData")).UserID, ProductID);
                console.log(response);
                if (response.data && response.data[0].ProductID === ProductID) {
                    showWishlistMessage();
                } else {
                    // If the response is not as expected, revert the state
                    setInWishlist(prevState => !prevState);
                }
            } else {
                setInWishlist(prevState => !prevState);
                const response = await RemoveWishlist(JSON.parse(localStorage.getItem("userData")).UserID, ProductID);
                console.log(response.data.msg);
                if (response.data.msg)
                    showWishlistMessage();
                else if (response.data.error)
                    setInWishlist(prevState => !prevState);
            }
        } catch (error) {

        }
    }

    const handleAddFeedback = async () => {
        try {
            const response = await AddFeedback(ProductID, newFeedback);
            console.log(response);
        } catch (error) {
            console.log(error)
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

    const handleIncrement = (step = 1) => {
        setQuantity(prevQuantity => prevQuantity + step);
    };

    const handleDecrement = (step = 1) => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - step);
        }
    };

    const showWishlistMessage = () => {
        const message = document.getElementById('wishlistMessage');
        message.style.display = 'block';
        setTimeout(() => {
            message.style.display = 'none';
        }, 3000); // Hide after 3 seconds
    };

    const add = (e) => {
        e.preventDefault();
        setInWishlist(true);
    };

    const remove = (e) => {
        e.preventDefault();
        setInWishlist(false);
    };

    useEffect(() => {
        handleGetProductByID();
        handleGetFeedback();
        handleGetWishlist();
        checkIsWishlistState();
    })

    return (
        <div className='body'>
            <div><Header /></div>
            <img className='image' src="/img/P004.jpg" />
            {CurrentProduct ? (
                <div>
                    <div id="wishlistMessage" className="wishlist-message">
                        {inWishlist ? 'Added to wishlist' : 'Removed from wishlist'}
                    </div>
                    <div className="product-detail">
                        <div className="detail-img">
                            <img src={`/img/${CurrentProduct[0].ProductID}.jpg`} />
                        </div>
                        <div className="product-details-content-area product-details--golden aos-init aos-animate detail-info" data-aos="fade-up" data-aos-delay="200">
                            <div className="product-details-text">
                                <h4 className="title">{CurrentProduct[0].Name}</h4>
                                <div className="price">{CurrentProduct[0].Price}</div>
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
                                        <a href="#" className="btn btn-block btn-lg btn-black-default-hover" data-bs-toggle="modal" data-bs-target="#modalAddcart">+ Add To Cart</a>
                                    </div>
                                </div>

                                <div className="product-details-meta mb-20">
                                    <a href="" onClick={handleAddRemoveWishList} className="icon-space-right"><i className={`zmdi ${inWishlist ? 'zmdi-favorite' : 'zmdi-favorite-outline'}`}></i>{inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}</a>
                                    <a href="compare.html" className="icon-space-right"><i className="zmdi zmdi-refresh"></i>Compare</a>
                                </div>
                            </div>
                            <div className="product-details-catagory mb-2">
                                <span className="title">CATEGORIES:</span>
                                <ul>
                                    <li><a href="#">BAR STOOL</a></li>
                                    <li><a href="#">KITCHEN UTENSILS</a></li>
                                    <li><a href="#">TENNIS</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='feedback'>
                        <Feedback
                            feedbacks={feedbacks}
                            onAddFeedback={handleAddFeedback}
                            newFeedback={newFeedback}
                            setNewFeedback={setNewFeedback} /></div>
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