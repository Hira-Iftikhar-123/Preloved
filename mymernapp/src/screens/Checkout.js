import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useDispatchCart } from '../components/ContextReducer';
import Header from '../components/Header';
import Footer from '../components/Footer';


export default function Checkout() {
    const navigate = useNavigate();
    const cartData = useCart();
    const dispatch = useDispatchCart();
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        phone: '',
        email: localStorage.getItem('userEmail') || ''
    });
    
    const [isCashOnDelivery, setIsCashOnDelivery] = useState(false);
    const totalPrice = cartData.reduce((total, item) => total + item.price, 0);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!isCashOnDelivery) {
            alert("Please confirm the payment method by checking the box.");
            return;
        }
    
        try {
            const response = await fetch('http://localhost:4000/api/orderData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order_data: cartData,
                    email: formData.email,
                    order_date: new Date().toDateString(),
                    delivery_details: {
                        fullName: formData.fullName,
                        address: formData.address,
                        city: formData.city,
                        phone: formData.phone,
                        payment_method: 'Cash on Delivery'
                    }
                })
            });
    
            if (response.status === 200) {
                dispatch({ type: "DROP" });
                alert('Order placed successfully! You will receive a confirmation shortly.');
                navigate('/myorder');
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        }
    };
    
    return (
        <>
            <Header />
            <div className="container mt-5 pt-5">
                <div className="row">
                    <div className="col-md-8">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h3 className="card-title mb-4">Delivery Information</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="fullName" className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">Delivery Address</label>
                                        <textarea
                                            className="form-control"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows="3"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="city" className="form-label">City</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="phone" className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-3 form-check">
    <input
        type="checkbox"
        className="form-check-input"
        id="codCheckbox"
        checked={isCashOnDelivery}
        onChange={() => setIsCashOnDelivery(!isCashOnDelivery)}
    />
    <label className="form-check-label" htmlFor="codCheckbox">
        I agree to pay by <strong>Cash on Delivery</strong>
    </label>
</div>

                                    <button type="submit" className="btn btn-primary">
                                        Place Order
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h3 className="card-title mb-4">Order Summary</h3>
                                {cartData.map((item, index) => (
                                    <div key={index} className="d-flex justify-content-between mb-2">
                                        <span>{item.name} x {item.qty}</span>
                                        <span>PKR {item.price}</span>
                                    </div>
                                ))}
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <strong>Total Amount:</strong>
                                    <strong>PKR {totalPrice}</strong>
                                </div>
                                <div className="alert alert-warning mt-3">
                                    <small>You will pay the total amount when your order is delivered.</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
} 