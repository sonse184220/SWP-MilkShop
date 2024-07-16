import React, { useEffect, useState } from "react";
import he from "he";
import ReactReadMoreReadLess from "react-read-more-read-less";
import { useParams } from "react-router-dom";
import { blogDetail } from "../../services/blog/blogDetail"; // Adjust the path as per your structure
import "./BlogDetail.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import ProductList from "../Product/ProductList";
import BlogList from "./BlogList";

const BlogDetail = ({ isMember }) => {
  const { BlogID } = useParams(); // Get the BlogID parameter from the URL
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [relatedProduct, setRelatedProduct] = useState([]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  const decodeContent = (content) => {
    if (!content) return "";
    // First, decode the HTML entities
    const decodedContent = he.decode(content);
    // Then, remove any HTML tags
    return decodedContent.replace(/<[^>]*>/g, "");
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogDetail(BlogID); // Use the BlogID from useParams
        setBlog(data.blog);
        setRelatedProduct(data.blogProducts);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBlog();
  }, [BlogID]);

  if (error) return <div>Error: {error}</div>;
  if (!blog) return <div>Loading...</div>; // Add a loading state

  return (
    <>
      <img className="image" src="/img/pinkbg.jpg" alt="Blog Header" />
      <Header isMember={isMember} />
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="blog-detail">
              <h1>{blog.Title}</h1>
              <div className="blog-meta">
                <span className="blog-author">{blog.Author}</span>
                <span className="blog-date">{formatDate(blog.updated)}</span>
              </div>
              <div className="blog-detail-image">
                <img src={`data:image/jpeg;base64,${blog.Image}`} />
              </div>
              <div className="blog-content">
                {/* <p>{blog.Content}</p> */}
                {/* <div dangerouslySetInnerHTML={{ __html: he.decode(blog.Content) }}></div> */}
                {/* <>
                  <ReactReadMoreReadLess
                    charLimit={200}
                    readMoreText={"Read more ▼"}
                    readLessText={"Read less ▲"}
                    readMoreClassName="read-more-less--more"
                    readLessClassName="read-more-less--less"
                  >
                    {decodeContent(blog.Content)}
                  </ReactReadMoreReadLess>
                </> */}
                <div
                  dangerouslySetInnerHTML={{ __html: he.decode(blog.Content) }}
                ></div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 blogDetail">
            <BlogList columnLayout />
          </div>
        </div>
      </div>
      {relatedProduct.length > 0 && (
        <ProductList products={relatedProduct || []} />
      )}
      <Footer />
    </>
  );
};

export default BlogDetail;
