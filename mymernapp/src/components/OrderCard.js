import React from 'react';
import PropTypes from 'prop-types';

const cardStyle = {
  background: '#fff',
  width: '300px',
  borderRadius: '16px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  marginBottom: '24px',
  minHeight: '300px',
  display: 'flex',
  marginLeft: '20px',
  flexDirection: 'column',
  justifyContent: 'space-between',
  border: '1px solid #f0f0f0',
  transition: 'transform 0.15s, box-shadow 0.15s',
};

const imgStyle = {
  height: '180px',
  objectFit: 'contain',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
  background: '#f8f8f8',
};

const priceStyle = {
  color: '#ff9800',
  fontWeight: 'bold',
  fontSize: '1.2rem',
};

const OrderCard = ({ item }) => (
  <div className="card" style={cardStyle}>
    <img
      src={item.img || 'https://via.placeholder.com/300x180?text=No+Image'}
      className="card-img-top"
      alt={item.name || 'Order Item'}
      style={imgStyle}
      onError={e => { e.target.src = 'https://via.placeholder.com/300x180?text=No+Image'; }}
    />
    <div className="card-body">
      <h5 className="card-title mb-2" style={{ color: '#232323' }}>{item.name || <span className="text-muted">No Name</span>}</h5>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="badge bg-secondary">{item.qty} <small>qty</small></span>
        <span className="badge bg-info text-dark">{item.size}</span>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <span style={priceStyle}>PKR {item.price || '--'}</span>
        {item.Order_Date && <span className="text-muted small">{item.Order_Date}</span>}
      </div>
    </div>
  </div>
);

OrderCard.propTypes = {
  item: PropTypes.object.isRequired,
};

export default OrderCard; 