import React from 'react';
import './BlogPost.css';
import ProductList from '../Product/ProductList';

const BlogPost = ({  blogs = []  }) => {
  return (
    <>
      {blogs.map((blog) => (
        <div className="blog-post">
          <div className="blog-post-header">
            <h2>{blog.Name}</h2>
          </div>
          <div className="blog-post-content">
            <img src={`/img/${blog.BlogID}.png`} />
            <p>{blog.Content}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default BlogPost;
