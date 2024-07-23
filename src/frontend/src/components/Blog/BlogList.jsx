import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import BlogCard from "./BlogCard";
import "./BlogList.css";
import { fetchBlogs } from "../../services/blog/blogService";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

const BlogList = ({ columnLayout = false }) => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: !columnLayout,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <div
      className={`blog-list-container ${columnLayout ? "column-layout" : ""}`}
    >
      <div className="blog-list-content">
        <h2>Suggested blogs</h2>
      </div>
      <div className="blog-list-wrapper">
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
        ) : columnLayout ? (
          <BlogCard blogs={blogs} />
        ) : (
          <Slider {...settings}>
            {blogs.map((blog) => (
              <Link
                to={`/Customer/BlogDetail/${blog.BlogID}`}
                key={blog.BlogID}
              >
                <div className="blog-card">
                  <div className="blog-name">
                    <img
                      src={`data:image/jpeg;base64,${blog.Image}`}
                      width="200px"
                      height="150px"
                    />
                    <div>{blog.Title}</div>
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        )}
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default BlogList;
