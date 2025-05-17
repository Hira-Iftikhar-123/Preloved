import React, { useRef, useState, useEffect } from 'react';
import { useCart, useDispatchCart } from './ContextReducer';

export default function Card({ clothItem, imageSrc }) {

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(Object.keys(clothItem.sizes)[0]);
  const [finalPrice, setFinalPrice] = useState(0);
  let priceOptions = Object.keys(clothItem.sizes);
  let dispatch = useDispatchCart();
  let data = useCart();
  const priceRef = useRef();

  useEffect(() => {
    setFinalPrice(qty * parseInt(clothItem.sizes[size])); 
  }, [qty, size, clothItem.sizes]);

  const handleAddToCart = async () => {
    let cloth = [];

    for (const item of data) {
      if (item.id === clothItem._id) {
        cloth = item;
        break;
      }
    }

    if (cloth.length !== 0) {
      if (cloth.size === size) {
        await dispatch({ type: "UPDATE", id: clothItem._id, price: finalPrice, qty: qty });
        return;
      }
    } else if (cloth.length === 0) {
      await dispatch({ type: "ADD", id: clothItem._id, name: clothItem.brand, qty, size, price: finalPrice, img: imageSrc });
    }
  };

  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="position-relative">
        <img
          src={process.env.PUBLIC_URL + imageSrc}
          alt={clothItem.brand}
          className="card-img-top"
          style={{ height: '300px', objectFit: 'cover' }}
        />
      </div>
      <div className="card-body">
        <h5 className="card-title fw-bold mb-3">{clothItem.brand || 'Maria B Clothing'}</h5>
        <p className="card-text text-muted mb-4">{clothItem.description}</p>

        <div className="d-flex flex-column gap-3">
          <div className="d-flex gap-2">
            <select className="form-select" onChange={(e) => setQty(e.target.value)}>
              {[...Array(6)].map((_, i) => (
                <option key={i} value={i + 1}>Quantity: {i + 1}</option>
              ))}
            </select>
            <select className="form-select" ref={priceRef} onChange={(e) => setSize(e.target.value)} value={size}>
              {priceOptions.map((data) => (
                <option key={data} value={data}>{data}</option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <span className="h4 mb-0 text-primary">
              <strong>{finalPrice ? `PKR ${finalPrice}` : 'PKR 3000'}</strong>
            </span>
            <button className="btn btn-primary justify-content-center ms-2" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
