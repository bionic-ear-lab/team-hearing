import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Homepage from './Homepage';
import Navbar from './Navbar';
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import ProfilePage from "./ProfilePage";
import MusicExercises from './MusicExercises';
import '../style/App.css';
import ExerciseHomepage from './ExerciseHomepage';
import TestTemplateTest from "./TestTemplateTest"; // Import your test page component
import PitchResolutionTest from './PitchResolutionTest';
import PitchResolutionTestResults from './PitchResolutionTestResults';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from "../routes/ProtectedRoute";
import PitchResolutionResults from './PitchResolutionResults';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ConditionalNavbar />
        <Routes>
          <Route path="/homepage" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/music-exercises" element={<ProtectedRoute><MusicExercises /></ProtectedRoute>} />
          <Route path="/exercise/:exerciseName" element={<ProtectedRoute><ExerciseHomepage /></ProtectedRoute>} />
          <Route path="/test-template-test" element={<ProtectedRoute><TestTemplateTest /></ProtectedRoute>} /> {/* Add this line */}
          <Route path="/pitch-resolution-test" element={<ProtectedRoute><PitchResolutionTest /></ProtectedRoute>} />
          <Route path="/pitch-resolution-test-results" element={<ProtectedRoute><PitchResolutionTestResults /></ProtectedRoute>} />
          <Route path="/pitch-resolution-results" element={<ProtectedRoute><PitchResolutionResults /></ProtectedRoute>} />
          {/*Add <ProtectedRoute> </ProtectedRoute> to make it so that not logged in users can't access the page pls*/}
          <Route path="*" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const ConditionalNavbar: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  return <Navbar showAuthButtons={!isAuthPage} />;
};

export default App;