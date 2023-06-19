import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';


function Register() {

  const [errorMessage, setErrorMessage] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) {
      setShouldRedirect(true);
    }
  })
  
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const passwordConfirm = event.target.passwordConfirm.value;

    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, passwordConfirm })
      });

      const data = await response.json();
      if (data.success === false) {
        setErrorMessage(data.error);
      } else {
        setErrorMessage(data.message);
        setShouldRedirect(true);
        
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <div>
      <nav>
        <h4>JWT example</h4>
        <ul>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav>

      <div className="container mt-4">
        <div className="card">
          <div className="card-header">
            Register
          </div>
          <div className="card-body">
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" className="form-control" id="name" name="name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" className="form-control" id="email" name="email" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" name="password" />
              </div>
              <div className="form-group">
                <label htmlFor="passwordConfirm">Confirm Password</label>
                <input type="password" className="form-control" id="passwordConfirm" name="passwordConfirm" />
              </div>
              <br />
              <button type="submit" className="btn btn-primary">Register User</button>
              {errorMessage && (
              <div className="alert alert-danger" style={{ width: 'fit-content', margin: '10px auto', color: 'red' }}>
                {errorMessage}
              </div>
              )}
            </form>
            
          </div>
        </div>
      </div>

      {shouldRedirect && <Navigate to="/profile" replace />}
    </div>
  );
}

export default Register;
