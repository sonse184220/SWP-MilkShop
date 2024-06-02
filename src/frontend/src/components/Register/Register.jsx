import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Register.css'

const Register = ({ showLogin }) => {
    const navigate = useNavigate();

    const handleShowLogin = (event) => {
        event.preventDefault();
        navigate('/login-register');
        showLogin(false);
    };

    return (
        <div className="wrapper" >
            <div class="inner">
                <div class="image-holder">
                    <img src="/img/4.jpg" alt="" />
                </div>
                <form action="">
                    <h3>Registration Form</h3>
                    <div class="form-group">
                        <input type="text" placeholder="First Name" class="form-control" />
                        <input type="text" placeholder="Last Name" class="form-control" />
                    </div>
                    <div class="form-wrapper">
                        <input type="text" placeholder="Username" class="form-control" />
                        <i class="zmdi zmdi-account"></i>
                    </div>
                    <div class="form-wrapper">
                        <input type="text" placeholder="Email Address" class="form-control" />
                        <i class="zmdi zmdi-email"></i>
                    </div>
                    <div class="form-wrapper">
                        <select name="" id="" class="form-control">
                            <option value="" disabled="" selected="">Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        <i className="zmdi zmdi-caret-down" style={{ fontSize: '17px' }}></i>
                    </div>
                    <div class="form-wrapper">
                        <input type="password" placeholder="Password" class="form-control" />
                        <i class="zmdi zmdi-lock"></i>
                    </div>
                    <div class="form-wrapper">
                        <input type="password" placeholder="Confirm Password" class="form-control" />
                        <i class="zmdi zmdi-lock"></i>
                    </div>
                    <div className='form-wrapper switchlogin'>
                        <p>Already registered?</p>
                        <a href='#' onClick={handleShowLogin}>Sign In</a>
                    </div>
                    <button>Register
                        <i class="zmdi zmdi-arrow-right"></i>
                    </button>
                </form>
            </div>
        </div>

    )
}

export default Register