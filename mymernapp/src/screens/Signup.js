import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../components/Auth.css';

export default function Signup() {
    const [credentials, setcredentials] = useState({ name: "", email: "", password: "", geolocation: "" });
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const logo = process.env.PUBLIC_URL + '/download.jpeg';

    useEffect(() => {
        document.body.classList.add('auth-bg');
        return () => document.body.classList.remove('auth-bg');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (credentials.password.length < 8) {
            alert("Password should be at least 8 characters long.");
            return; 
        }
        const response = await fetch("http://localhost:4000/api/createuser", {
            method: 'POST',
            headers: {  
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                name: credentials.name, 
                email: credentials.email, 
                password: credentials.password, 
                location: credentials.geolocation 
            })
        });
        const json = await response.json();

        if (!json.success) {
            alert('Enter valid Credentials');
        }
        else {
            setSuccessMessage("Signup successful!");

            setTimeout(() => {
                navigate('/'); 
            }, 2000); 
        }
    }

    const onChange = (event) => {
        setcredentials({ ...credentials, [event.target.name]: event.target.value });
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
                        <h2 className="auth-title mb-2">Create Account</h2>
                        <p className="auth-subtitle mb-4">Be a part of our community</p>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="form-label" style={{ color: '#34495e' }}>Full Name</label>
                                <input 
                                    type="text" 
                                    className="form-control auth-input" 
                                    name="name" 
                                    value={credentials.name} 
                                    onChange={onChange}
                                />
                            </div>
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
                                <div className="form-text">Password must be at least 8 characters long</div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="exampleInputGeolocation" className="form-label" style={{ color: '#34495e' }}>Address</label>
                                <input 
                                    type="text" 
                                    className="form-control auth-input" 
                                    name="geolocation" 
                                    value={credentials.geolocation} 
                                    onChange={onChange} 
                                    id="exampleInputGeolocation"
                                />
                            </div>
                            <div className="d-grid gap-2">
                                <button type="submit" className="auth-btn btn btn-primary btn-lg">
                                    Create Account
                                </button>
                            </div>
                        </form>
                        {successMessage && (
                            <div className="auth-alert alert alert-success mt-4 text-center" role="alert">
                                {successMessage}
                            </div>
                        )}
                        <div className="text-center mt-4">
                            <p className="text-muted">Already have an account?</p>
                            <Link to="/login" className="auth-link btn btn-outline-primary rounded-pill px-4">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
