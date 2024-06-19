import PropTypes from "prop-types";
import "./BlogCard.css";
import { Link } from "react-router-dom";

const BlogCard = ({ blogs = [] }) => {
  return (
    <>
      {blogs.map((blog) => (
        <Link to={`/BlogDetail/${blog.BlogID}`} key={blog.BlogID}>
          <div className="blog-card">
            <h2>{blog.Name}</h2>
            <div className="author-description">
              {new Date(blog.CreatedDate).toLocaleDateString()}
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
