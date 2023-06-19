import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) {
      setShouldRedirect(true);
    }
  })
  
  useEffect(() => {
    const loginButton = document.getElementById('loginButton');

    loginButton.addEventListener('click', async (event) => {
      event.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('http://localhost:8000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success === false) {
          
          setErrorMessage(data.message);
        } else if (data.success === true) {

          localStorage.setItem('token', data.token);
          setShouldRedirect(true);
        }
      } catch (error) {
        console.log('Error:', error);
      }
    });
  }, []);

  return (
    <div>
      <nav>
        <h4>JWT example</h4>
        <ul>
          <li><a href="/register">Register</a></li>
        </ul>
      </nav>

      <div className="container mt-4">
        <div className="card">
          <div className="card-header">
            Login
          </div>
          <div className="card-body">
            <form id="loginForm">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" className="form-control" id="email" name="email" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" name="password" />
              </div>
              {errorMessage && (
                <div className="alert alert-danger" style={{ width: 'fit-content', margin: '10px auto', color: 'red' }}>
                  {errorMessage}
                </div>
              )}
              <button type="button" className="btn btn-primary" id="loginButton">Login</button>
            </form>
          </div>
        </div>
      </div>

      {shouldRedirect && <Navigate to="/profile" replace />}
    </div>
  );
}

export default Login;
