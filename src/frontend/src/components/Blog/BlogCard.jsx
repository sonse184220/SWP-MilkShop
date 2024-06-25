import PropTypes from "prop-types";
import "./BlogCard.css";
import { Link } from "react-router-dom";

const BlogCard = ({ blogs = [] }) => {
  return (
    <>
      {blogs.map((blog) => (
        <Link to={`/BlogDetail/${blog.BlogID}`} key={blog.BlogID}>
          <div className="blog-card">
            <div className="blog-name">{blog.Name}</div>
            <div className="createdDate">
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
