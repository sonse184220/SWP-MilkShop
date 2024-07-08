import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Oval } from 'react-loader-spinner';


import './ProductBar.css';
import handleGetAllProduct from '../../services/product/getAllProductService';

const ProductBar = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(1);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const GetAllProduct = async () => {
        try {
            setIsLoading(true);
            const response = await handleGetAllProduct();
            console.log(response);
            const slicedProducts = response.data.products.slice(0, 9); // Get only the first 12 elements
            setProducts(slicedProducts);
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        GetAllProduct();
    }, [])

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 6,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            }
        ]
    };

    return (
        <div className="product-bar">
            <div className='header'>
                <h2 className='title'>Products</h2>
                <Link to={"/Customer/Products"} className="view-all">
                    View all
                </Link>
            </div>
            {isLoading ? (
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
            ) : (
                <div className="" >
                    <Slider {...settings}>
                        {products.map((product) => (
                            <div key={product.ProductID} className="product-slide">
                                <Link to={`/Customer/ProductDetail/${product.ProductID}`} className="product-preview">
                                    <img src={`data:image/jpeg;base64,${product.Image}`} alt={product.Name} />
                                    <h3>{product.Name}</h3>
                                    {/* <p>{product.Content}</p> */}
                                    <p>{product.Price.toLocaleString()} VND</p>
                                </Link>
                            </div>
                        ))}
                    </Slider>
                </div>
            )}
        </div >
    );
};

export default ProductBar;