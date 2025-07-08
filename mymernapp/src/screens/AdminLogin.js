import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../components/Auth.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const logo = process.env.PUBLIC_URL + '/download.jpeg';

    useEffect(() => {
        document.body.classList.add('auth-bg');
        return () => document.body.classList.remove('auth-bg');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/admin/login', { email, password });
            const { token, isAdmin } = response.data;

            if (!isAdmin) {
                setError('Access denied. Admin privileges required.');
                return;
            }

            localStorage.setItem('adminToken', token);
            localStorage.setItem('isAdmin', 'true');
            setSuccessMessage("Login successful! Redirecting...");
            setTimeout(() => navigate('/admin/dashboard'), 1000);
        } catch (error) {
            setError(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <>
            <Header />
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 200px)', marginTop: '100px' }}>
                <div className="auth-card card shadow-lg w-100" style={{ maxWidth: '500px' }}>
                    <div className="card-body p-5">
                        <div className="auth-logo">
                            <img src={logo} alt="Logo" />
                        </div>
                        <h2 className="auth-title mb-2">Admin Login <span className="badge bg-danger ms-2" style={{ fontSize: '1rem', verticalAlign: 'middle' }}>Admin</span></h2>
                        <p className="auth-subtitle mb-4">Access the admin dashboard</p>
                        {successMessage && (
                            <div className="auth-alert alert alert-success" role="alert">
                                {successMessage}
                            </div>
                        )}
                        {error && (
                            <div className="auth-alert alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="form-label" style={{ color: '#34495e' }}>Email address</label>
                                <input
                                    type="email"
                                    className="form-control auth-input"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="form-label" style={{ color: '#34495e' }}>Password</label>
                                <input
                                    type="password"
                                    className="form-control auth-input"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="auth-btn btn btn-primary btn-lg">
                                    Login
                                </button>
                            </div>
                        </form>
                        <div className="text-center mt-4">
                            <Link to="/" className="auth-link btn btn-outline-primary rounded-pill px-4">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AdminLogin; 