import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './Homepage';
import Navbar from './Navbar';
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import ProfilePage from "./ProfilePage";
import PlayNotePage from "./PlayNotePage";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/playnote" element={<PlayNotePage />} />
        <Route path="/" element={
          <div style={{ marginTop: '84px', padding: '20px' }}>
            <h1>Hi! Team hearing development in progress....yooooo</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;