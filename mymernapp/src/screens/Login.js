import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import '../components/Auth.css';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate()
  const logo = process.env.PUBLIC_URL + '/download.jpeg';

  useEffect(() => {
    document.body.classList.add('auth-bg');
    return () => document.body.classList.remove('auth-bg');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post('/api/loginuser', credentials);
      if (response.data.success && response.data.authToken) {
        localStorage.setItem('authToken', response.data.authToken);
        localStorage.setItem('userEmail', response.data.email);
        localStorage.setItem('isAdmin', 'false');
        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => navigate('/'), 1000);
      } else {
        setError(response.data.error || "Login failed");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed");
      }
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <>
      <Header />
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 200px)', marginTop: '100px' }}>
        <div className="auth-card card shadow-lg w-100" style={{ maxWidth: '500px' }}>
          <div className="card-body p-5">
            <div className="auth-logo">
              <img src={logo} alt="Logo" />
            </div>
            <h2 className="auth-title mb-2">Welcome Back</h2>
            <p className="auth-subtitle mb-4">Please login to your account</p>
            
            {error && (
              <div className="auth-alert alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="exampleInputEmail1" className="form-label" style={{ color: '#34495e' }}>Email address</label>
                <input 
                  type="email" 
                  className="form-control auth-input" 
                  name="email" 
                  value={credentials.email} 
                  onChange={onChange} 
                  id="exampleInputEmail1" 
                  aria-describedby="emailHelp"
                />
                <div id="emailHelp" className="form-text">Format: xyz@example.com</div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="exampleInputPassword1" className="form-label" style={{ color: '#34495e' }}>Password</label>
                <input 
                  type="password" 
                  className="form-control auth-input" 
                  name="password" 
                  value={credentials.password} 
                  onChange={onChange} 
                  id="exampleInputPassword1"
                />
              </div>

              <div className="d-grid gap-2">
                <button type="submit" className="auth-btn btn btn-primary btn-lg">
                  Login
                </button>
              </div>
            </form>

            {successMessage && (
              <div className="auth-alert alert alert-success mt-4 text-center" role="alert">
                {successMessage}
              </div>
            )}

            <div className="text-center mt-4">
              <p className="text-muted">Don't have an account?</p>
              <Link to="/signup" className="auth-link btn btn-outline-primary rounded-pill px-4">
                Sign Up
              </Link>
            </div>
            <div className="text-center mt-3">
              <Link to="/admin/login" className="auth-link btn btn-outline-info rounded-pill px-4">
                Login as Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
