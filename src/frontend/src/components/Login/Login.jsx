import { useState } from 'react';
import './Login.css'
import { useNavigate } from "react-router-dom";


//prop chuyền từ app.js
//onLogin dùng để set state isLogin
//showLogin dùng để set state showLogin
const Login = ({ onLogin, showLogin }) => {
    const navigate = useNavigate();

    //Chuyển state isLogin trong app.js (Route '/')
    //Chuyển từ màn hình Login.jsx sang HomePage.jsx (trong folder Member) lúc bấm nút Login
    const handleIsLogin = (event) => {
        event.preventDefault();
        navigate('/');
        onLogin(true);
    };

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
                            <input class="input100" type="text" name="username" placeholder="Username" />
                            <span class="focus-input100" data-placeholder=""></span>
                        </div>
                        <div class="wrap-input100 validate-input" data-validate="Enter password">
                            <input class="input100" type="password" name="pass" placeholder="Password" />
                            <span class="focus-input100" data-placeholder=""></span>
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