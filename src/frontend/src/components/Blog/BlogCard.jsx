import PropTypes from "prop-types";
import "./BlogCard.css";
import { Link } from "react-router-dom";

const BlogCard = ({ blogs = [] }) => {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }
  return (
    <>
      {blogs.map((blog) => (
        <Link to={`/Customer/BlogDetail/${blog.BlogID}`} key={blog.BlogID}>
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
    </>
  );
};

BlogCard.propTypes = {
  blogs: PropTypes.array.isRequired,
};

export default BlogCard;
