import './ProductDetail.css'

import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import ProductList from '../Product/ProductList';
import Feedback from '../Feedback/Feedback';
import { useState } from 'react';

const ProductDetail = () => {
    const [quantity, setQuantity] = useState(1);

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

    const handleIncrement = (step = 1) => {
        setQuantity(prevQuantity => prevQuantity + step);
    };

    const handleDecrement = (step = 1) => {
        if (quantity > 1) {
            setQuantity(prevQuantity => prevQuantity - step);
        }
    };

    return (
        <div className='body'>
            <div><Header /></div>
            <img class='image' src="/img/P004.jpg" />
            <div className="product-detail">
                <div className="detail-img">
                    <img src="/img/P005.jpg" />
                </div>
                <div class="product-details-content-area product-details--golden aos-init aos-animate detail-info" data-aos="fade-up" data-aos-delay="200">
                    <div class="product-details-text">
                        <h4 class="title">Milk</h4>
                        <div class="price">$80.00</div>
                        <p>Milk contains high-quality protein and is a great post-workout recovery drink. Learn how it can help you build and repair muscle tissue.</p>
                    </div>
                    <div class="product-details-variable">
                        <h4 class="title">Available Options</h4>

                        <div class="variable-single-item">
                            <div class="product-stock"> <span class="product-stock-in"><i class="ion-checkmark-circled"></i></span> 200 IN STOCK</div>
                        </div>

                        <div class="d-flex align-items-center ">
                            <div class="variable-single-item ">
                                <span>Quantity</span>
                                <div class="product-variable-quantity">
                                    <input min="1" max="100" value={quantity} type="number"
                                        onChange={e => setQuantity(parseInt(e.target.value))}
                                        onIncrement={handleIncrement}
                                        onDecrement={handleDecrement} />
                                </div>
                            </div>

                            <div class="product-add-to-cart-btn">
                                <a href="#" class="btn btn-block btn-lg btn-black-default-hover" data-bs-toggle="modal" data-bs-target="#modalAddcart">+ Add To Cart</a>
                            </div>
                        </div>

                        <div class="product-details-meta mb-20">
                            <a href="wishlist.html" class="icon-space-right"><i class="icon-heart"></i>Add to wishlist</a>
                            <a href="compare.html" class="icon-space-right"><i class="icon-refresh"></i>Compare</a>
                        </div>
                    </div>
                    <div class="product-details-catagory mb-2">
                        <span class="title">CATEGORIES:</span>
                        <ul>
                            <li><a href="#">BAR STOOL</a></li>
                            <li><a href="#">KITCHEN UTENSILS</a></li>
                            <li><a href="#">TENNIS</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='feedback'><Feedback /></div>
            <div><ProductList products={products} /></div>
            <div><Footer /></div>
        </div>
    );
}

export default ProductDetail;