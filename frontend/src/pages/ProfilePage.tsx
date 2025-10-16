
import React, { useState, useEffect } from "react";
import "../style/ProfilePage.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    id: 0,  
    name: "",
    codename: "",
    email: "",
    birthdate: "",
    gender: "",
  });

  const [saveStatus, setSaveStatus] = useState("");
  const [devices, setDevices] = useState("N/A");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingDevices, setIsEditingDevices] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from backend on mount
  useEffect(() => {
    console.log("Fetching user profile...");

    // Get auth token from localStorage
    const authToken = localStorage.getItem('authToken');
    console.log("Auth token:", authToken);

    if (!authToken) {
      console.error("No auth token found");
      setSaveStatus("Please log in again");
      setLoading(false);
      return;
    }

    fetch("/api/users/me", {
      headers: {
        'Authorization': authToken 
      }
    })
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        console.log("Profile data received:", data);
        setProfile(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setSaveStatus("Error loading profile. Please log in again.");
        setLoading(false);
      });
  }, []);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    // Validate that we have an ID
    if (!profile.id || profile.id === 0) {  
      setSaveStatus("Error: User ID is missing. Please log in again.");
      console.error("Cannot save: profile.id is missing or invalid");
      return;
    }

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setSaveStatus("Please log in again");
      return;
    }

    console.log("Saving profile:", profile);
    setSaveStatus("Saving...");

    try {
      const response = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken  
        },
        body: JSON.stringify(profile),
      });

      console.log("Update response status:", response.status);
      const result = await response.json();
      console.log("Update response:", result);

      if (response.ok) {
        setSaveStatus(result.message || "Profile updated successfully!");
        setIsEditingProfile(false);
      } else {
        setSaveStatus(`Failed: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveStatus("Error updating profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="section">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error if profile didn't load
  if (!profile.id) {
    return (
      <div className="profile-container">
        <div className="section">
          <p style={{ color: 'red' }}>Failed to load profile. Please log in again.</p>
        </div>
      </div>
    );
  }

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
              <label htmlFor="id">User ID:</label>
              <input
                id="id"
                type="text"
                name="id"
                value={profile.id}
                disabled
                style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
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
                type="date"
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
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button
              className="save-btn"
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                cursor: 'pointer',
                backgroundColor: '#68a5d0',
                color: 'white',
                border: 'none',
                borderRadius: '5px'
              }}
              onClick={handleSaveProfile}
            >
              Save Changes
            </button>
            {saveStatus && (
              <div style={{
                marginTop: '10px',
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: saveStatus.includes('success') || saveStatus.includes('successfully') ? '#d4edda' : '#f8d7da',
                color: saveStatus.includes('success') || saveStatus.includes('successfully') ? '#155724' : '#721c24',
                border: `1px solid ${saveStatus.includes('success') || saveStatus.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`
              }}>
                {saveStatus}
              </div>
            )}
          </div>
        ) : (
          <div className="section-body">
            <p><b>Name:</b> {profile.name || "Not set"}</p>
            <p><b>User ID:</b> {profile.id}</p>
            <p><b>Codename:</b> {profile.codename || "Not set"}</p>
            <p><b>Email:</b> {profile.email || "Not set"}</p>
            <p><b>Birthdate:</b> {profile.birthdate || "Not set"}</p>
            <p><b>Gender:</b> {profile.gender || "Not set"}</p>
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
            <textarea
              value={devices}
              onChange={(e) => setDevices(e.target.value)}
              style={{ minHeight: '100px', width: '100%' }}
            />
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