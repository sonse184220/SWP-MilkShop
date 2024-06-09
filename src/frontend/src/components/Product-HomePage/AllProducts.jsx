import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Footer from "../Footer/Footer"
import Header from "../Header/Header"
import './AllProducts.css';
import Brand from '../Brand/Brand';
import handleGetAllProduct from '../../services/getAllProductService';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [CurrentBrand, SetCurrentBrand] = useState(null);

    const handleBrandClick = (BrandID) => {
        SetCurrentBrand(BrandID);
    }

    const filteredProducts = CurrentBrand
        ? products.filter(product => product.BrandID === CurrentBrand)
        : products;

    const GetAllProduct = async () => {
        try {
            const response = await handleGetAllProduct();
            console.log(response);
            setProducts(response.data);
        } catch (error) {

        }
    }

    useEffect(() => {
        GetAllProduct();
    }, [])

    return (
        <div className="body">
            <div><Header /></div>
            <img class='image' src="/img/P004.jpg" />
            <div className='brand-product'>
                <div className='brand-bar'><Brand onBrandClick={handleBrandClick} /></div>

                <div className="product-bar">
                    <div className='header'>
                        <h2 className='title'>Products</h2>
                    </div>
                    <div className="product-container">
                        {filteredProducts.map((product) => (
                            <Link key={product.ProductID} className="product-preview">
                                <img src={`/img/${product.ProductID}.jpg`} alt={product.Name} />
                                <h3>{product.Name}</h3>
                                <p>{product.Content}</p>
                                <p>{product.Price}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <div><Footer /></div>
        </div>
    );
};

export default AllProducts;