import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";
import handleEditProfile from "../../services/registerService";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

//prop showLogin chuyền từ App.js,
//dùng để set showLogin state
const EditProfile = ({ showLogin }) => {
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [SuccessMessage, setSuccessMessage] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");

  const handleEditProfile = async (event) => {
    event.preventDefault();
    try {
      setErrorMessage("");
      setSuccessMessage("");
      let userInfo;
      if (isPasswordMatch) {
        userInfo = { Name, Password, Email, Phone, Address };
        const response = await handleEditProfile(userInfo);
        if (response.data) {
          setSuccessMessage(response.data);
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      }
    }
  };

  //check password và confirmpassword có giống nhau ko
  useEffect(() => {
    setErrorMessage("");
    setSuccessMessage("");
    if (Password !== ConfirmPassword) {
      setIsPasswordMatch(false);
      setErrorMessage({ message: "Passwords do not match" });
    } else setIsPasswordMatch(true);
  }, [Password, ConfirmPassword, Name, Email, Phone, Address]);

  //component register
  return (
    <>
      <img className="image" src="/img/P004.jpg" alt="Blog Header" />
      <Header />
      <div className="editProfile">
        <div className="wrapper">
          <div className="inner">
            <div className="container">
              <div className="row">
                <div className="col-lg-6 image-holder">
                  <div className="image-holder-content">
                    <img src="https://via.placeholder.com/40" alt="" />
                    <div className="importButton">
                      <button>Import image</button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <form>
                    <h3>Edit profile</h3>
                    <div className="form-wrapper">
                      <input
                        type="password"
                        placeholder="Password"
                        className="form-control"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <i className="zmdi zmdi-lock"></i>
                    </div>
                    <div className="form-wrapper">
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        className="form-control"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <i className="zmdi zmdi-lock"></i>
                    </div>
                    <div className="form-wrapper">
                      <input
                        type="text"
                        placeholder="Name"
                        className="form-control"
                        onChange={(e) => setName(e.target.value)}
                      />
                      <i className="zmdi zmdi-account"></i>
                    </div>
                    <div className="form-wrapper">
                      <input
                        type="text"
                        placeholder="Email Address"
                        className="form-control"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <i className="zmdi zmdi-email"></i>
                    </div>
                    <div className="form-wrapper">
                      <input
                        type="text"
                        placeholder="Phone"
                        className="form-control"
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <i className="zmdi zmdi-phone"></i>
                    </div>
                    <div className="form-wrapper">
                      <input
                        type="text"
                        placeholder="Address"
                        className="form-control"
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      <i className="zmdi zmdi-home"></i>
                    </div>

                    <div>
                      {(ErrorMessage || SuccessMessage) && (
                        <>
                          {(!isPasswordMatch || ErrorMessage.message) && (
                            <p className="error-message">
                              {ErrorMessage.message}
                            </p>
                          )}
                          {ErrorMessage.error &&
                            ErrorMessage.error.length > 0 && (
                              <p className="error-message">
                                {ErrorMessage.error[0].msg}
                              </p>
                            )}
                          {SuccessMessage.message && (
                            <p className="success-message">
                              {SuccessMessage.message}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    <button onClick={handleEditProfile}>
                      Edit profile
                      <i className="zmdi zmdi-arrow-right"></i>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;
