import { useLocation } from 'react-router-dom';
// import { toast, Toaster } from 'react-hot-toast';

import BlogList from "../Blog/BlogList"
import Footer from "../Footer/Footer"
import Header from "../Header/Header"
import ProductBar from "../Product-HomePage/ProductBar"
import './HomePage.css'
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//prop onLogin chuyền từ app.js -> HomePage.jsx -> Header.jsx
//dùng để set state isLogin
const HomePage = ({ onLogin, isMember }) => {
  // const userData = localStorage.getItem('userData');
  // const userName = userData.Name;
  // const userDataString = localStorage.getItem('userData');
  // const userData = userDataString ? JSON.parse(userDataString) : null;
  // const userName = userData ? userData.Name : '';

  const location = useLocation();

  useEffect(() => {
    console.log('Location changed:', location);
    console.log('Location state:', location.state);
    if (location.state && location.state.showLoginSuccess) {
      console.log('Showing login success toast');
      toast.success("Login successful!", {
        duration: 3000,
        position: 'top-right',
      });
      console.log("sssssssss")
      window.history.replaceState({}, document.title)
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
      <ToastContainer style={{ top: '110px' }} />
      <div><Header onLogin={onLogin} isMember={isMember} /></div>
      <img className='image' src="/img/milkbuying.jpeg" />
      {/* <div className="welcome">Welcome {userName}</div> */}
      <div><ProductBar /></div>
      <div><BlogList /></div>
      <div><Footer /></div>
    </div>
  )
}

export default HomePage;
