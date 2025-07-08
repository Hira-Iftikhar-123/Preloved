import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DressForm from '../components/DressForm';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
    FaTshirt, 
    FaPlus, 
    FaEdit, 
    FaTrash, 
    FaChartLine, 
    FaShoppingCart,
    FaCog,
    FaBell,
    FaSearch,
    FaTicketAlt
} from 'react-icons/fa';
import AdminSupportDashboard from '../components/AdminSupportDashboard';

const AdminDashboard = () => {
    const [dresses, setDresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedDress, setSelectedDress] = useState(null);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dresses');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchDresses();
    }, [navigate]);

    const fetchDresses = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('/api/admin/dresses', {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            setDresses(response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
            } else {
                setError('Error fetching dresses');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this dress?')) return;

        try {
            await axios.delete(`/api/admin/dresses/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            fetchDresses();
        } catch (error) {
            setError('Error deleting dress');
        }
    };

    const handleEdit = (dress) => {
        setSelectedDress(dress);
        setShowForm(true);
    };

    const filteredDresses = dresses.filter(dress => {
        const matchesSearch = dress.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            dress.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || 
                            (filterStatus === 'available' && dress.isAvailable) ||
                            (filterStatus === 'unavailable' && !dress.isAvailable);
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: dresses.length,
        available: dresses.filter(d => d.isAvailable).length,
        unavailable: dresses.filter(d => !d.isAvailable).length
    };

    return (
        <>
            <Header />
            <div className="admin-dashboard">
                {/* Top Navigation Bar */}
                <div className="admin-top-nav">
                    <div className="admin-nav-content">
                        <div className="admin-nav-left">
                            <h1 className="admin-title">
                                <FaTshirt className="admin-icon" />
                                Admin Dashboard
                            </h1>
                        </div>
                        <div className="admin-nav-right">
                            <div className="admin-search-box">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search dresses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="admin-search-input"
                                />
                            </div>
                            <button className="admin-notification-btn">
                                <FaBell />
                                <span className="notification-badge">3</span>
                            </button>
                            <button className="admin-settings-btn">
                                <FaCog />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="admin-content-wrapper">
                    {/* Sidebar */}
                    <aside className="admin-sidebar">
                        <div className="sidebar-stats">
                            <div className="stat-card">
                                <div className="stat-icon total">
                                    <FaTshirt />
                                </div>
                                <div className="stat-content">
                                    <h3>{stats.total}</h3>
                                    <p>Total Dresses</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon available">
                                    <FaChartLine />
                                </div>
                                <div className="stat-content">
                                    <h3>{stats.available}</h3>
                                    <p>Available</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon unavailable">
                                    <FaShoppingCart />
                                </div>
                                <div className="stat-content">
                                    <h3>{stats.unavailable}</h3>
                                    <p>Unavailable</p>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-actions">
                            <button
                                className="add-dress-btn"
                                onClick={() => {
                                    setSelectedDress(null);
                                    setShowForm(true);
                                }}
                            >
                                <FaPlus />
                                Add New Dress
                            </button>
                        </div>

                        <div className="sidebar-filters">
                            <h4>Filters</h4>
                            <div className="filter-group">
                                <label>Status</label>
                                <select 
                                    value={filterStatus} 
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="all">All Dresses</option>
                                    <option value="available">Available</option>
                                    <option value="unavailable">Unavailable</option>
                                </select>
                            </div>
                        </div>
                        <div className="sidebar-tabs" style={{ marginTop: 32 }}>
                            <button
                                className={`sidebar-tab-btn${activeTab === 'dresses' ? ' active' : ''}`}
                                onClick={() => setActiveTab('dresses')}
                            >
                                <FaTshirt style={{ marginRight: 8 }} /> Dress Management
                            </button>
                            <button
                                className={`sidebar-tab-btn${activeTab === 'support' ? ' active' : ''}`}
                                onClick={() => setActiveTab('support')}
                            >
                                <FaTicketAlt style={{ marginRight: 8 }} /> Support Tickets
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="admin-main">
                        {activeTab === 'dresses' && (
                            <>
                                <div className="main-header">
                                    <h2>Dress Management</h2>
                                    <p>Manage your dress inventory and track performance</p>
                                </div>

                                {error && (
                                    <div className="error-alert">
                                        <span>{error}</span>
                                        <button onClick={() => setError('')}>&times;</button>
                                    </div>
                                )}

                                {showForm ? (
                                    <div className="form-overlay">
                                        <DressForm
                                            dress={selectedDress}
                                            onClose={() => {
                                                setShowForm(false);
                                                setSelectedDress(null);
                                            }}
                                            onSave={() => {
                                                setShowForm(false);
                                                setSelectedDress(null);
                                                fetchDresses();
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="dresses-container">
                                        {isLoading ? (
                                            <div className="loading-container">
                                                <div className="loading-spinner"></div>
                                                <p>Loading dresses...</p>
                                            </div>
                                        ) : filteredDresses.length === 0 ? (
                                            <div className="empty-state">
                                                <FaTshirt className="empty-icon" />
                                                <h3>No dresses found</h3>
                                                <p>Try adjusting your search or filters</p>
                                            </div>
                                        ) : (
                                            <div className="dresses-grid">
                                                {filteredDresses.map((dress) => (
                                                    <div key={dress._id} className="dress-card">
                                                        <div className="dress-status-badge">
                                                            <span className={`status ${dress.isAvailable ? 'available' : 'unavailable'}`}>
                                                                {dress.isAvailable ? 'Available' : 'Unavailable'}
                                                            </span>
                                                        </div>
                                                        <div className="dress-image-container">
                                                            {dress.images && dress.images.length > 0 ? (
                                                                <img
                                                                    src={dress.images[0]}
                                                                    alt={dress.name}
                                                                    className="dress-image"
                                                                />
                                                            ) : (
                                                                <div className="no-image-placeholder">
                                                                    <FaTshirt />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="dress-info">
                                                            <h4 className="dress-brand">{dress.brand}</h4>
                                                            <p className="dress-category">{dress.category}</p>
                                                            <div className="dress-actions">
                                                                <button
                                                                    className="action-btn edit-btn"
                                                                    onClick={() => handleEdit(dress)}
                                                                >
                                                                    <FaEdit />
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    className="action-btn delete-btn"
                                                                    onClick={() => handleDelete(dress._id)}
                                                                >
                                                                    <FaTrash />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                        {activeTab === 'support' && (
                            <AdminSupportDashboard />
                        )}
                    </main>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AdminDashboard; 