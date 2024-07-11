import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import he from 'he';
import ReactPaginate from 'react-paginate';


import Footer from "../Footer/Footer"
import Header from "../Header/Header"
import './AllProducts.css';
import Brand from '../Brand/Brand';
import handleGetAllProduct from '../../services/product/getAllProductService';
import GetProductByBrandID from '../../services/product/getProductByBrandID';
import { SearchProductByName } from '../../services/product/searchProductByName';
import { GetAvailableProduct } from '../../services/product/getAvailableProduct';

const AllProducts = ({ isMember }) => {
    const [products, setProducts] = useState([]);
    const [CurrentBrand, SetCurrentBrand] = useState(null);
    const [searchInput, setSearchInput] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

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
            // setIsLoading(true);
            const response = await GetProductByBrandID(BrandID);
            console.log(response);
            if (response.data.data.length > 0) {
                setProducts(response.data.data)
            } else if (response.data.data.length === 0) {
                GetAllProduct();
            }
        } catch (error) {

        } finally {
            // setIsLoading(false);
        }
    }

    const GetAllProduct = async () => {
        try {
            setIsLoading(true);
            let page = currentPage;
            let limit = 6;
            const response = await GetAvailableProduct(page, limit);

            if (response.data.totalProducts > 0) {
                setProducts(response.data.products);
                setPageCount(response.data.totalPages);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
    };

    useEffect(() => {
        GetAllProduct();
    }, [currentPage])

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
                        <div className="product-container">
                            {products.map((product) => (
                                <Link to={`/Customer/ProductDetail/${product.ProductID}`} key={product.ProductID} className="product-preview">
                                    <img src={`data:image/jpeg;base64,${product.Image}`} alt={product.Name} loading="lazy" />
                                    <h3>{product.Name}</h3>
                                    {/* <p>{product.Content}</p> */}
                                    {/* <p><ReactQuill
                                        value={product.Content}
                                        readOnly={true}
                                        theme="bubble"
                                    /></p> */}
                                    {/* <div dangerouslySetInnerHTML={{ __html: product.Content }}></div> */}
                                    {/* <div dangerouslySetInnerHTML={{ __html: product.Content }}></div> */}
                                    {/* <div dangerouslySetInnerHTML={{ __html: he.decode(product.Content) }}></div> */}
                                    {/* <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.Content) }} /> */}
                                    <p>{product.Price.toLocaleString()} VND</p>
                                </Link>
                            ))}
                        </div>
                    )}
                    <div className="pagination-container" style={{ marginTop: '20px' }}>

                        <ReactPaginate
                            breakLabel="..."
                            nextLabel="Next >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel="< Previous"
                            renderOnZeroPageCount={null}
                            containerClassName="pagination justify-content-center"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            activeClassName="active"
                        />
                    </div>
                </div>

            </div>
            <div><Footer /></div>
        </div>
    );
};

export default AllProducts;