import { useEffect, useState } from 'react';

import './Brand.css';
import { handleAllBrand } from '../../services/getAllBrand';

function Brand({ onBrandClick }) {
    const [brands, setBrands] = useState([]);

    const GetAllBrand = async () => {
        try {
            const response = await handleAllBrand();
            console.log(response);
            setBrands(response.data)
        } catch (error) {

        }
    }

    useEffect(() => {
        GetAllBrand();
    }, []);

    return (
        <div className='brand-container'>
            < div class="sidebar-single-widget" >
                <div>
                    <form>
                        <div className="search-container">
                            <input
                                type='text'
                                className='search'
                                placeholder='Search'
                            />
                            <button type="submit" className="search-btn">
                                <i className="zmdi zmdi-search"></i>
                            </button>
                        </div>
                    </form>
                </div>
                <h6 class="sidebar-title">CATEGORIES</h6>
                <div class="sidebar-content">
                    <ul class="sidebar-menu">
                        <li><a onClick={() => onBrandClick(null)} href="#" >All Brands</a></li>
                        {brands.map((brand) => (
                            <li><a key={brand.BrandID} onClick={() => onBrandClick(brand.BrandID)} href="#" >{brand.Name}</a></li>
                        ))}
                    </ul>
                </div>

            </div>
        </div >
    );
}

export default Brand;