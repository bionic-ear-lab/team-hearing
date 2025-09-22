import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './homepage';
import Navbar from './Navbar';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/" element={
          <div style={{marginTop: '84px', padding: '20px'}}>
            <h1>Hi! Team hearing development in progress....yooooo</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
