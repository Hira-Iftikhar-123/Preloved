import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import Badge from 'react-bootstrap/Badge';
import Modal from '../Model';
import Cart from '../screens/Cart';
import { useCart } from './ContextReducer';
import axios from 'axios';

export default function Header() {
  const [cartView, setCartView] = useState(false);
  const [categories, setCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  let data = useCart();
  const [, setDresses] = useState([]);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogOut = () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('isAdmin');
      navigate('/login');
    };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let response = await fetch('/api/data?action=getDresses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        response = await response.json();
        setCategories(response[1] || []);
      } catch (error) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleCategoryClick = (categoryName) => {
    setDropdownOpen(false);
    navigate('/', { state: { selectedCategory: categoryName } });
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    axios.get('/api/dresses')
      .then(res => setDresses(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top shadow-sm"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="container-fluid px-4">
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
          style={{ color: '#34495e' }}
        >
          <span className="fw-bold fs-3">Preloved</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ backgroundColor: '#34495e', width: '60px', height: '38px' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/" style={{ color: '#2c2c2c' }}>
                Home
              </Link>
            </li>
            {!isAdmin && !isAdminRoute && (
              <>
                <li className="nav-item position-relative" ref={dropdownRef}>
                  <button
                    className="nav-link px-3 btn btn-link"
                    style={{ color: '#2c2c2c', textDecoration: 'none' }}
                    onClick={() => setDropdownOpen((open) => !open)}
                    type="button"
                  >
                    Categories <span className="ms-1">▾</span>
                  </button>
                  {dropdownOpen && (
                    <div className="styled-category-dropdown position-absolute mt-2 z-3" style={{ left: 0 }}>
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <div
                            key={cat._id}
                            className="styled-category-item"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleCategoryClick(cat.CategoryName)}
                          >
                            {cat.CategoryName}
                          </div>
                        ))
                      ) : (
                        <div className="styled-category-item text-muted">Loading...</div>
                      )}
                    </div>
                  )}
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/about" style={{ color: '#2c2c2c' }}>
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/support" style={{ color: '#2c2c2c' }}>
                    Support
                  </Link>
                </li>
                {localStorage.getItem('authToken') ? (
                  <li className='nav-item'>
                    <Link className="nav-link" to="/myorder" style={{ color: '#2c2c2c' }}> My Orders</Link>
                  </li>
                ) : null}
              </>
            )}
          </ul>
          {isAdmin ? (
            <div className='btn btn-danger rounded-pill' onClick={handleLogOut}>
              Logout
            </div>
          ) : (
            !isAdminRoute && (
              <>
                {!localStorage.getItem('authToken') ? (
                  <div className='d-flex gap-2'>
                    <Link className="btn btn-outline-dark rounded-pill me-2" to="/login">
                      Login
                    </Link>
                    <Link
                      className="btn rounded-pill"
                      to="/signup"
                      style={{ backgroundColor: '#34495e', color: 'white', border: 'none' }}>
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div className='btn btn-outline-dark rounded-pill mx-2' onClick={() => setCartView(true)}>
                      My Cart {" "}
                      {data.length > 0 && (
                        <Badge pill bg="primary"> {data.length} </Badge>
                      )}
                    </div>
                    {cartView ? <Modal onClose={() => setCartView(false)}><Cart /></Modal> : null}
                    <div className='btn btn-danger rounded-pill' onClick={handleLogOut}>
                      Logout
                    </div>
                  </div>
                )}
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
