import { useState, useEffect } from "react";
import { getUser } from "../../services/editprofile/getUser";
import { putInfo } from "../../services/editprofile/putInfo";
import "./EditProfile.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Modal from "react-modal";
import { changePassword } from "../../services/changepassword/changePassword";

const EditProfile = ({ isMember }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [SuccessMessage, setSuccessMessage] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");
  const [OldPassword, setOldPassword] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [ConfirmNewPassword, setConfirmNewPassword] = useState("");
  const MemberToken = "Bearer " + sessionStorage.getItem("token");
  const userId = JSON.parse(sessionStorage.getItem("userData")).UserID;

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

  const handleChangePassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (NewPassword !== ConfirmNewPassword) {
      setErrorMessage({ message: "New passwords do not match" });
      return;
    }

    if (!OldPassword || !NewPassword || !ConfirmNewPassword) {
      setErrorMessage({ message: "All fields are required" });
      return;
    }

    try {
      const data = {
        oldPassword: OldPassword,
        newPassword: NewPassword,
        confirmPassword: ConfirmNewPassword,
      };
      console.log("Changing password with data:", data);
      const changePassW = await changePassword(MemberToken, data);
      setIsOpen(false);
      setSuccessMessage({ message: "Password changed successfully!" });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        if (Array.isArray(error.response.data.error)) {
          setErrorMessage({
            message: error.response.data.error.map((err) => err.msg).join(", "),
          });
        } else {
          setErrorMessage({ message: error.response.data.error });
        }
      } else {
        setErrorMessage({ message: "Error changing password" });
      }
    }
  };

  return (
    <>
      <img className="image" src="/img/milkbuying.jpeg" alt="Blog Header" />
      <Header isMember={isMember} />
      <div className="editProfile">
        <div className="wrapper">
          <div className="inner">
            <div className="container">
              <div className="row">
                <div className="col-lg-6 image-holder">
                  <div className="image-holder-content">
                    <img src="https://via.placeholder.com/30" alt="" />
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
                    <div className="changePassword">
                      <a onClick={() => setIsOpen(true)}>Change password?</a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="custom-modal-blog"
        overlayClassName="custom-overlay-blog"
      >
        <h2>Change password</h2>
        <label htmlFor="old-password">Old password: </label>
        <input
          type="password"
          id="old-password"
          placeholder="Enter old password"
          value={OldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />{" "}
        <br />
        <label htmlFor="new-password">New password: </label>
        <input
          type="password"
          id="new-password"
          placeholder="Enter new password"
          value={NewPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />{" "}
        <br />
        <label htmlFor="confirm-new-password">
          Confirm new password:{" "}
        </label>{" "}
        <input
          type="password"
          id="confirm-new-password"
          placeholder="Confirm new password"
          value={ConfirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />{" "}
        <br />
        <br />
        <div className="modal-actions-blog">
          <button className="btn-confirm-blog" onClick={handleChangePassword}>
            Confirm
          </button>
          <button onClick={() => setIsOpen(false)} className="btn-cancel-blog">
            Cancel
          </button>
        </div>
      </Modal>
      <Footer />
    </>
  );
};

export default EditProfile;
