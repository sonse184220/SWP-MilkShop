import React from 'react';
import './ProductBar.css';

const ProductBar = () => {
    //List dể ví dụ cho thanh product bar
    const products = [
        {
            id: 1,
            imageUrl: 'https://example.com/pears.jpg',
            name: 'Product',
            description: 'Description of first product',
            price: '$10.99',
        },
        {
            id: 2,
            imageUrl: 'https://example.com/chili-peppers.jpg',
            name: 'Product',
            description: 'Description of second product',
            price: '$10.99',
        },
        {
            id: 3,
            imageUrl: 'https://example.com/tomatoes.jpg',
            name: 'Product',
            description: 'Description of third product',
            price: '$10.99',
        },
        {
            id: 4,
            imageUrl: 'https://example.com/mushrooms.jpg',
            name: 'Product',
            description: 'Description of fourth product',
            price: '$10.99',
        },
        {
            id: 5,
            imageUrl: 'https://example.com/eggplant.jpg',
            name: 'Product',
            description: 'Description of fifth product',
            price: '$10.99',
        },
        {
            id: 6,
            imageUrl: 'https://example.com/persimmons.jpg',
            name: 'Product',
            description: 'Description of sixth product',
            price: '$10.99',
        },
    ];

    return (
        <div className="product-bar">
            <div className='header'>
                <h2>Products</h2>
                <a href="#" className="view-all">
                    View all
                </a>
            </div>
            <div className="product-container">
                {products.map((product) => (
                    <div key={product.id} className="product-preview">
                        <img src={`/img/${product.id}.jpg`} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>{product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductBar;