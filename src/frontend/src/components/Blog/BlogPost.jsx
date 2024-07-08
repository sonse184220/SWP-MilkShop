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

  const getImageSrc = (imageData) => {
    if (!imageData) return '';

    // Check if the imageData is already a base64 string
    if (typeof imageData === 'string' && imageData.startsWith('/9j/')) {
      return `data:image/jpeg;base64,${imageData}`;
    }

    // If it's not a string, assume it's the old format and convert it
    if (imageData.data) {
      try {
        const base64 = btoa(
          imageData.data.reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        return `data:image/jpeg;base64,${base64}`;
      } catch (error) {
        console.error('Error converting image data:', error);
        return '';
      }
    }

    return '';
  };

  // const getImageSrc = (imageData) => {
  //   if (!imageData || !imageData.data) return '';

  //   try {
  //     const base64 = btoa(
  //       imageData.data.reduce((data, byte) => data + String.fromCharCode(byte), '')
  //     );
  //     return `data:image/jpeg;base64,${base64}`;
  //   } catch (error) {
  //     console.error('Error converting image data:', error);
  //     return '';
  //   }
  // };

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
            <p>{blog.Content}</p>
            <img src={`data:image/jpeg;base64,${blog.Image}`} />

          </div>
        </div>
      ))}
    </>
  );
};

export default BlogPost;
