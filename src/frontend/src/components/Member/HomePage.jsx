import BlogList from "../Blog/BlogList"
import Footer from "../Footer/Footer"
import Header from "../Header/Header"
import ProductBar from "../Product-HomePage/ProductBar"
import './HomePage.css'

//prop onLogin chuyền từ app.js -> HomePage.jsx -> Header.jsx
//dùng để set state isLogin
const HomePage = ({ onLogin, isMember }) => {
    // const userData = localStorage.getItem('userData');
    // const userName = userData.Name;
    // const userDataString = localStorage.getItem('userData');
    // const userData = userDataString ? JSON.parse(userDataString) : null;
    // const userName = userData ? userData.Name : '';

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

    const userName = isMember ? getUserName() : 'Guest';
    //{isMember && {JSON.parse(localStorage.getItem('userData')).Name}}

    return (
        <div className="body">
            <div><Header onLogin={onLogin} isMember={isMember} /></div>
            <img className='image' src="/img/milkbuying.jpeg" />
            {/* <div className="welcome">Welcome {userName}</div> */}
            <div><ProductBar /></div>
            <div><BlogList /></div>
            <div><Footer /></div>
        </div>
    )
}

export default HomePage