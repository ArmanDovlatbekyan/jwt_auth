import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import './style.css';


function TokenVerification() {
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    async function checkResponse() {
      try {
        const token = localStorage.getItem('token');
  
        const response = await fetch('http://localhost:8000/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'token': `Bearer ${token}`
          }
        });
  
        const data = await response.json();
  
        if (response.success || data.userInfo) {
          setShouldRedirect(false);
        }
      } catch (error) {
        console.error('Error during request:', error);
        setShouldRedirect(true);
      }
    }
  
    checkResponse();
  }, []);
  

  return shouldRedirect ? <Navigate to="/login" replace /> : <Navigate to="/profile" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TokenVerification />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;


