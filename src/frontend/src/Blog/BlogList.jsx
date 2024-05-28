import { useRef } from 'react';
import BlogCard from './BlogCard';

const BlogList = () => {
  const blogListRef = useRef(null);

  const blogs = [
    {
      title: '“A terrific piece of praise”',
      authorName: 'Name',
      authorDescription: 'Description',
      authorImage: 'https://via.placeholder.com/40',
    },
    {
      title: '“A fantastic bit of feedback”',
      authorName: 'Name',
      authorDescription: 'Description',
      authorImage: 'https://via.placeholder.com/40',
    },
    {
      title: '“A genuinely glowing review”',
      authorName: 'Name',
      authorDescription: 'Description',
      authorImage: 'https://via.placeholder.com/40',
    },
    {
      title: '“Another great review”',
      authorName: 'Name',
      authorDescription: 'Description',
      authorImage: 'https://via.placeholder.com/40',
    },
    {
      title: '“Yet another great review”',
      authorName: 'Name',
      authorDescription: 'Description',
      authorImage: 'https://via.placeholder.com/40',
    },
    {
      title: '“More great feedback”',
      authorName: 'Name',
      authorDescription: 'Description',
      authorImage: 'https://via.placeholder.com/40',
    },
  ];

  const scrollLeft = () => {
    blogListRef.current.scrollBy({ left: -525, behavior: 'smooth' });
  };

  const scrollRight = () => {
    blogListRef.current.scrollBy({ left: 525, behavior: 'smooth' });
  };

  return (
    <div className="blog-list-container">
      <div className="blog-list-content">
        <h2>Suggested blogs</h2>
        <a href=''>All Blog</a>
      </div>
      <div className="blog-list-wrapper">
        <button className="scroll-button left" onClick={scrollLeft}>
          &lt;
        </button>
        <div className="blog-list" ref={blogListRef}>
          {blogs.map((blog, index) => (
            <BlogCard key={index} {...blog} />
          ))}
        </div>
        <button className="scroll-button right" onClick={scrollRight}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default BlogList;
