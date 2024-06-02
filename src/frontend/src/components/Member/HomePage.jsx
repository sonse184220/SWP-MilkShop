import BlogList from "../Blog/BlogList"
import Footer from "../Footer/Footer"
import Header from "../Header/Header"
import ProductBar from "../Product-HomePage/ProductBar"
import './HomePage.css'

const HomePage = ({ onLogin }) => {
    return (
        <div className="body">
            <div><Header onLogin={onLogin} /></div>
            <img class='image' src="/img/4.jpg" />
            <div className="welcome">Welcome User1</div>
            <div><ProductBar /></div>
            <div><BlogList /></div>
            <div><Footer /></div>
        </div>
    )
}

export default HomePage