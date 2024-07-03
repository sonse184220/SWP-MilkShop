import React from "react";
import "./BlogPost.css";

const BlogPost = ({ blogs = [] }) => {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  return (
    <>
      {blogs.map((blog) => (
        <div className="blog-post" key={blog.BlogID}>
          <div className="blog-post-header">
            <h2>{blog.Title}</h2>
            <div>{formatDate(blog.updated)}</div>
          </div>
          <div className="blog-post-content">
            {/* <img src={`/img/${blog.BlogID}.png`} alt={blog.Name} /> */}
            <img src="https://via.placeholder.com/800x600" />
            <p>{blog.Content}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default BlogPost;
