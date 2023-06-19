import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function Profile() {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch('http://localhost:8000/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            setMessage('Error: ' + data.error);
          } else {
            const username = data.username;
            setMessage('User --> ' + username);
          }
        })
        .catch(error => {
          setMessage('Error: ' + error.message);
        });
    } else {
      setMessage('User not logged in');
      setShouldRedirect(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setShouldRedirect(true);
  };

  return (
    <div>
      <nav>
        <h4>Welcome to the JWT example</h4>
        <ul>
          <li>
            <button type="button" className="logoutButton" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <div className="container mt-4">
        <div className="jumbotron">
          <h1>Welcome to the profile page</h1>
          <div id="message">{message}</div>
        </div>
      </div>

      {shouldRedirect && <Navigate to="/login" replace />}
    </div>
  );
}

export default Profile;
