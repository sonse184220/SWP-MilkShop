import { useState } from 'react';
import './Login.css'
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

const Login = ({ onLogin }) => {
    const [showLogin, setShowLogin] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform login validation or API call here
        // If the login is successful, call the onLogin function passed down as a prop
        onLogin();
    };

    const Toggle = () => {
        setShowLogin((prevState) => !prevState)
    }

    return (
        <div>
            <Header loginHeader={true} />

            <div className="login-page">
                <div className="form">
                    {showLogin ? (
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div>
                                <p style={{ fontSize: 20, color: '#4CAF50', margin: '0 0 2px 0' }}>Login</p>
                                <p style={{ fontSize: 12, color: '#df4f11fd', margin: '5px 0 15px 0' }}>Enter your UserID and Password for login</p>
                            </div>
                            <input type="text" placeholder="username" />
                            <input type="password" placeholder="password" />
                            <button type="submit">login</button>
                            <p className="message">Not registered? <a href="#" onClick={Toggle}>Create an account</a></p>
                        </form>
                    ) : (
                        <form className="register-form">
                            <div>
                                <p style={{ fontSize: 20, color: '#4CAF50', margin: '0 0 2px 0' }}>Create an account</p>
                                <p style={{ fontSize: 12, color: '#df4f11fd', margin: '5px 0 15px 0' }}>Enter your UserID to sign up for this web</p>
                            </div>
                            <input type="text" placeholder="name" />
                            <input type="password" placeholder="password" />
                            <input type="text" placeholder="email address" />
                            <button>create</button>
                            <p className="message">Already registered? <a href="#" onClick={Toggle}>Sign In</a></p>
                        </form>
                    )}
                </div>

            </div >
            <div><Footer /></div>
        </div>
    )

}

export default Login