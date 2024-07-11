import { useLocation } from "react-router-dom";
// import { toast, Toaster } from 'react-hot-toast';

import BlogList from "../Blog/BlogList";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import ProductBar from "../Product-HomePage/ProductBar";
import "./HomePage.css";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { getUser } from "../../services/editprofile/getUser";

//prop onLogin chuyền từ app.js -> HomePage.jsx -> Header.jsx
//dùng để set state isLogin
const HomePage = ({ onLogin, isMember }) => {
  // const userData = localStorage.getItem('userData');
  // const userName = userData.Name;
  // const userDataString = localStorage.getItem('userData');
  // const userData = userDataString ? JSON.parse(userDataString) : null;
  // const userName = userData ? userData.Name : '';

  const location = useLocation();

  const { token } = location.state || {};

  const handleDecodeLoginGGToken = async () => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const response = await getUser(decoded.userId);
      console.log('decode run')
      console.log(response);
      if (response) {
        sessionStorage.setItem('userData', JSON.stringify(response));
        sessionStorage.setItem('tokenProcessed', 'true'); // Add flag to indicate token has been processed
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('loginSuccess', 'true'); // Set flag for successful login
        window.location.reload();
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    const tokenProcessed = sessionStorage.getItem('tokenProcessed');
    if (token && !tokenProcessed) {
      handleDecodeLoginGGToken();
    }
  }, [token])

  useEffect(() => {
    // if (location.state && location.state.showLoginSuccess) {
    //   console.log("Showing login success toast");
    //   toast.success("Login successful!", {
    //     duration: 3000,
    //     position: "top-right",
    //   });
    //   window.history.replaceState({}, document.title);
    // }
    const loginSuccess = sessionStorage.getItem('loginSuccess');
    console.log(loginSuccess);
    if (loginSuccess) {
      console.log('loginSuccessssssss')
      toast.success("Login successful!", {
        duration: 3000,
        position: "top-right",
        onClose: () => {
          // sessionStorage.removeItem('userData');
          // sessionStorage.removeItem('tokenProcessed');
          sessionStorage.removeItem('loginSuccess');
          // setShowToast(false); // Reset toast flag after toast is closed
        }
      });
      // sessionStorage.removeItem('loginSuccess'); // Clear the flag after showing the toast
    }
  }, [location]);

  const getUserName = () => {
    try {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        return userData.Name || 'Guest';
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return 'Guest';
  };

  const userName = isMember ? getUserName() : "Guest";
  //{isMember && {JSON.parse(localStorage.getItem('userData')).Name}}

  return (
    <div className="body">
      <ToastContainer style={{ top: "110px" }} />
      <div>
        <Header onLogin={onLogin} isMember={isMember} />
      </div>
      <img className="image" src="/img/pinkbg.jpg" />
      {/* <div className="welcome">Welcome {userName}</div> */}
      <div>
        <ProductBar />
      </div>
      <div>
        <BlogList />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
