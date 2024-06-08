import BlogList from "../Blog/BlogList"
import Footer from "../Footer/Footer"
import Header from "../Header/Header"
import ProductBar from "../Product-HomePage/ProductBar"
import './HomePage.css'

//prop onLogin chuyền từ app.js -> HomePage.jsx -> Header.jsx
//dùng để set state isLogin
const HomePage = ({ onLogin }) => {
    return (
        <div className="body">
            <div><Header onLogin={onLogin} /></div>
            <img class='image' src="/img/P004.jpg" />
            <div className="welcome">Welcome User1</div>
            <div><ProductBar /></div>
            <div><BlogList /></div>
            <div><Footer /></div>
        </div>
    )
}

export default HomePage