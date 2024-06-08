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
      <img className="image" src="/img/4.jpg" alt="Blog Header" />
      <Header />
      <div className="wrapper">
        <div class="inner">
          <div className="container">
            <div className="row">
              <div class="col-lg-6 image-holder">
                <div className="image-holder-content">
                  <img src="https://via.placeholder.com/40" alt="" />
                  <div className="importButton">
                    <button>Import image</button>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <form>
                  <h3>Edit profile: </h3>
                  <div class="form-wrapper">
                    <input
                      type="password"
                      placeholder="Password"
                      class="form-control"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <i class="zmdi zmdi-lock"></i>
                  </div>
                  <div class="form-wrapper">
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      class="form-control"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <i class="zmdi zmdi-lock"></i>
                  </div>
                  <div class="form-wrapper">
                    <input
                      type="text"
                      placeholder="Name"
                      class="form-control"
                      onChange={(e) => setName(e.target.value)}
                    />
                    <i class="zmdi zmdi-account"></i>
                  </div>
                  <div class="form-wrapper">
                    <input
                      type="text"
                      placeholder="Email Address"
                      class="form-control"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <i class="zmdi zmdi-email"></i>
                  </div>
                  <div class="form-wrapper">
                    <input
                      type="text"
                      placeholder="Phone"
                      class="form-control"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <i class="zmdi zmdi-phone"></i>
                  </div>
                  <div class="form-wrapper">
                    <input
                      type="text"
                      placeholder="Address"
                      class="form-control"
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <i class="zmdi zmdi-home"></i>
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
                    <i class="zmdi zmdi-arrow-right"></i>
                  </button>
                </form>
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
