import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from 'react-hot-toast';
import { Oval } from 'react-loader-spinner';
import Modal from 'react-modal';
import { X } from 'lucide-react';


import './Login.css'
import handleLoginApi from '../../services/login/loginService';
import { LoginWithGoogle } from '../../services/login/loginWithGoogle';
import { ResetPassword } from '../../services/changepassword/resetpassword';


//prop chuyền từ app.js
//onLogin dùng để set state isLogin
//showLogin dùng để set state showLogin
const Login = ({ onLogin, showLogin }) => {
    const navigate = useNavigate();
    // const { updateMemberData } = useContext(MemberContext);

    const [identifier, setIdentifier] = useState('');
    const [Password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // const [ErrorMessage, setErrorMessage] = useState('');
    const [forgotPass, setForgotPass] = useState(false);

    const [rsEmail, setRsEmail] = useState('');
    const [rsPassword, setRsPassword] = useState('');
    const [rsConfirm, setRsConfirm] = useState('');

    const handleForgotPassword = async () => {
        try {
            setIsLoading(true);
            if (rsEmail.length === 0 || rsConfirm.length === 0 || rsPassword.length === 0) {
                toast.error("Please input all fields", {
                    style: {
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        fontWeight: 'bold',
                    },
                });
                return;
            }
            const data = {
                "email": rsEmail,
                "newPassword": rsPassword,
                "confirmPassword": rsConfirm
            }
            const response = await ResetPassword(data);
            if (response.data.token) {
                setForgotPass(false);
                setRsEmail('');
                setRsPassword('');
                setRsConfirm('');
                toast.success(response.data.message, {
                    duration: 15000,
                    style: {
                        backgroundColor: '#ffd3b6',
                        color: '#698474',
                    },
                });
            }
        } catch (error) {
            if (error.response.data.error) {
                toast.error(error.response.data.error[0].msg, {
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

    //Kiểm tra userid và password
    //Chuyển từ màn hình Login.jsx sang HomePage.jsx (trong folder Member) lúc bấm nút Login(Nếu true)
    //Hiện lỗi(nếu false)
    const handleLoginWithGoogle = async (e) => {
        e.preventDefault();
        try {
            const response = await LoginWithGoogle();
            if (response) {
                console.log(response);
            }
        } catch (error) {

        }
    }

    const handleIsLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const userInfo = { identifier, Password };
        try {
            const response = await handleLoginApi(userInfo);
            console.log('Response:', response);
            if (response.data.user.isAdmin === 0 && response.data.user.isStaff === 0) {
                sessionStorage.setItem('userData', JSON.stringify(response.data.user));
                sessionStorage.setItem('token', response.data.token);
                sessionStorage.setItem('loginSuccess', 'true'); // Set login success flag
                navigate('/Customer/home', { state: { showLoginSuccess: true } });
                onLogin(true);
            } else if (response.data.user.isAdmin === 0 && response.data.user.isStaff === 1) {
                sessionStorage.setItem('staffData', JSON.stringify(response.data.user));
                sessionStorage.setItem('token', response.data.token);
                sessionStorage.setItem('loginSuccess', 'true'); // Set login success flag
                navigate('/Staff/OrderManagement', { state: { showLoginSuccess: true } });
            } else if (response.data.user.isAdmin === 1 && response.data.user.isStaff === 0) {
                sessionStorage.setItem('adminData', JSON.stringify(response.data.user));
                sessionStorage.setItem('token', response.data.token);
                sessionStorage.setItem('loginSuccess', 'true'); // Set login success flag
                navigate('/Admin/UserManagement', { state: { showLoginSuccess: true } });

            } else {
                // setErrorMessage('Something went wrong');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                let errorMessage;
                if (typeof error.response.data === 'object')
                    errorMessage = error.response.data || 'An error occurred';
                else if (Array.isArray(error.response.data) && error.response.data.length > 0)
                    errorMessage = error.response.data[0];

                // setErrorMessage(errorMessage);
                toast.error("Email/Phone Number or Password is incorrect. Please input again!", {
                    style: {
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        fontWeight: 'bold',
                    },
                });
            } else {
                // setErrorMessage('An error occurred');
            }
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    //Chuyển state showLogin trong app.js (Route '/')
    //Chuyển sang màn hình Register.jsx lúc bấm 'Create an account'
    const handleShowLogin = (event) => {
        event.preventDefault();
        navigate('/Customer/login-register');
        showLogin(true);
    };

    return (
        <div className="limiter">
            <Modal
                isOpen={forgotPass}
                onRequestClose={() => setForgotPass(false)}
                className="forgot-pass"
                overlayClassName="custom-overlay"
            >
                <button className='x-close-btn' onClick={() => setForgotPass(false)}>
                    <X size={20} />
                </button>
                <div className='input-forgot'>
                    <h2>Forgot Your Password?</h2>
                    <p className='forgot-pass-intro'>Please fill your email to get new password</p>
                    <div className='form-group mb-1'>
                        <label className='mb-1' htmlFor='lastName'>Email</label>
                        <input id='lastName' type='text' className='form-control mb-1' placeholder='Email'
                            name='Email'
                            value={rsEmail}
                            onChange={(e) => setRsEmail(e.target.value)} />
                    </div>
                    {rsEmail.length === 0 && <p className="info-error-message">*Please input email</p>}
                    <div className='form-group mb-1'>
                        <label className='mb-1' htmlFor='lastName'>Password</label>
                        <input id='lastName' type='password' className='form-control mb-1' placeholder='Password'
                            name='Password'
                            value={rsPassword}
                            onChange={(e) => setRsPassword(e.target.value)} />
                    </div>
                    {rsPassword.length === 0 && <p className="info-error-message">*Please input password</p>}
                    <div className='form-group mb-1'>
                        <label className='mb-1' htmlFor='lastName'>Confirm Password</label>
                        <input id='lastName' type='password' className='form-control mb-1' placeholder='Confirm Password'
                            name='Confirm'
                            value={rsConfirm}
                            onChange={(e) => setRsConfirm(e.target.value)} />
                    </div>
                    {rsConfirm.length === 0 && <p className="info-error-message">*Please input confirm password</p>}
                </div>
                <div className='div-verify-btn'>
                    {/* <button className="send-verification-btn" onClick={handleForgotPassword}>
                        Send Verification Email
                    </button> */}
                    {isLoading ? (
                        <Oval
                            height={20}
                            width={20}
                            color="#fff"
                        />
                    ) : (
                        <button className="send-verification-btn" onClick={handleForgotPassword}>
                            Send Verification Email
                        </button>
                    )}
                </div>

            </Modal>
            <div className="container-login100">
                <div className="wrap-login100">
                    <form className="login100-form validate-form">
                        <span className="login100-form-logo">
                            {/* <i className="zmdi zmdi-landscape"></i> */}
                            <img src="/img/logo.jpg" alt="Milky Way Logo" />
                        </span>
                        <span className="login100-form-title p-b-34 p-t-27">
                            Login
                        </span>
                        <div className="wrap-input100 validate-input" data-validate="Enter username">
                            <input
                                className="input100"
                                type="text"
                                name="username"
                                placeholder="Email/Phone Number"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)} />
                            <span className="focus-input100" data-placeholder=""></span>
                        </div>
                        <div className="wrap-input100 validate-input" data-validate="Enter password">
                            <input
                                className="input100"
                                type="password"
                                name="pass"
                                placeholder="Password"
                                value={Password}
                                onChange={(e) => setPassword(e.target.value)} />
                            <span className="focus-input100" data-placeholder=""></span>
                        </div>
                        {/* <div className="error-message-container">
                                {ErrorMessage && (
                                    <>
                                        {ErrorMessage.message && <p className="error-message">{ErrorMessage.message}</p>}
                                        {ErrorMessage.error && ErrorMessage.error.length > 0 && <p className="error-message">{ErrorMessage.error[0].msg}</p>}
                                    </>
                                )}
                            </div> */}
                        <Toaster />
                        {/* <div className="contact100-form-checkbox">
                                <input className="input-checkbox100" id="ckb1" type="checkbox" name="remember-me" />
                                <label className="label-checkbox100" htmlFor="ckb1">
                                    Remember me
                                </label>
                            </div> */}
                        <div className="container-login100-form-btn">
                            <button className="login100-form-btn" onClick={handleIsLogin} disabled={isLoading}>
                                {isLoading ? (
                                    <Oval
                                        height={20}
                                        width={20}
                                        color="#fff"
                                    />
                                ) : (
                                    <>
                                        Login
                                        <i className="zmdi zmdi-arrow-right"></i>
                                    </>
                                )}
                            </button>
                            <button className="login100-form-btn google-btn" onClick={handleLoginWithGoogle}>
                                <i class="fab fa-google"></i> Sign in with Google
                            </button>
                        </div>
                        <div className='switchregister'>
                            <p>Not registered?</p>
                            <a href='' onClick={handleShowLogin}>Create an account</a>
                        </div>
                        <div className="text-center p-t-90">
                            <a className="txt1" href="" onClick={(e) => { e.preventDefault(); setForgotPass(true); }}>
                                Forgot Password?
                            </a>
                        </div>
                        <div className="text-center p-t-20">
                            <button className="back-to-home-btn" onClick={() => { navigate('/Customer/home') }}>
                                Back to Home
                                <i className="zmdi zmdi-home"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
}

export default Login
