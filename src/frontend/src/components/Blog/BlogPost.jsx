import React from "react";
import "./BlogPost.css";

const BlogPost = ({ blogs = [] }) => {
  return (
    <>
      {blogs.map((blog) => (
        <div className="blog-post" key={blog.BlogID}>
          <div className="blog-post-header">
            <h2>{blog.Name}</h2>
          </div>
          <div className="blog-post-content">
            <img src={`/img/${blog.BlogID}.png`} alt={blog.Name} />
            <p>{blog.Content}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default BlogPost;
