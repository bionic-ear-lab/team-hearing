
import React, { useState, useEffect, useContext } from "react";
import "../style/ProfilePage.css";
import { AuthContext } from "../context/AuthContext";

interface Device {
  id?: number;
  ear: string;
  deviceType: string;
  manufacturer: string;
  activationDate: string;
}

export default function ProfilePage() {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    id: 0,  
    name: "",
    codename: "",
    email: "",
    birthdate: "",
    gender: "",
    volume: 1.0,
  });

  const [saveStatus, setSaveStatus] = useState("");
  const [devices, setDevices] = useState<Device[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingDevices, setIsEditingDevices] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deviceSaveStatus, setDeviceSaveStatus] = useState("");

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

        // fetch devices
        return fetch(`/api/devices/${data.id}`, {
          headers: { 'Authorization': authToken }
        });
      })
      .then((res) => {
      if (!res.ok) {
        console.warn("Failed to fetch devices, setting empty array");
        return [];
      }
      return res.json();
    })
    .then((deviceData) => {
      console.log("Devices received:", deviceData);
      setDevices(deviceData || []);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setSaveStatus("Error loading profile. Please log in again.");
      setLoading(false);
    });
  }, []);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "volume") {
      setProfile((prev) => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
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
        // Update AuthContext with new volume
        if (user && profile.volume !== undefined) {
          setUser({ ...user, volume: profile.volume });
        }
      } else {
        setSaveStatus(`Failed: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveStatus("Error updating profile. Please try again.");
    }
  };

  const handleAddDevice = () => {
    setDevices([...devices, {
      ear: "Left",
      deviceType: "Cochlear Implant",
      manufacturer: "Advanced Bionics",
      activationDate: ""
    }]);
  };
  
  const handleDeviceChange = (index : number, field: keyof Device, value: string) => {
    const updated = [...devices];
    updated[index] = { ...updated[index], [field]: value };
    setDevices(updated);
  };

  const handleRemoveDevice = (index: number) => {
    setDevices(devices.filter((_, i) => i !== index));
  };

  const handleSaveDevices = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken || !profile.id) {
      setDeviceSaveStatus("Please log in again");
      return;
    }
    setDeviceSaveStatus("Saving...");

    try {
      const response = await fetch(`/api/devices/${profile.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken
        },
        body: JSON.stringify(devices),
      });

      const result = await response.json();

      if (response.ok) {
        setDeviceSaveStatus("Devices saved successfully!");
        setIsEditingDevices(false);
        setDevices(result.devices);
      } else {
        setDeviceSaveStatus(`Failed: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving devices:", error);
      setDeviceSaveStatus("Error saving devices. Please try again.");
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
            <div className="form-row">
              <label htmlFor="volume">Volume: {Math.round((profile.volume || 1.0) * 100)}%</label>
              <input
                id="volume"
                type="range"
                name="volume"
                min="0"
                max="1"
                step="0.01"
                value={profile.volume || 1.0}
                onChange={handleProfileChange}
                style={{ width: '100%' }}
              />
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
            <p><b>Volume:</b> {Math.round((profile.volume || 1.0) * 100)}%</p>
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
            {devices.map((device, index) => (
              <div key={index} style={{ 
                marginBottom: '20px', 
                padding: '15px', 
                border: '1px solid #ddd', 
                borderRadius: '8px',
                backgroundColor: '#f9f9f9'
              }}>
                <div className="form-row">
                  <label>Ear:</label>
                  <select
                    value={device.ear}
                    onChange={(e) => handleDeviceChange(index, 'ear', e.target.value)}
                  >
                    <option value="Left">Left</option>
                    <option value="Right">Right</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Device Type:</label>
                  <select
                    value={device.deviceType}
                    onChange={(e) => handleDeviceChange(index, 'deviceType', e.target.value)}
                  >
                    <option value="Cochlear Implant">Cochlear Implant</option>
                    <option value="Hearing Aid">Hearing Aid</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Manufacturer:</label>
                  <select
                    value={device.manufacturer}
                    onChange={(e) => handleDeviceChange(index, 'manufacturer', e.target.value)}
                  >
                    <option value="Advanced Bionics">Advanced Bionics</option>
                    <option value="Cochlear">Cochlear</option>
                    <option value="Med-El">Med-El</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Activation Date (optional):</label>
                  <input
                    type="date"
                    value={device.activationDate}
                    onChange={(e) => handleDeviceChange(index, 'activationDate', e.target.value)}
                  />
                </div>
                <button
                  onClick={() => handleRemoveDevice(index)}
                  style={{
                    marginTop: '10px',
                    padding: '6px 12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Remove Device
                </button>
              </div>
            ))}
            <button
              onClick={handleAddDevice}
              style={{
                marginTop: '10px',
                marginRight: '10px',
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              + Add Device
            </button>
            <button
              onClick={handleSaveDevices}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#68a5d0',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Save Devices
            </button>
            {deviceSaveStatus && (
              <div style={{
                marginTop: '10px',
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: deviceSaveStatus.includes('success') || deviceSaveStatus.includes('successfully') ? '#d4edda' : '#f8d7da',
                color: deviceSaveStatus.includes('success') || deviceSaveStatus.includes('successfully') ? '#155724' : '#721c24',
                border: `1px solid ${deviceSaveStatus.includes('success') || deviceSaveStatus.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`
              }}>
                {deviceSaveStatus}
              </div>
            )}
          </div>
        ) : (
          <div className="section-body">
            {devices.length === 0 ? (
              <p>No devices configured</p>
            ) : (
              devices.map((device, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <p><b>{device.ear} Ear:</b> {device.deviceType} - {device.manufacturer}</p>
                  {device.activationDate && <p><b>Activated:</b> {device.activationDate}</p>}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}