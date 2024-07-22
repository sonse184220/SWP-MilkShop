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
import { GetBestSellers } from '../../services/product/getBestSellers';

const AllProducts = ({ isMember }) => {
    const [products, setProducts] = useState([]);
    const [originProduct, setOriginProduct] = useState([]);
    const [CurrentBrand, SetCurrentBrand] = useState(null);
    const [searchInput, setSearchInput] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentBrandId, setCurrentBrandId] = useState(null);

    const [sort, setSort] = React.useState('');

    const handleChange = (event) => {
        // setSort(event.target.value);
        setSort(event.target.value);
        handleSort(event.target.value);
    };

    const handleSearchProductByName = async () => {
        try {
            setIsLoading(true);
            if (searchInput.length === 0) {
                handleBrandClick(null);
                GetAllProduct(currentBrandId);
                return;
            }
            const response = await SearchProductByName(searchInput);
            // console.log("================", response);
            setProducts(applySort(response.data.data))
            setOriginProduct(response.data.data);
            setPageCount(1);
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }

    const handleBrandClick = async (brandId) => {
        setCurrentBrandId(brandId);
        setCurrentPage(1);
    };

    // const handleBrandClick = async (BrandID) => {
    //     try {
    //         const response = await GetProductByBrandID(BrandID);
    //         console.log(response);
    //         if (response.data.data.length > 0) {
    //             setProducts(applySort(response.data.data))
    //             setOriginProduct(response.data.data)
    //             setPageCount(totalPages);
    //         } else if (response.data.data.length === 0) {
    //             GetAllProduct();
    //         }
    //     } catch (error) {

    //     } finally {
    //     }
    // }

    const GetAllProduct = async (brandId) => {
        setIsLoading(true);
        try {
            let page = currentPage;
            let limit = 6;
            let response;
            if (brandId) {
                if (brandId === 'BestSellers') {
                    await handleGetBestSellers();
                } else {
                    response = await GetProductByBrandID(brandId, page, limit, 'newest');
                    setProducts(applySort(response.data.data));
                    setOriginProduct(response.data.data);
                }



            } else {
                response = await GetAvailableProduct(page, limit);

                setProducts(applySort(response.data.products));
                setOriginProduct(response.data.products);

            }

            // setProducts(applySort(response.data.products) || applySort(response.data.data));
            // setOriginProduct(response.data.products || response.data.data);
            setPageCount(response.data.totalPages);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // const GetAllProduct = async () => {
    //     try {
    //         setIsLoading(true);
    //         let page = currentPage;
    //         let limit = 6;
    //         const response = await GetAvailableProduct(page, limit);

    //         if (response.data.totalProducts > 0) {
    //             setProducts(applySort(response.data.products));
    //             setOriginProduct(response.data.products);
    //             setPageCount(response.data.totalPages);
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
    };

    const handleGetBestSellers = async () => {
        // setIsLoading(true);
        try {

            const response = await GetBestSellers();
            if (response.data && response.data.length > 0) {
                setProducts(applySort(response.data));
                setOriginProduct(response.data);
                setPageCount(1);
                // setIsLoading(false);
            }
        } catch (error) {
            console.error("Failed to fetch best sellers", error);
        } finally {
            // setIsLoading(false);
        }
    }

    const handleBestSellerToggle = (isBestSeller) => {
        if (isBestSeller) {
            handleGetBestSellers();
        } else {
            GetAllProduct(currentBrandId);
        }
    }

    const applySort = (productsToSort) => {
        let sortedProducts = [...productsToSort];
        switch (sort) {
            case 'under500k':
                return sortedProducts.filter(product => product.Price < 500000);
            case '500kTo1m':
                return sortedProducts.filter(product => product.Price >= 500000 && product.Price <= 1000000);
            case 'over1m':
                return sortedProducts.filter(product => product.Price > 1000000);
            default:
                return sortedProducts;
        }
    };

    const handleSort = (sortValue) => {
        // GetAllProduct(currentBrandId).then(() => {
        let sortedProducts = [...originProduct];
        switch (sortValue) {
            case 'under500k':
                sortedProducts = sortedProducts.filter(product => product.Price < 500000);
                break;
            case '500kTo1m':
                sortedProducts = sortedProducts.filter(product => product.Price >= 500000 && product.Price <= 1000000);
                break;
            case 'over1m':
                sortedProducts = sortedProducts.filter(product => product.Price > 1000000);
                break;
            default:
                // sortedProducts = [...originProduct];
                break;
        }
        setProducts(sortedProducts);
        // });
    }

    // useEffect(() => {
    //     GetAllProduct();
    // }, [currentPage])

    useEffect(() => {
        GetAllProduct(currentBrandId);
    }, [currentPage, currentBrandId]);

    useEffect(() => {
        // GetAllProduct(currentBrandId);
        // handleBrandClick();
    }, []);

    return (
        <div className="body">
            <div><Header isMember={isMember} /></div>
            <img className='image' src="/img/pinkbg.jpg" />
            <div className='brand-product'>
                <div className='brand-bar'>
                    <Brand
                        onBrandClick={handleBrandClick}
                        onSearch={handleSearchProductByName}
                        setSearchInput={setSearchInput}
                        sort={sort}
                        setSort={setSort}
                        handleChange={handleChange}
                        onBestSellerToggle={handleBestSellerToggle}
                        handleGetBestSellers={handleGetBestSellers}
                        activeBrandId={currentBrandId}
                    />
                </div>

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
                    ) : ((products.length === 0) ? (
                        <h3>No Products Found</h3>
                    ) : (
                        <>
                            <div className='widthtest' style={{ height: '81%' }}>
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
                            </div>
                            <div className="pagination-container" style={{ marginTop: '20px' }}>

                                <ReactPaginate
                                    breakLabel="..."
                                    nextLabel="Next >"
                                    forcePage={currentPage - 1}
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
                        </>
                    )
                    )}

                </div>


            </div>
            <div><Footer /></div>
        </div>
    );
};

export default AllProducts;