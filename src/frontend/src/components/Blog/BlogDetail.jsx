import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { blogDetail } from "../../services/blog/blogDetail"; // Adjust the path as per your structure
import "./BlogDetail.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import ProductList from "../Product/ProductList";
import BlogList from "./BlogList";

const BlogDetail = () => {
  const { BlogID } = useParams(); // Get the BlogID parameter from the URL
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogDetail(BlogID); // Use the BlogID from useParams
        setBlog(data);
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
      <img className="image" src="/img/P004.jpg" alt="Blog Header" />
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="blog-detail">
              <h1>{blog.Name}</h1>
              <div className="blog-meta">
                <span className="blog-date">
                  {new Date(blog.CreatedDate).toLocaleDateString()}
                </span>
                <span className="blog-author">{blog.StaffID}</span>
              </div>
              <div className="blog-detail-image">
                <img src={`/img/${blog.BlogID}.png`} />
              </div>

              <div className="blog-content">
                <p>{blog.Content}</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 blogDetail">
            <BlogList columnLayout />
          </div>
        </div>
      </div>
      <ProductList products={blog.products || []} />
      <Footer />
    </>
  );
};

export default BlogDetail;
