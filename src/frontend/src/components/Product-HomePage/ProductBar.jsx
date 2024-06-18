import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import './ProductBar.css';
import handleGetAllProduct from '../../services/product/getAllProductService';

const ProductBar = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(1);
    const [products, setProducts] = useState([]);

    const GetAllProduct = async () => {
        try {
            const response = await handleGetAllProduct();
            console.log(response);
            const slicedProducts = response.data.slice(0, 12); // Get only the first 12 elements
            setProducts(slicedProducts);
        } catch (error) {

        }
    }

    useEffect(() => {
        GetAllProduct();
    }, [])



    const numSlides = Math.ceil(products.length / 6);
    const intervalRef = useRef(null);

    //chuyển qua lại giữa hiển thị 6 product đầu và 6 product sau
    useEffect(() => {
        const handleSlideUpdate = () => {
            setCurrentSlide((prevSlide) => {
                if (prevSlide >= 0 || prevSlide <= numSlides - 1) {
                    setDirection(1); // Change direction to forward
                } else if (prevSlide === numSlides - 1) {
                    setDirection(-1); // Change direction to backward
                }
                const newSlide = prevSlide + direction;
                if (newSlide < 0) {
                    return numSlides - 1; // Wrap around to the last slide
                } else if (newSlide > numSlides - 1) {
                    return 0; // Wrap around to the first slide
                }
                return newSlide;
            });
        };

        intervalRef.current = setInterval(handleSlideUpdate, 4000);

        return () => clearInterval(intervalRef.current);
    }, [numSlides]);

    //chuyển qua lại giữa hiển thị 6 product đầu và 6 product sau
    const productSlide = products.slice(currentSlide * 6, (currentSlide + 1) * 6);

    return (
        <div className="product-bar">
            <div className='header'>
                <h2 className='title'>Products</h2>
                <Link to={"/Products"} className="view-all">
                    View all
                </Link>
            </div>
            <div className="product-container" >
                {productSlide.map((product) => (
                    <Link to={`/ProductDetail/${product.ProductID}`} key={product.ProductID} className="product-preview">
                        <img src={`/img/${product.ProductID}.jpg`} alt={product.Name} />
                        <h3>{product.Name}</h3>
                        <p>{product.Content}</p>
                        <p>{product.Price}</p>
                    </Link>
                ))}
            </div>
        </div >
    );
};

export default ProductBar;