import { useRef, useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import BlogCard from "./BlogCard";
import "./BlogList.css";
import { fetchBlogs } from "../../services/blog/blogService";
import { Link } from "react-router-dom";

const BlogList = ({ columnLayout = false }) => {
  const blogListRef = useRef(null);
  const [blog, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoScroll, setAutoScroll] = useState(!columnLayout);

  const scrollLeft = () => {
    blogListRef.current.scrollBy({ left: -525, behavior: "smooth" });
  };

  const scrollRight = () => {
    blogListRef.current.scrollBy({ left: 525, behavior: "smooth" });
  };

  const autoScrollHandler = () => {
    if (blogListRef.current) {
      const isAtEnd =
        blogListRef.current.scrollLeft + blogListRef.current.clientWidth >=
        blogListRef.current.scrollWidth;
      if (isAtEnd) {
        blogListRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        blogListRef.current.scrollBy({ left: 600, behavior: "smooth" });
      }
    }
  };

  const pauseAutoScroll = () => setAutoScroll(false);
  const resumeAutoScroll = () => setAutoScroll(true);

  useEffect(() => {
    let intervalId;
    if (autoScroll) {
      intervalId = setInterval(autoScrollHandler, 3000); // Cuộn mỗi 3 giây
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoScroll]);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setIsLoading(true);
        let limit = "";
        let page = "";
        let sort = "";
        const fetchedBlogs = await fetchBlogs(limit, page, sort);
        if (Array.isArray(fetchedBlogs.data.data)) {
          setBlogs(fetchedBlogs.data.data);
        } else {
          throw new Error("Fetched data is not an array");
        }
      } catch (err) {
        setError(err.message);
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
      </div>
      <div
        className="blog-list-wrapper"
        onMouseEnter={!columnLayout ? pauseAutoScroll : null}
        onMouseLeave={!columnLayout ? resumeAutoScroll : null}
      >
        {!columnLayout && (
          <button
            className="scroll-button left"
            onClick={() => {
              scrollLeft();
              pauseAutoScroll();
            }}
          >
            &lt;
          </button>
        )}
        <div className="blog-list" ref={blogListRef}>
          {isLoading ? (
            <Oval
              wrapperStyle={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
              }}
            />
          ) : (
            <BlogCard blogs={blog} />
          )}
        </div>
        {!columnLayout && (
          <button
            className="scroll-button right"
            onClick={() => {
              scrollRight();
              pauseAutoScroll();
            }}
          >
            &gt;
          </button>
        )}
      </div>
    </div>
  );
};

export default BlogList;
