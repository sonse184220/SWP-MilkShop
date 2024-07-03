import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Footer from "../Footer/Footer"
import Header from "../Header/Header"
import './AllProducts.css';
import Brand from '../Brand/Brand';
import handleGetAllProduct from '../../services/product/getAllProductService';
import GetProductByBrandID from '../../services/product/getProductByBrandID';
import { SearchProductByName } from '../../services/product/searchProductByName';

const AllProducts = ({ isMember }) => {
    const [products, setProducts] = useState([]);
    const [CurrentBrand, SetCurrentBrand] = useState(null);
    const [searchInput, setSearchInput] = useState();

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
            <div><Header isMember={isMember} /></div>
            <img className='image' src="/img/milkbuying.jpeg" />
            <div className='brand-product'>
                <div className='brand-bar'><Brand onBrandClick={handleBrandClick} onSearch={handleSearchProductByName} setSearchInput={setSearchInput} /></div>

                <div className="product-bar">
                    <div className='header'>
                        <h2 className='title'>Products</h2>
                    </div>
                    <div className="product-container">
                        {products.map((product) => (
                            <Link to={`/Customer/ProductDetail/${product.ProductID}`} key={product.ProductID} className="product-preview">
                                <img src={`${getImageSrc(product.Image)}`} alt={product.Name} />
                                <h3>{product.Name}</h3>
                                <p>{product.Content}</p>
                                <p>{product.Price.toLocaleString()} VND</p>
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