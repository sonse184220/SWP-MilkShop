import React, { useState } from "react";
import "./StaffProfile.css";

const StaffProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "https://via.placeholder.com/150",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({
          ...profile,
          avatar: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to submit form data
    console.log("Profile updated:", profile);
  };

  return (
    <div
      className="edit-profile-container"
      style={{
        backgroundImage: `url('/img/backgroundStaff.jpg')`, // Set the background image here
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="header-container">
        <h2>Staff Profile</h2>
        <button>
          <a href="/Staff/OrderManagement">Back to main</a>
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-4">
            <div className="avatar-section">
              <img
                src={profile.avatar}
                alt="Avatar"
                className="avatar-preview"
              />
              <input
                id="staff-avatar"
                type="file"
                name="avatar"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="col-lg-8">
            <div className="profile-content">
              <div className="info-section">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StaffProfile;
