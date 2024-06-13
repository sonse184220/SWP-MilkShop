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

    const handleDeleteFeedback = () => {

    }
    const handleAddFeedback = async () => {
        try {
            const response = await AddFeedback(ProductID, newFeedback);
            console.log("===========", response);
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

    useEffect(() => {
        handleGetProductByID();
        handleGetFeedback();
    }, [])

    return (
        <div className='body'>
            <div><Header /></div>
            <img className='image' src="/img/P004.jpg" />
            {CurrentProduct ? (
                <div><div className="product-detail">
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
                                <a href="wishlist.html" className="icon-space-right"><i className="zmdi zmdi-favorite"></i>Add to wishlist</a>
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