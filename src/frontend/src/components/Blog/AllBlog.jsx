// AllBlog.jsx
import React, { useState, useEffect, useRef } from "react";
import { Oval } from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import BlogPost from "./BlogPost";
import "./AllBlog.css";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import BlogList from "./BlogList";
import { fetchBlogs } from "../../services/blog/blogService"; // Adjusted the path here
import { searchBlogs } from "../../services/blog/searchBlogs";

const AllBlog = ({ isMember }) => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchPageCount, setSearchPageCount] = useState(1);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  const handleSearchPageClick = (event) => {
    setSearchCurrentPage(event.selected + 1);
  };

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        let limit = 5;
        let page = currentPage;
        let sort = "";
        setIsLoading(true);
        const fetchedBlogs = await fetchBlogs(limit, page, sort);
        if (Array.isArray(fetchedBlogs.data.data)) {
          setBlogs(fetchedBlogs.data.data);
          setPageCount(fetchedBlogs.data.totalPages);
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
  }, [currentPage]);

  const handleSearch = async () => {
    try {
      let limit = 1;
      let page = searchCurrentPage;
      let sort = "";
      const searchedBlogs = await searchBlogs(searchQuery, limit, page, sort);
      setBlogs(searchedBlogs.data);
      setSearchPageCount(searchedBlogs.totalPages);
    } catch (err) {
      setError(err.message);
      console.error("Error searching blogs:", err);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchCurrentPage]);

  return (
    <>
      <img className="image" src="/img/milkbuying.jpeg" alt="Blog Header" />
      <Header isMember={isMember} />
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <h2>All Blogs</h2>
            <div className="searchBlog">
              Search blog:
              <input
                type="text"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs"
              />
              <button onClick={handleSearch}>Search</button>
            </div>

            {isLoading ? (
              <Oval
                wrapperStyle={{
                  display: "flex",
                  justifyContent: "center",
                  height: "100%",
                  width: "100%",
                }}
              />
            ) : (
              <BlogPost blogs={blogs} />
            )}
          </div>
          <div className="col-lg-4">
            <h3>Some Blogs</h3>
            <div className="all-blog-list-container">
              <BlogList columnLayout />
            </div>
          </div>
        </div>
        <div>
          {searchQuery === "" ? (
            <ReactPaginate
              breakLabel="..."
              nextLabel=">>"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="<<"
              renderOnZeroPageCount={null}
              containerClassName="pagination justify-content-center"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              activeClassName="active"
            />
          ) : (
            <ReactPaginate
              breakLabel="..."
              nextLabel=">>"
              onPageChange={handleSearchPageClick}
              pageRangeDisplayed={5}
              pageCount={searchPageCount}
              previousLabel="<<"
              renderOnZeroPageCount={null}
              containerClassName="pagination justify-content-center"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              activeClassName="active"
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default AllBlog;
