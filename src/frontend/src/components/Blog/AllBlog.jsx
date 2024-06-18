// AllBlog.jsx
import React, { useState, useEffect, useRef } from "react";
import BlogPost from './BlogPost';
import './AllBlog.css';
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import BlogList from "./BlogList";
import ProductList from '../Product/ProductList';
import { Link } from "react-router-dom";
import { fetchBlogs } from "../../services/blog/blogService"; // Adjusted the path here
import { searchBlogs } from "../../services/blog/searchBlogs";

const Blogs = [
  {
    title: 'The Benefits of Drinking Milk',
    author: {
      name: 'John Doe',
      bio: 'Nutritionist and Blogger',
      image: 'https://via.placeholder.com/40'
    },
    content: 'Milk is an excellent source of vitamins and minerals, particularly calcium. It has several health benefits for people of all ages.',
    date: new Date('2023-06-01'),
    image: 'https://via.placeholder.com/800x400',
    products: [
      {
        name: 'Organic Whole Milk',
        description: 'Rich and creamy organic whole milk from grass-fed cows.',
        image: 'https://via.placeholder.com/100',
        url: 'https://example.com/organic-whole-milk'
      },
      {
        name: 'Calcium Fortified Milk',
        description: 'Milk fortified with extra calcium for stronger bones.',
        image: 'https://via.placeholder.com/100',
        url: 'https://example.com/calcium-fortified-milk'
      }
    ]
  },
  {
    title: 'Different Types of Milk and Their Uses',
    author: {
      name: 'Jane Smith',
      bio: 'Food Scientist and Writer',
      image: 'https://via.placeholder.com/40'
    },
    content: 'Explore the various types of milk, including cow’s milk, almond milk, soy milk, and more, and learn how to use them in your recipes.',
    date: new Date('2023-05-15'),
    image: 'https://via.placeholder.com/800x400',
    products: [
      {
        name: 'Almond Milk',
        description: 'A dairy-free alternative with a nutty flavor, perfect for smoothies and cereals.',
        image: 'https://via.placeholder.com/100',
        url: 'https://example.com/almond-milk'
      },
      {
        name: 'Soy Milk',
        description: 'A popular plant-based milk that’s high in protein and great for baking.',
        image: 'https://via.placeholder.com/100',
        url: 'https://example.com/soy-milk'
      }
    ]
  },
  {
    title: 'How Milk Can Help You Build Muscle',
    author: {
      name: 'Mark Johnson',
      bio: 'Fitness Expert and Author',
      image: 'https://via.placeholder.com/40'
    },
    content: 'Milk contains high-quality protein and is a great post-workout recovery drink. Learn how it can help you build and repair muscle tissue.',
    date: new Date('2023-05-10'),
    image: 'https://via.placeholder.com/800x400',
    products: [
      {
        name: 'Protein Shake with Milk',
        description: 'A protein shake made with milk for optimal muscle recovery.',
        image: 'https://via.placeholder.com/100',
        url: 'https://example.com/protein-shake'
      },
      {
        name: 'Chocolate Milk',
        description: 'A tasty and effective post-workout recovery drink.',
        image: 'https://via.placeholder.com/100',
        url: 'https://example.com/chocolate-milk'
      }
    ]
  }
  // Add more blog post objects here
];

const allProducts = Blogs.flatMap(blog => blog.products);

const AllBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const fetchedBlogs = await fetchBlogs();
        if (Array.isArray(fetchedBlogs.data)) {
          setBlogs(fetchedBlogs.data);
        } else {
          throw new Error("Fetched data is not an array");
        }
      } catch (err) {
        setError(err.message);
        setBlogs(Blogs);
        console.error("Error loading blogs:", err);
      }
    };
    loadBlogs();
  }, []);

  const handleSearch = async () => {
    try {
      const searchedBlogs = await searchBlogs(searchQuery);
      setBlogs(searchedBlogs.data);

      console.log("After that: ", searchedBlogs);
    } catch (err) {
      setError(err.message);
      console.error("Error searching blogs:", err);
    }
  };

  const allProducts = Blogs.flatMap((blog) => blog.products);
  return (
    <>
      <img className="image" src="/img/P004.jpg" alt="Blog Header" />
      <Header />
      <Link to="/EditProfile">Edit Profile</Link>
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <h2>All Blogs</h2>
            {/* searchBlog */}
            <div className="searchBlog">
              Search blog:
              <input
                type="text"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs"
              />
              <button onClick={handleSearch}>Search</button>
            </div>
            <BlogPost blogs={blogs} />
          </div>
          <div className="col-lg-4">
            <h3>Some Blogs</h3>
            <div className="all-blog-list-container">
              <BlogList columnLayout />
            </div>
          </div>
        </div>
      </div>
      <ProductList products={allProducts} />
      <Footer />
    </>
  );
};

export default AllBlog;
