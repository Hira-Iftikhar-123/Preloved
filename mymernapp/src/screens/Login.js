import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [successMessage, setSuccessMessage] = useState("");
  let navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/loginuser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const json = await response.json();

      if (json.success) {
        localStorage.setItem('userEmail', credentials.email);
        localStorage.setItem('authToken', json.authToken);
        setSuccessMessage("Login successful!");

        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        console.log('Login failed, response:', json);
        alert(json.error || "Enter Valid Credentials");
      }
    }
    catch (error) {
      console.error('Login error:', error);
      alert("Login failed. Please try again.");
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <>
      <Header />
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 200px)', marginTop: '100px' }}>
        <div className="card shadow-lg" style={{ width: '100%', maxWidth: '500px', background: '#2c2c2c', border: 'none' }}>
          <div className="card-body p-5">
            <h2 className="text-center mb-4" style={{ color: '#ffffff' }}>Welcome Back</h2>
            <p className="text-center text-muted mb-4">Please login to your account</p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="exampleInputEmail1" className="form-label" style={{ color: '#ffffff' }}>Email address</label>
                <input 
                  type="email" 
                  className="form-control bg-dark text-light border-0" 
                  name="email" 
                  value={credentials.email} 
                  onChange={onChange} 
                  id="exampleInputEmail1" 
                  aria-describedby="emailHelp"
                  style={{ padding: '12px' }}
                />
                <div id="emailHelp" className="form-text">Format: xyz@example.com</div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="exampleInputPassword1" className="form-label" style={{ color: '#ffffff' }}>Password</label>
                <input 
                  type="password" 
                  className="form-control bg-dark text-light border-0" 
                  name="password" 
                  value={credentials.password} 
                  onChange={onChange} 
                  id="exampleInputPassword1"
                  style={{ padding: '12px' }}
                />
              </div>

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary btn-lg" style={{ padding: '12px', backgroundColor: '#34495e', border: 'none' }}>
                  Login
                </button>
              </div>
            </form>

            {successMessage && (
              <div className="alert alert-success mt-4 text-center" role="alert">
                {successMessage}
              </div>
            )}

            <div className="text-center mt-4">
              <p className="text-muted">Don't have an account?</p>
              <Link to="/signup" className="btn btn-outline-light rounded-pill px-4">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
