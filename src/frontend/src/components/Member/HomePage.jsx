import BlogList from "../Blog/BlogList"
import Footer from "../Footer/Footer"
import Header from "../Header/Header"
import ProductBar from "../Product-HomePage/ProductBar"
import './HomePage.css'

//prop onLogin chuyền từ app.js -> HomePage.jsx -> Header.jsx
//dùng để set state isLogin
const HomePage = ({ onLogin }) => {
    // const userData = localStorage.getItem('userData');
    // const userName = userData.Name;
    const userDataString = localStorage.getItem('userData');
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const userName = userData ? userData.Name : '';

    return (
        <div className="body">
            <div><Header onLogin={onLogin} /></div>
            <img className='image' src="/img/P004.jpg" />
            <div className="welcome">Welcome {JSON.parse(localStorage.getItem('userData')).Name}</div>
            <div><ProductBar /></div>
            <div><BlogList /></div>
            <div><Footer /></div>
        </div>
    )
}

export default HomePage