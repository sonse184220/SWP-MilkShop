import { useState, useEffect } from "react";
import { getUser } from "../../services/editprofile/getUser"; // Adjust the import path accordingly
import { putInfo } from "../../services/editprofile/putInfo";
import "./EditProfile.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";


const EditProfile = ({ isMember }) => {
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [SuccessMessage, setSuccessMessage] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");
  const userId = JSON.parse(localStorage.getItem("userData")).UserID;
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser(userId);
        setName(userData.Name);
        setEmail(userData.Email);
        setPhone(userData.Phone);
        setAddress(userData.Address);
      } catch (error) {
        setErrorMessage({ message: "Error fetching user data" });
      }
    };

    fetchUserData();
  }, [userId]);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (Password !== ConfirmPassword) {
      setIsPasswordMatch(false);
      setErrorMessage({ message: "Passwords do not match" });
      return;
    }

    setIsPasswordMatch(true);

    const updatedUserData = {
      Name,
      Email,
      Phone,
      Address,
      ...(Password && { Password }),
    };

    try {
      const response = await putInfo(userId, updatedUserData);
      setSuccessMessage({ message: "Profile updated successfully!" });
      setName(response.Name);
      setEmail(response.Email);
      setPhone(response.Phone);
      setAddress(response.Address);
    } catch (error) {
      setErrorMessage({ message: "Error updating profile" });
    }
  };

  return (
    <>
      <img className="image" src="/img/P004.jpg" alt="Blog Header" />
      <Header isMember={isMember} />
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
                  <form onSubmit={handleEditProfile}>
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
                        value={Name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <i className="zmdi zmdi-account"></i>
                    </div>
                    <div className="form-wrapper">
                      <input
                        type="text"
                        placeholder="Email Address"
                        className="form-control"
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <i className="zmdi zmdi-email"></i>
                    </div>
                    <div className="form-wrapper">
                      <input
                        type="text"
                        placeholder="Phone"
                        className="form-control"
                        value={Phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      <i className="zmdi zmdi-phone"></i>
                    </div>
                    <div className="form-wrapper">
                      <input
                        type="text"
                        placeholder="Address"
                        className="form-control"
                        value={Address}
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
                    <button type="submit">
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
