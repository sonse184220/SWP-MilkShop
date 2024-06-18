import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Oval } from 'react-loader-spinner';

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
    useEffect(() => {
        verifymailRef.current = setInterval(() => {
            if (registertoken) {
                handleVerifyMail();
            }
        }, 10000);
        return () => clearInterval(verifymailRef.current);
    }, []);

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
                    setSuccessMessage(response.data.message);
                    setRegisterToken(response.data.token);
                }
                handleShowLogin();
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data)
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
            setErrorMessage({ "message": "Passwords do not match" })
        }
        else
            setIsPasswordMatch(true);

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
                                    {(!isPasswordMatch || ErrorMessage.message) && <p className="error-message">{ErrorMessage.message}</p>}
                                    {ErrorMessage.error && ErrorMessage.error.length > 0 && <p className="error-message">{ErrorMessage.error[0].msg}</p>}
                                    {SuccessMessage && <p className="success-message">{SuccessMessage}</p>}
                                </>
                            )
                        }
                    </div>
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
                </form >
            </div >
        </div >

    )
}

export default Register
