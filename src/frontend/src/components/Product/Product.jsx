// ProductList.jsx
import React from 'react';
import './ProductList.css';

const ProductList = ({ products }) => {
  return (
    <div className="product-list-container">
      <h4>Related Products</h4>
      <div className="product-list d-flex flex-nowrap overflow-auto">
        {products.map((product, index) => (
          <a key={index} href={product.url} target="_blank" rel="noopener noreferrer" className="product-item card">
            <img className="card-img-top" src={product.image} alt={product.name} />
            <div className="card-body">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text">{product.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
