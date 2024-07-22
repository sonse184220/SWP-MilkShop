import { useEffect, useState } from 'react';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import './Brand.css';
import { handleAllBrand } from '../../services/brand/getAllBrand';

function Brand({ onBrandClick, onSearch, setSearchInput, sort, setSort, handleChange, onBestSellerToggle, handleGetBestSellers, activeBrandId }) {
    const [brands, setBrands] = useState([]);
    const [isBestSeller, setIsBestSeller] = useState(false);

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

    const handleBestSellerToggle = (event) => {
        setIsBestSeller(event.target.checked);
        onBestSellerToggle(event.target.checked);
    };

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
                {/* <div>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox
                            checked={isBestSeller}
                            onChange={handleBestSellerToggle} />} label="Best Sellers" />
                        <FormControlLabel required control={<Checkbox />} label="Required" />
                        <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
                    </FormGroup>
                </div> */}
                <div>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small-label">Sort</InputLabel>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={sort}
                            label="Age"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={'under500k'}>{'< 500.000đ'}</MenuItem>
                            <MenuItem value={'500kTo1m'}>{'500.000đ - 1.000.000đ'}</MenuItem>
                            <MenuItem value={'over1m'}>{'> 1.000.000đ'}</MenuItem>
                        </Select>
                        <FormHelperText>Sort by products price</FormHelperText>
                    </FormControl>

                </div>
                <h6 className="sidebar-title">CATEGORIES</h6>
                <div className="sidebar-content">
                    <ul className="sidebar-menu">
                        <li ><a className={activeBrandId === 'BestSellers' ? 'active' : ''} onClick={(e) => {
                            e.preventDefault();
                            // handleGetBestSellers();
                            onBrandClick('BestSellers')
                        }} href="#" >Best Sellers</a></li>
                        <li><a
                            className={activeBrandId === null ? 'active' : ''}
                            // className='active'
                            onClick={() => onBrandClick(null)} href="#" >All Brands</a></li>
                        {
                            brands.map((brand) => (
                                <li key={brand.BrandID}>
                                    <a
                                        // className='active'
                                        className={activeBrandId === brand.BrandID ? 'active' : ''}
                                        onClick={(e) => { e.preventDefault(); onBrandClick(brand.BrandID) }} href="" >{brand.Name}</a></li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div >
    );
}

export default Brand;
