import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaLeaf, FaTshirt, FaSmile, FaUsers } from 'react-icons/fa';

export default function About() {
  return (
    <>
      <Header />
      <div style={{ minHeight: '100%', background: '#2c2c2c', padding: '0', marginTop: '50px' }}>
        {/* Hero Section */}
        <div className="container py-5 text-center">
          <FaLeaf size={56} color="#ff9800" className="mb-3" />
          <h1 className="fw-bold" style={{ color: '#ffffff', fontSize: '2.7rem', letterSpacing: '1px' }}>
            About Preloved
          </h1>
          <p className="lead" style={{ color: '#ffffff', maxWidth: 600, margin: '16px auto 0' }}>
            Sustainable fashion, unique finds, and a community that cares. Discover the story behind Preloved.
          </p>
        </div>

        {/* Info Sections */}
        <div className="container pb-5">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                <div className="d-flex align-items-center mb-3">
                  <FaLeaf size={32} color="#ff9800" className="me-2" />
                  <h3 className="fw-semibold mb-0" style={{ color: '#232323' }}>Our Mission</h3>
                </div>
                <p style={{ color: '#232323' }}>
                  At Preloved, our mission is to make sustainable fashion accessible and affordable for everyone. We believe in giving clothes a second life and reducing waste, while helping you find unique styles at great prices.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                <div className="d-flex align-items-center mb-3">
                  <FaTshirt size={32} color="#ff9800" className="me-2" />
                  <h3 className="fw-semibold mb-0" style={{ color: '#232323' }}>What We Offer</h3>
                </div>
                <ul style={{ color: '#232323', paddingLeft: '1.2rem' }}>
                  <li>Curated collection of high-quality pre-owned clothing</li>
                  <li>Easy and secure online shopping experience</li>
                  <li>Fast delivery and reliable customer support</li>
                  <li>Opportunities to sell your own preloved items</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                <div className="d-flex align-items-center mb-3">
                  <FaSmile size={32} color="#ff9800" className="me-2" />
                  <h3 className="fw-semibold mb-0" style={{ color: '#232323' }}>Why Choose Us?</h3>
                </div>
                <p style={{ color: '#232323' }}>
                  We are passionate about quality, sustainability, and customer satisfaction. Our platform is designed to make your shopping journey enjoyable, eco-friendly, and rewarding.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100">
                <div className="d-flex align-items-center mb-3">
                  <FaUsers size={32} color="#ff9800" className="me-2" />
                  <h3 className="fw-semibold mb-0" style={{ color: '#232323' }}>Join Our Community</h3>
                </div>
                <p style={{ color: '#232323' }}>
                  Become a part of the Preloved family! Whether you're buying, selling, or just exploring, we're here to support your sustainable fashion journey.
                </p>
              </div>
            </div>
          </div>
          {/* Call to Action */}
          <div className="text-center mt-5">
            <a href="/" className="btn btn-lg" style={{ background: '#34495e', marginTop: '20px',color: '#fff', fontWeight: 600, borderRadius: '24px', padding: '12px 36px' }}>
              Start Shopping
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 