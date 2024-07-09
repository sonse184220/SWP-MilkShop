import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Oval } from 'react-loader-spinner';
import { Toaster, toast } from 'react-hot-toast';
// import 'react-hot-toast/dist/bundle.css';
// import 'react-hot-toast/dist/react-hot-toast.css';

import './Register.css'
import handleRegisterApi from '../../services/register/registerService';
import { VerifyEmail } from '../../services/register/verifyMail';
import { CompleteProfile } from '../../services/login/completeProfile';

//prop showLogin chuyền từ App.js, 
//dùng để set showLogin state
const Register = ({ showLogin, isCompleteRegistration }) => {
    const location = useLocation();
    // const navigate = useNavigate();
    const { token } = location.state || {};

    const navigate = useNavigate();
    const [UserID, setUserID] = useState('');
    const [Password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [Phone, setPhone] = useState('');
    const [Address, setAddress] = useState('');
    const [isPasswordMatch, setIsPasswordMatch] = useState(true);
    const [passwordError, setPasswordError] = useState('');
    const [SuccessMessage, setSuccessMessage] = useState('');
    const [ErrorMessage, setErrorMessage] = useState('');

    const [isLoading, setIsLoading] = useState(false);



    //Chuyển state showLogin trong app.js (Route '/login-register')
    //Chuyển sang màn hình Login.jsx lúc bấm Sign In
    const handleShowLogin = (event) => {
        event.preventDefault();
        navigate('/Customer/login-register');
        showLogin(false);
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            setErrorMessage('');
            setSuccessMessage('');
            setIsLoading(true);

            let userInfo;
            if (isPasswordMatch) {
                userInfo = { Password, Name, Email, Phone, Address };
                const response = await handleRegisterApi(userInfo);
                if (response.data) {
                    // setSuccessMessage(response.data.message);
                    toast.success(response.data.message, {
                        duration: 15000,
                        style: {
                            backgroundColor: '#ffd3b6',
                            color: '#698474',
                        },
                    });
                }
                // handleShowLogin();
            }
        } catch (error) {
            if (error.response && error.response.data) {
                console.log(error);
                // setErrorMessage(error.response.data)
                let errormsg = 'Register failed. Please try again';
                if (Array.isArray(error.response.data.error)) {
                    errormsg = error.response.data.error[0].msg;
                } else if (error.response.data.message) {
                    errormsg = error.response.data.message;
                }
                toast.error(errormsg, {
                    style: {
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        fontWeight: 'bold',
                    },
                });
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleCompleteRegistration = async () => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('Name', Name);
            formData.append('Phone', Phone);
            formData.append('Address', Address);
            const RegisToken = 'Bearer ' + token;
            console.log(RegisToken);
            const response = await CompleteProfile(RegisToken, formData);
            if (response.data.token && response.data.user) {
                sessionStorage.setItem('userData', JSON.stringify(response.data.user));
                sessionStorage.setItem('token', response.data.token);
                navigate('/Customer/home', { state: { showLoginSuccess: true } });
            }
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }

    //check password và confirmpassword có giống nhau ko
    useEffect(() => {
        setErrorMessage('');
        setSuccessMessage('');
        if (Password !== ConfirmPassword) {
            setIsPasswordMatch(false);
            setPasswordError('*Passwords do not match');
        }
        else {
            setIsPasswordMatch(true);
            setPasswordError('');
        }

    }, [Password, ConfirmPassword, Name, Email, Phone, Address]
    );

    //component register
    return (
        <div className="wrapper" >
            <div className="inner">
                <div className="image-holder">
                    <img src="/img/P002.jpg" alt="" />
                </div>
                <form>
                    {isCompleteRegistration ? (
                        <h3>Complete Your Profile with Google Login</h3>
                    ) : (
                        <>
                            <h3>Registration Form</h3>
                            <div className="form-wrapper" >
                                <input
                                    type="text"
                                    placeholder="Email Address"
                                    className="form-control"
                                    onChange={(e) => setEmail(e.target.value)} />
                                <i className="zmdi zmdi-email"></i>
                            </div >
                            <div className="form-wrapper" >
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="form-control"
                                    onChange={(e) => setPassword(e.target.value)} />
                                <i className="zmdi zmdi-lock"></i>
                            </div >
                            <div className="form-wrapper" >
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="form-control"
                                    onChange={(e) => setConfirmPassword(e.target.value)} />
                                <i className="zmdi zmdi-lock"></i>
                            </div >
                            {passwordError && <p className="error-message">{passwordError}</p>}
                        </>
                    )}

                    <div className="form-wrapper" >
                        <input
                            type="text"
                            placeholder="Name"
                            className="form-control"
                            onChange={(e) => setName(e.target.value)} />
                        <i className="zmdi zmdi-account"></i>
                    </div >
                    <div className="form-wrapper" >
                        <input
                            type="text"
                            placeholder="Phone"
                            className="form-control"
                            onChange={(e) => setPhone(e.target.value)} />
                        <i className="zmdi zmdi-phone"></i>
                    </div >
                    <div className="form-wrapper" >
                        <input
                            type="text"
                            placeholder="Address"
                            className="form-control"
                            onChange={(e) => setAddress(e.target.value)} />
                        <i className="zmdi zmdi-home"></i>
                    </div >

                    <div>
                        {(ErrorMessage || SuccessMessage) &&
                            (
                                <>
                                    {/* {(!isPasswordMatch || ErrorMessage.message) && <p className="error-message">{ErrorMessage.message}</p>}
                                    {ErrorMessage.error && ErrorMessage.error.length > 0 && <p className="error-message">{ErrorMessage.error[0].msg}</p>} */}
                                    {SuccessMessage && <p className="success-message">{SuccessMessage}</p>}
                                </>
                            )
                        }
                    </div>
                    <Toaster />
                    <div className='form-wrapper switchlogin'>
                        <p>Already registered?</p>
                        <a href='#' onClick={handleShowLogin}>Sign In</a>
                    </div>
                    <button
                        className='registerbt'
                        onClick={isCompleteRegistration ? handleCompleteRegistration : handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Oval
                                height={20}
                                width={20}
                                color="#fff"
                            />
                        ) : (
                            <>
                                {isCompleteRegistration ? 'Complete Profile' : 'Register'}
                                <i className="zmdi zmdi-arrow-right"></i>
                            </>
                        )}
                    </button>
                    {/* <button className="login100-form-btn google-btn">
                        <i class="fab fa-google"></i> Sign in with Google
                    </button> */}
                    <button className='back-to-home-btn' onClick={() => { navigate('/Customer/home') }}>
                        Back to Home
                        <i className="zmdi zmdi-home"></i>
                    </button>
                </form >
            </div >
        </div >

    )
}

export default Register
