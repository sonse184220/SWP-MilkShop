import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import './Login.css'
import handleLoginApi from '../../services/loginService';


//prop chuyền từ app.js
//onLogin dùng để set state isLogin
//showLogin dùng để set state showLogin
const Login = ({ onLogin, showLogin }) => {
    const navigate = useNavigate();

    const [UserID, setUserID] = useState('');
    const [Password, setPassword] = useState('');
    const [ErrorMessage, setErrorMessage] = useState('');

    //Chuyển state isLogin trong app.js (Route '/')
    //Kiểm tra userid và password
    //Chuyển từ màn hình Login.jsx sang HomePage.jsx (trong folder Member) lúc bấm nút Login(Nếu true)
    //Hiện lỗi(nếu false)
    const handleIsLogin = async (event) => {
        event.preventDefault();

        const userInfo = { UserID, Password };
        try {
            const response = await handleLoginApi(userInfo);
            console.log('Response:', response);
            setErrorMessage('');
            navigate('/home');
            onLogin(true);
        } catch (error) {
            if (error.response && error.response.data) {
                let errorMessage;
                // Try to parse the error response data as JSON
                // const parsedData = JSON.parse(error.response.data);
                if (typeof error.response.data === 'object')
                    errorMessage = error.response.data || 'An error occurred';
                else if (Array.isArray(error.response.data) && error.response.data.length > 0)
                    errorMessage = error.response.data[0];

                setErrorMessage(errorMessage);
            } else {
                setErrorMessage('An error occurred');
            }
            console.log(error);
        };
    }

    //Chuyển state showLogin trong app.js (Route '/')
    //Chuyển sang màn hình Register.jsx lúc bấm 'Create an account'
    const handleShowLogin = (event) => {
        event.preventDefault();
        navigate('/login-register');
        showLogin(true);
    };

    return (
        <div class="limiter">
            <div class="container-login100">
                <div class="wrap-login100">
                    <form class="login100-form validate-form">
                        <span class="login100-form-logo">
                            <i class="zmdi zmdi-landscape"></i>
                        </span>
                        <span class="login100-form-title p-b-34 p-t-27">
                            Log in
                        </span>
                        <div class="wrap-input100 validate-input" data-validate="Enter username">
                            <input
                                class="input100"
                                type="text"
                                name="username"
                                placeholder="UserID"
                                value={UserID}
                                onChange={(e) => setUserID(e.target.value)} />
                            <span class="focus-input100" data-placeholder=""></span>
                        </div>
                        <div class="wrap-input100 validate-input" data-validate="Enter password">
                            <input
                                class="input100"
                                type="password"
                                name="pass"
                                placeholder="Password"
                                value={Password}
                                onChange={(e) => setPassword(e.target.value)} />
                            <span class="focus-input100" data-placeholder=""></span>
                        </div>
                        <div className="error-message-container">
                            {ErrorMessage && (
                                <>
                                    {ErrorMessage.message && <p className="error-message">{ErrorMessage.message}</p>}
                                    {ErrorMessage.error && ErrorMessage.error.length > 0 && <p className="error-message">{ErrorMessage.error[0].msg}</p>}
                                </>
                            )}
                        </div>
                        <div class="contact100-form-checkbox">
                            <input class="input-checkbox100" id="ckb1" type="checkbox" name="remember-me" />
                            <label class="label-checkbox100" for="ckb1">
                                Remember me
                            </label>
                        </div>
                        <div class="container-login100-form-btn">
                            <button class="login100-form-btn" onClick={handleIsLogin}>
                                Login
                            </button>
                        </div>
                        <div className='switchregister'>
                            <p>Not registered?</p>
                            <a href='' onClick={handleShowLogin}>Create an account</a>
                        </div>
                        <div class="text-center p-t-90">
                            <a class="txt1" href="#">
                                Forgot Password?
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
}

export default Login