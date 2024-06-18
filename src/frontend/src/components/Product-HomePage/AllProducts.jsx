import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Footer from "../Footer/Footer"
import Header from "../Header/Header"
import './AllProducts.css';
import Brand from '../Brand/Brand';
import handleGetAllProduct from '../../services/product/getAllProductService';
import GetProductByBrandID from '../../services/product/getProductByBrandID';
import { SearchProductByName } from '../../services/product/searchProductByName';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [CurrentBrand, SetCurrentBrand] = useState(null);
    const [searchInput, setSearchInput] = useState();

    const handleSearchProductByName = async () => {
        try {
            const response = await SearchProductByName(searchInput);
            console.log("================", response);
            setProducts(response.data.data)
        } catch (error) {

        }
    }

    const handleBrandClick = async (BrandID) => {
        // SetCurrentBrand(BrandID);
        try {
            const response = await GetProductByBrandID(BrandID);
            console.log(response);
            if (response.data.data.length > 0) {
                setProducts(response.data.data)
            } else if (response.data.data.length === 0) {
                GetAllProduct();
            }
        } catch (error) {

        }
    }

    const GetAllProduct = async () => {
        try {
            const response = await handleGetAllProduct();
            console.log(response);
            setProducts(response.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        GetAllProduct();
        handleBrandClick();
    }, [])

    return (
        <div className="body">
            <div><Header /></div>
            <img className='image' src="/img/P004.jpg" />
            <div className='brand-product'>
                <div className='brand-bar'><Brand onBrandClick={handleBrandClick} onSearch={handleSearchProductByName} setSearchInput={setSearchInput} /></div>

                <div className="product-bar">
                    <div className='header'>
                        <h2 className='title'>Products</h2>
                    </div>
                    <div className="product-container">
                        {products.map((product) => (
                            <Link to={`/ProductDetail/${product.ProductID}`} key={product.ProductID} className="product-preview">
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