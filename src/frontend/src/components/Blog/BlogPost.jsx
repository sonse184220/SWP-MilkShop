import React from "react";
import ReadMoreReact from 'react-read-more-read-less';
import ReactReadMoreReadLess from "react-read-more-read-less";
import { Link } from "react-router-dom";

import he from 'he';
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
  const SafeHTML = (html) => {
    const decodedHtml = he.decode(html);
    return <div dangerouslySetInnerHTML={{ __html: decodedHtml }} />;
  };

  const decodeContent = (content) => {
    if (!content) return '';
    // First, decode the HTML entities
    const decodedContent = he.decode(content);
    // Then, remove any HTML tags
    return decodedContent.replace(/<[^>]*>/g, '');
  };

  const truncateContent = (content, maxLength) => {
    const decodedContent = decodeContent(content);
    if (decodedContent.length <= maxLength) return decodedContent;
    return decodedContent.substr(0, maxLength) + '...';
  };

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

            <img src={`data:image/jpeg;base64,${blog.Image}`} />
            {/* <p>{blog.Content}</p> */}
            {/* <ReadMoreReact

              // text={blog.Content}
              // text={he.decode(blog.Content)}
              // text={SafeHTML(blog.Content)}
              text={blog.Content ? he.decode(blog.Content) : "No content available"}
              // min={100}
              ideal={200}
              max={300}
              readMoreText="Show More"
              readLessText="Show Less"
            /> */}
            {/* {blog.Content ? (
              <ReadMoreReact
                text={decodeContent(blog.Content)}
                min={80}  
                ideal={100} 
                max={200}
                readMoreText="Show More"
                readLessText="Show Less"
              />
            ) : (
              <p>No content available</p>
            )} */}
            {/* {blog.Content ? (
              <ReactReadMoreReadLess
                charLimit={200}
                readMoreText={"Read more ▼"}
                readLessText={"Read less ▲"}
                readMoreClassName="read-more-less--more"
                readLessClassName="read-more-less--less"
              >
                {decodeContent(blog.Content)}
              </ReactReadMoreReadLess>
            ) : (
              <p>No content available</p>
            )} */}
            {blog.Content ? (
              <>
                <p>{truncateContent(blog.Content, 200)}</p>
                {blog.Content.length > 200 && (
                  <Link to={`/Customer/BlogDetail/${blog.BlogID}`} className="read-more-link">
                    Show more
                  </Link>
                )}
              </>
            ) : (
              <p>No content available</p>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default BlogPost;
