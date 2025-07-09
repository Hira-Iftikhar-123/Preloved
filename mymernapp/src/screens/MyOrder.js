import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OrderCard from '../components/OrderCard';

export default function MyOrder() {
    const [orderData, setOrderData] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyOrder = async () => {
        await fetch('/api/data?action=getOrders&userId=' + localStorage.getItem('userId'), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: localStorage.getItem("userEmail"),
            })
        }).then(async (res) => {
            let response = await res.json()
            await setOrderData(response.orderData)
        })
    }

    const fetchRecommendations = async () => {
        try {
            await fetch('/api/data?action=createRecommendation', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: localStorage.getItem("userEmail"),
                })
            });

            const response = await fetch('/api/data?action=getRecommendations&userId=' + localStorage.getItem('userId'), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: localStorage.getItem("userEmail"),
                })
            });
            const data = await response.json();
            setRecommendations(data.recommendations);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    }

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchMyOrder();
            await fetchRecommendations();
            setLoading(false);
        };
        loadData();
    }, []);

    return (
        <>
            <div>
                <Header />
            </div>

            <div className='container' style={{ minHeight: '100vh', padding: '32px 0', marginTop: '100px' }}>
                <div className="d-flex align-items-center mb-4" style={{ marginBottom: '2rem' }}>
                    <h2
                        className="fw-bold"
                        style={{
                            color: '#ffffff',
                            fontSize: '2.5rem',
                            letterSpacing: '1px',
                            marginBottom: 0, position: 'relative', zIndex: 1
                        }}>
                        My Orders
                    </h2>
                </div>

                {loading ? (
                    <div className="text-center text-light">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {orderData !== '' && orderData.order_data && orderData.order_data.length > 0 ? (
                            orderData.order_data.slice(0).reverse().map((orderGroup, i) => (
                                <div key={i} className='mb-5'>
                                    {/* Show order date if present in the first item */}
                                    {orderGroup[0] && orderGroup[0].Order_Date && (
                                        <div className='mb-3'>
                                            <span className='badge bg-dark fs-6 px-3 py-2'>{orderGroup[0].Order_Date}</span>
                                        </div>
                                    )}
                                    <div className='row g-4'>
                                        {orderGroup.filter(item => !item.Order_Date).map((item, j) => (
                                            <div className='col-12 col-sm-6 col-md-4 col-lg-3' key={j}>
                                                <OrderCard item={item} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='text-center text-light fs-4 mt-5'>No orders found.</div>
                        )}

                        {/* Recommendations Section */}
                        {recommendations.length > 0 && (
                            <div className='mt-5'>
                                <div className="d-flex align-items-center mb-4" style={{ marginBottom: '2rem' }}>
                                    <h2
                                        className="fw-bold"
                                        style={{
                                            color: '#ffffff',
                                            fontSize: '2.5rem',
                                            letterSpacing: '1px',
                                            marginBottom: 0, position: 'relative', zIndex: 1
                                        }}>
                                        Recommended for You
                                    </h2>
                                </div>
                                <div className='row g-4'>
                                    {recommendations.map((item) => (
                                        <div className='col-12 col-sm-6 col-md-4 col-lg-3' key={item._id}>
                                            <OrderCard
                                                item={{
                                                    name: item.brand,
                                                    img: item.images && item.images.length > 0
                                                        ? (item.images[0].startsWith('/uploads')
                                                                    ? item.images[0]
        : item.images[0])
                                                        : undefined,
                                                    price: Math.min(...Object.values(item.sizes).map(Number)),
                                                    qty: 1,
                                                    size: Object.keys(item.sizes)[0]
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div>
                <Footer />
            </div>
        </>
    );
}
