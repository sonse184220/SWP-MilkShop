import React from "react";
import { Link } from "react-router-dom";
import "./ProductList.css";

const ProductList = ({ products = [] }) => {
  return (
    <div className="product-list-container">
      <h4>Related Products</h4>
      <div className="product-list d-flex flex-nowrap overflow-auto">
        {products.map((product, index) => (
          <Link
            key={index}
            to={`/Customer/ProductDetail/${product.ProductID}`} // Adjust the URL structure as needed
            className="product-item card"
          >
            <img
              className="card-img-top"
              src={product.image}
              alt={product.name}
            />
            <div className="card-body">
              <h5 className="card-title">{product.Name}</h5>
              <p>{product.Price.toLocaleString()} VND</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
