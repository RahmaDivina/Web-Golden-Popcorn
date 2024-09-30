import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Basic validation
    if (!username || !password) {
      setErrorMessage('Username and password are required!');
      return;
    }

    // Clear any previous error message
    setErrorMessage('');

    // Send login request to server
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('token', data.token); // Save JWT token
        window.location.href = '/home'; // Redirect on successful login
      } else {
        setErrorMessage(data.message); // Set error message from server
      }
    })
    .catch(error => {
      setErrorMessage('An error occurred while logging in. Please try again.');
      console.error('Error:', error);
    });
  };

  return (
    <div className="login-page" style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Background Image */}
      <div 
        style={{
          backgroundImage: "url('/images/background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          filter: 'blur(5px)',
          zIndex: -1, // Places the background behind the form
        }}
      />
      
      {/* Overlay for the form */}
      <div className="overlay container-fluid vh-100 d-flex align-items-center justify-content-center">
        <div 
          className="row shadow-lg rounded p-5" 
          style={{ 
            maxWidth: '500px', 
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', 
          }}
        >
          <div className="col-12">
            <form id="log-in-form" onSubmit={handleSubmit}>
              <h1 className="mb-4 text-white" style={{ fontWeight: 'bold', fontSize: '3rem' }}>Log In</h1> {/* Bold title */}
              
              {/* Username Field */}
              <div className="mb-3"> {/* Added margin-bottom for spacing */}
                <InputField label="Username" type="text" id="username" placeholder="Username" />
              </div>
              
              <div className="mb-4 position-relative"> {/* Added position-relative for icon positioning */}
                <InputField
                  label="Password"
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                />
                <span
                  onClick={togglePasswordVisibility}
                  style={{ 
                    position: 'absolute', 
                    right: '10px', 
                    top: '50%',  
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: '#6c757d',
                  }}
                >
                  <i className={`fas ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i> 
                </span>
              </div>

              {/* Error Message */}
              {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>} {/* Error message below password */}

              <div className="d-flex justify-content-between mb-3">
                <a href="/password-reset" className='text-white'>Forgot password?</a>
              </div>
              
              {/* Log In Button */}
              <Button text="Log In" className="btn btn-golden w-100 rounded-pill mb-3" />
              <div className="text-center text-white mb-3">OR</div>
              {/* Social Media Buttons */}
              <Button className="btn btn-light w-100 rounded-pill mb-2 d-flex align-items-center justify-content-center">
                <img src="/images/google_logo.png" alt="Google" style={{ width: '20px' }} className="me-2" />
                Log in with Google
              </Button> 
            </form>
            <div id="toggle-container" className="text-center mt-4">
              <p id="toggle-text" className="text-white">
                Don't have an account? <a href="/register"><strong>Register</strong></a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
