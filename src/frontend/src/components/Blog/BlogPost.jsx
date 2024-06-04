import React from 'react';
import './BlogPost.css';
import ProductList from '../Product/ProductList';

const BlogPost = ({ title, author, content, date, image, products }) => {
  return (
    <div className="blog-post">
      <div className="blog-post-header">
        <h2>{title}</h2>
        <div className="blog-post-author">
          <img src={author.image} alt={author.name} />
          <div>
            <h3>{author.name}</h3>
            <p>{author.bio}</p>
          </div>
        </div>
      </div>
      <div className="blog-post-content">
        {image && <img src={image} alt={title} />}
        <p>{content}</p>
      </div>
      <div className="blog-post-footer">
        <p>Published on {date.toLocaleDateString()}</p>
      </div>
      {products && <ProductList products={products} />}
    </div>
  );
};

export default BlogPost;
