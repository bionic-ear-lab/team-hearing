import React, { useState } from "react";
import "../style/ProfilePage.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Lee Seokmin",
    userId: "1717",
    codename: "DK-010",
    email: "seokminl@fakemail.com",
    birthdate: "1997-02-18",
    gender: "Male",
  });

  const [devices, setDevices] = useState("N/A");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingDevices, setIsEditingDevices] = useState(false);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="profile-container">
      {/* Profile Section */}
      <div className="section">
        <div className="section-header">
          <h3>Profile</h3>
          <button
            className="edit-btn"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
          >
            ✏️
          </button>
        </div>
        {isEditingProfile ? (
          <div className="section-body">
            <div className="form-row">
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="userid">User ID:</label>
              <input
                id="userid"
                type="text"
                name="userId"
                value={profile.userId}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="codename">Codename:</label>
              <input
                id="codename"
                type="text"
                name="codename"
                value={profile.codename}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="birthdate">Birthdate:</label>
              <input
                id="birthdate"
                type="text"
                name="birthdate"
                value={profile.birthdate}
                onChange={handleProfileChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="gender">Gender:</label>
              <select
                id="gender"
                name="gender"
                value={profile.gender}
                onChange={handleProfileChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="section-body">
            <p>
              <b>Name:</b> {profile.name}
            </p>
            <p>
              <b>User ID:</b> {profile.userId}
            </p>
            <p>
              <b>Codename:</b> {profile.codename}
            </p>
            <p>
              <b>Email:</b> {profile.email}
            </p>
            <p>
              <b>Birthdate:</b> {profile.birthdate}
            </p>
            <p>
              <b>Gender:</b> {profile.gender}
            </p>
          </div>
        )}
      </div>

      {/* Devices Section */}
      <div className="section">
        <div className="section-header">
          <h3>Devices</h3>
          <button
            className="edit-btn"
            onClick={() => setIsEditingDevices(!isEditingDevices)}
          >
            ✏️
          </button>
        </div>
        {isEditingDevices ? (
          <div className="section-body">
            <label><b>Devices:</b></label>
            <textarea value={devices} onChange={(e) => setDevices(e.target.value)} />
          </div>
        ) : (
          <div className="section-body">
            <p>{devices}</p>
          </div>
        )}
      </div>
    </div>
  );
}
