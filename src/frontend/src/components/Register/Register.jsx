import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Register.css'
import handleRegisterApi from '../../services/registerService';

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

    //Chuyển state showLogin trong app.js (Route '/login-register')
    //Chuyển sang màn hình Login.jsx lúc bấm Sign In
    const handleShowLogin = (event) => {
        event.preventDefault();
        navigate('/login-register');
        showLogin(false);
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            setErrorMessage('');
            setSuccessMessage('');
            let userInfo;
            if (isPasswordMatch) {
                userInfo = { UserID, Password, Name, Email, Phone, Address };
                const response = await handleRegisterApi(userInfo);
                if (response.data) {
                    setSuccessMessage(response.data);
                }
                handleShowLogin();
            }
            // } else {
            //     setErrorMessage({ "message": "'Passwords do not match'" })
            // }

        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data)
            }
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

    }, [Password, ConfirmPassword, UserID, Name, Email, Phone, Address]
    );

    //component register
    return (
        <div className="wrapper" >
            <div class="inner">
                <div class="image-holder">
                    <img src="/img/4.jpg" alt="" />
                </div>
                <form>
                    <h3>Registration Form</h3>
                    <div class="form-wrapper">
                        <input
                            type="text"
                            placeholder="UserID"
                            class="form-control"
                            onChange={(e) => setUserID(e.target.value)} />
                    </div>
                    <div class="form-wrapper">
                        <input
                            type="password"
                            placeholder="Password"
                            class="form-control"
                            onChange={(e) => setPassword(e.target.value)} />
                        <i class="zmdi zmdi-lock"></i>
                    </div>
                    <div class="form-wrapper">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            class="form-control"
                            onChange={(e) => setConfirmPassword(e.target.value)} />
                        <i class="zmdi zmdi-lock"></i>
                    </div>
                    <div class="form-wrapper">
                        <input
                            type="text"
                            placeholder="Name"
                            class="form-control"
                            onChange={(e) => setName(e.target.value)} />
                        <i class="zmdi zmdi-account"></i>
                    </div>
                    <div class="form-wrapper">
                        <input
                            type="text"
                            placeholder="Email Address"
                            class="form-control"
                            onChange={(e) => setEmail(e.target.value)} />
                        <i class="zmdi zmdi-email"></i>
                    </div>
                    <div class="form-wrapper">
                        <input
                            type="text"
                            placeholder="Phone"
                            class="form-control"
                            onChange={(e) => setPhone(e.target.value)} />
                        <i class="zmdi zmdi-phone"></i>
                    </div>
                    <div class="form-wrapper">
                        <input
                            type="text"
                            placeholder="Address"
                            class="form-control"
                            onChange={(e) => setAddress(e.target.value)} />
                        <i class="zmdi zmdi-home"></i>
                    </div>

                    <div>
                        {(ErrorMessage || SuccessMessage) &&
                            (
                                <>
                                    {(!isPasswordMatch || ErrorMessage.message) && <p className="error-message">{ErrorMessage.message}</p>}
                                    {ErrorMessage.error && ErrorMessage.error.length > 0 && <p className="error-message">{ErrorMessage.error[0].msg}</p>}
                                    {SuccessMessage.message && <p className="success-message">{SuccessMessage.message}</p>}
                                </>
                            )
                        }
                    </div>
                    <div className='form-wrapper switchlogin'>
                        <p>Already registered?</p>
                        <a href='#' onClick={handleShowLogin}>Sign In</a>
                    </div>
                    <button onClick={handleRegister}>Register
                        <i class="zmdi zmdi-arrow-right"></i>
                    </button>
                </form>
            </div>
        </div>

    )
}

export default Register