import { useRef, useEffect, useState } from "react";
import { Oval } from 'react-loader-spinner';


import BlogCard from "./BlogCard";
import "./BlogList.css";
import { fetchBlogs } from "../../services/blog/blogService";
import { Link } from "react-router-dom";
const BlogList = ({ columnLayout = false }) => {
  const blogListRef = useRef(null);
  const blogs = [
    {
      title: "The Benefits of Drinking Milk",
      authorName: "John Doe",
      authorDescription: "Nutritionist and Blogger",
      authorImage: "https://via.placeholder.com/40",
    },
    {
      title: "Different Types of Milk and Their Uses",
      authorName: "Jane Smith",
      authorDescription: "Food Scientist and Writer",
      authorImage: "https://via.placeholder.com/40",
    },
    {
      title: "How Milk Can Help You Build Muscle",
      authorName: "Mark Johnson",
      authorDescription: "Fitness Expert and Author",
      authorImage: "https://via.placeholder.com/40",
    },
    {
      title: "“Another great review”",
      authorName: "Name",
      authorDescription: "Description",
      authorImage: "https://via.placeholder.com/40",
    },
    {
      title: "“A genuinely glowing review”",
      authorName: "Name",
      authorDescription: "Description",
      authorImage: "https://via.placeholder.com/40",
    },
    {
      title: "“Another great review”",
      authorName: "Name",
      authorDescription: "Description",
      authorImage: "https://via.placeholder.com/40",
    },
  ];
  const [blog, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollLeft = () => {
    blogListRef.current.scrollBy({ left: -525, behavior: "smooth" });
  };

  const scrollRight = () => {
    blogListRef.current.scrollBy({ left: 525, behavior: "smooth" });
  };

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setIsLoading(true);
        const fetchedBlogs = await fetchBlogs();
        console.log("1", fetchBlogs);
        if (Array.isArray(fetchedBlogs.data.data)) {
          setBlogs(fetchedBlogs.data.data);
        } else {
          throw new Error("Fetched data is not an array");
        }
      } catch (err) {
        setError(err.message);
        setBlogs(blogs);
        console.error("Error loading blogs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadBlogs();
  }, []);
  return (
    <div
      className={`blog-list-container ${columnLayout ? "column-layout" : ""}`}
    >
      <div className="blog-list-content">
        <h2>Suggested blogs</h2>
        <Link to="/Customer/Blogs">All Blog</Link>
      </div>
      <div className="blog-list-wrapper">
        <button className="scroll-button left" onClick={scrollLeft}>
          &lt;
        </button>
        <div className="blog-list" ref={blogListRef}>


          {isLoading ? (
            <Oval
              // height={20}
              // width={20}
              // color="#fff"
              wrapperStyle={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%'
              }}
            />
          ) : (

            <BlogCard blogs={blog} />
          )}
        </div>
        <button className="scroll-button right" onClick={scrollRight}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default BlogList;
