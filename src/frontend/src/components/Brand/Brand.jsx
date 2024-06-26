import { useEffect, useState } from 'react';

import './Brand.css';
import { handleAllBrand } from '../../services/brand/getAllBrand';

function Brand({ onBrandClick, onSearch, setSearchInput }) {
    const [brands, setBrands] = useState([]);

    const handleSearchClick = (e) => {
        e.preventDefault();
        onSearch();
    }

    const GetAllBrand = async () => {
        try {
            const response = await handleAllBrand();
            console.log(response);
            setBrands(response.data)
        } catch (error) {
            console.error("Failed to fetch brands", error);
        }
    }

    useEffect(() => {
        GetAllBrand();
    }, []);

    return (
        <div className='brand-container'>
            <div className="sidebar-single-widget">
                <div>
                    <form onSubmit={handleSearchClick}>
                        <div className="search-container">
                            <input
                                type='text'
                                className='search'
                                placeholder='Search'
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <button type="submit" className="search-btn">
                                <i className="zmdi zmdi-search"></i>
                            </button>
                        </div>
                    </form>
                </div>
                <h6 className="sidebar-title">CATEGORIES</h6>
                <div className="sidebar-content">
                    <ul className="sidebar-menu">
                        <li><a onClick={() => onBrandClick(null)} href="#" >All Brands</a></li>
                        {
                            brands.map((brand) => (
                                <li key={brand.BrandID}><a onClick={() => onBrandClick(brand.BrandID)} href="#" >{brand.Name}</a></li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Brand;
