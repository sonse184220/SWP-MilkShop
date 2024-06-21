import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Oval } from 'react-loader-spinner';
import { Toaster, toast } from 'react-hot-toast';
// import 'react-hot-toast/dist/bundle.css';
// import 'react-hot-toast/dist/react-hot-toast.css';

import './Register.css'
import handleRegisterApi from '../../services/register/registerService';
import { VerifyEmail } from '../../services/register/verifyMail';

//prop showLogin chuyền từ App.js, 
//dùng để set showLogin state
const Register = ({ showLogin }) => {
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
    const [registertoken, setRegisterToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const verifymailRef = useRef(null);

    //Chuyển state showLogin trong app.js (Route '/login-register')
    //Chuyển sang màn hình Login.jsx lúc bấm Sign In
    const handleShowLogin = (event) => {
        event.preventDefault();
        navigate('/login-register');
        showLogin(false);
    };

    const handleVerifyMail = async () => {
        try {
            if (registertoken) {
                const response = await VerifyEmail(registertoken);
                console.log("=====================", response);
            } else {
                console.log("nothing");
            }
            console.log("ref is running")
        } catch (error) {
            console.log(error);
        }
    };
    // useEffect(() => {
    //     verifymailRef.current = setInterval(() => {
    //         if (registertoken) {
    //             handleVerifyMail();
    //         }
    //     }, 10000);
    //     return () => clearInterval(verifymailRef.current);
    // }, []);

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
                    setRegisterToken(response.data.token);
                }
                handleShowLogin();
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

    //check password và confirmpassword có giống nhau ko
    useEffect(() => {
        setErrorMessage('');
        setSuccessMessage('');
        if (Password !== ConfirmPassword) {
            setIsPasswordMatch(false);
            setPasswordError('*Passwords do not match');
            // setErrorMessage({ "message": "Passwords do not match" })
            // toast.error("Password do not match", {
            //     style: {
            //         backgroundColor: '#ef4444',
            //         color: '#ffffff',
            //         fontWeight: 'bold',
            //     },
            // });
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
                    <h3>Registration Form</h3>
                    {/* <div className="form-wrapper">
                        <input
                            type="text"
                            placeholder="UserID"
                            className="form-control"
                            onChange={(e) => setUserID(e.target.value)} />
                    </div> */}
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
                    <button className='registerbt' onClick={handleRegister} disabled={isLoading}>
                        {isLoading ? (
                            <Oval
                                height={20}
                                width={20}
                                color="#fff"
                            // ariaLabel="oval-loading"
                            // wrapperStyle={{}}
                            // visible={true}
                            />
                        ) : (
                            <>
                                Register
                                <i className="zmdi zmdi-arrow-right"></i>
                            </>
                        )}
                    </button>
                    {/* <button className="login100-form-btn google-btn">
                        <i class="fab fa-google"></i> Sign in with Google
                    </button> */}
                </form >
            </div >
        </div >

    )
}

export default Register
