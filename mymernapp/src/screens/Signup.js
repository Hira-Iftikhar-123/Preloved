import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Signup() {
    const [credentials, setcredentials] = useState({ name: "", email: "", password: "", geolocation: "" });
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

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
        console.log(json);

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
                <div className="card shadow-lg" style={{ width: '100%', maxWidth: '500px', background: '#2c2c2c', border: 'none' }}>
                    <div className="card-body p-5">
                        <h2 className="text-center mb-4" style={{ color: '#ffffff' }}>Create Account</h2>
                        <p className="text-center text-muted mb-4">Be a part of our community</p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="form-label" style={{ color: '#ffffff' }}>Full Name</label>
                                <input 
                                    type="text" 
                                    className="form-control bg-dark text-light border-0" 
                                    name="name" 
                                    value={credentials.name} 
                                    onChange={onChange}
                                    style={{ padding: '12px' }}
                                />
                            </div>

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
                                <div className="form-text">Password must be at least 8 characters long</div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="exampleInputGeolocation" className="form-label" style={{ color: '#ffffff' }}>Address</label>
                                <input 
                                    type="text" 
                                    className="form-control bg-dark text-light border-0" 
                                    name="geolocation" 
                                    value={credentials.geolocation} 
                                    onChange={onChange} 
                                    id="exampleInputGeolocation"
                                    style={{ padding: '12px' }}
                                />
                            </div>

                            <div className="d-grid gap-2">
                                <button type="submit" className="btn btn-primary btn-lg" style={{ padding: '12px', backgroundColor: '#34495e', border: 'none' }}>
                                    Create Account
                                </button>
                            </div>
                        </form>

                        {successMessage && (
                            <div className="alert alert-success mt-4 text-center" role="alert">
                                {successMessage}
                            </div>
                        )}

                        <div className="text-center mt-4">
                            <p className="text-muted">Already have an account?</p>
                            <Link to="/login" className="btn btn-outline-light rounded-pill px-4">
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
