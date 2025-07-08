import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { FaPaperPlane, FaTicketAlt, FaComments, FaExclamationCircle, FaCheckCircle, FaClock, FaWhatsapp, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './SupportDashboard.css';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
axios.defaults.baseURL = API_BASE_URL;

const SupportDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [activeTicket, setActiveTicket] = useState(null);
    const [newTicket, setNewTicket] = useState({
        subject: '',
        description: '',
        category: 'general',
        priority: 'medium'
    });
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);
    const messagesEndRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const newSocket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000');
        setSocket(newSocket);

        fetchTickets();

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/support/tickets', {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });
            setTickets(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tickets:', error);
            setLoading(false);
        }
    };

    const fetchMessages = async (ticketId) => {
        try {
            const response = await axios.get(`/api/support/ticket?id=${ticketId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });
            setMessages(response.data.messages || []);
        } catch (error) {
            setMessages([]);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/support/tickets', newTicket, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });
            setTickets([...tickets, response.data]);
            setNewTicket({
                subject: '',
                description: '',
                category: 'general',
                priority: 'medium'
            });
            setIsCreatingTicket(false);
            setActiveTicket(response.data);
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert('Failed to create ticket. Please try again.');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeTicket) return;

        try {
            const response = await axios.post(`/api/support/ticket?id=${activeTicket._id}`,
                { content: newMessage },
                { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
            );
            setMessages(prev => {
                if (prev.some(msg => msg._id === response.data._id)) return prev;
                return [...prev, response.data];
            });
            socket.emit('send_message', {
                content: newMessage,
                chatRoom: activeTicket._id,
                sender: localStorage.getItem('userId'),
                timestamp: new Date()
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        if (socket && activeTicket) {
            socket.emit('join_room', activeTicket._id);

            const handleReceiveMessage = (data) => {
                setMessages(prev => {
                    if (prev.some(msg => msg._id === data._id)) return prev;
                    return [...prev, data];
                });
            };

            socket.on('receive_message', handleReceiveMessage);

            return () => {
                socket.emit('leave_room', activeTicket._id);
                socket.off('receive_message', handleReceiveMessage);
            };
        }
    }, [socket, activeTicket]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'open':
                return <FaExclamationCircle className="status-icon open" />;
            case 'in-progress':
                return <FaClock className="status-icon in-progress" />;
            case 'resolved':
                return <FaCheckCircle className="status-icon resolved" />;
            default:
                return <FaTicketAlt className="status-icon" />;
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'high':
                return 'priority-high';
            case 'medium':
                return 'priority-medium';
            case 'low':
                return 'priority-low';
            default:
                return '';
        }
    };

    return (
        <div className="support-dashboard-container">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <a
                    href="https://wa.me/03002723129"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-support-btn"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: '#25D366',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: 6,
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: 16
                    }}
                >
                    <FaWhatsapp style={{ marginRight: 8, fontSize: 20 }} />
                    Chat with us on WhatsApp
                </a>
            </div>
            <div className={`support-dashboard${(!loading && tickets.length === 0) ? ' hide-chat' : ''}`}>
                <div className="tickets-section" style={{ position: 'relative' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            position: 'absolute',
                            top: 18,
                            right: 18,
                            background: 'none',
                            border: 'none',
                            color: '#888',
                            fontSize: 24,
                            cursor: 'pointer',
                            zIndex: 2
                        }}
                        title="Back to Home"
                    >
                        <FaTimes />
                    </button>
                    <div className="tickets-header" style={{ marginTop: 30 }}>
                        <h2><FaTicketAlt /> Support Tickets</h2>
                        <button 
                            className="new-ticket-btn"
                            onClick={() => setIsCreatingTicket(!isCreatingTicket)}
                        >
                            {isCreatingTicket ? 'Cancel' : 'New Ticket'}
                        </button>
                    </div>

                    {isCreatingTicket && (
                        <form onSubmit={handleCreateTicket} className="new-ticket-form">
                            <div className="form-group">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    placeholder="What's your issue about?"
                                    value={newTicket.subject}
                                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="Please describe your issue in detail"
                                    value={newTicket.description}
                                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={newTicket.category}
                                        onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                                    >
                                        <option value="general">General</option>
                                        <option value="technical">Technical</option>
                                        <option value="billing">Billing</option>
                                        <option value="product">Product</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Priority</label>
                                    <select
                                        value={newTicket.priority}
                                        onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="submit-ticket-btn">Create Ticket</button>
                        </form>
                    )}

                    <div className="tickets-list rooms-list">
                        {loading ? (
                            <div className="loading-tickets">Loading tickets...</div>
                        ) : tickets.length === 0 ? (
                            <div className="no-tickets">
                                <FaTicketAlt size={32} />
                                <p>No tickets yet</p>
                                <button onClick={() => setIsCreatingTicket(true)}>Create your first ticket</button>
                            </div>
                        ) : (
                            !isCreatingTicket && (
                                <div className="rooms-grid">
                                    {tickets.map(ticket => (
                                        <div
                                            key={ticket._id}
                                            className={`ticket-item room-card ${activeTicket?._id === ticket._id ? 'active' : ''} ${getPriorityClass(ticket.priority)}`}
                                            onClick={() => {
                                                setActiveTicket(ticket);
                                                fetchMessages(ticket._id);
                                            }}
                                        >
                                            <div className="ticket-header">
                                                <h3>{ticket.subject}</h3>
                                                {getStatusIcon(ticket.status)}
                                            </div>
                                            <p className="ticket-category">{ticket.category}</p>
                                            <div className="ticket-meta">
                                                <span className={`priority-badge ${ticket.priority}`}>{ticket.priority}</span>
                                                <span className="ticket-date">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                </div>

                {activeTicket && (
                    <div className="chat-section">
                        <div className="chat-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <button
                                onClick={() => setActiveTicket(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#333',
                                    fontSize: 24,
                                    marginRight: 12,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                title="Close chat"
                            >
                                <FaTimes />
                            </button>
                            <h2 style={{ margin: 0 }}><FaComments /> Chat - {activeTicket.subject}</h2>
                            <div className="ticket-status">
                                <span className={`status-badge ${activeTicket.status}`}>{getStatusIcon(activeTicket.status)}{activeTicket.status}</span>
                            </div>
                        </div>
                        <div className="messages-container">
                            {messages.length === 0 ? (
                                <div className="no-messages">
                                    <FaComments size={48} />
                                    <p>No messages yet</p>
                                    <span>Start the conversation by sending a message</span>
                                </div>
                            ) : (
                                messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`message ${message.sender === localStorage.getItem('userId') ? 'sent' : 'received'}`}
                                    >
                                        <div className="message-content">
                                            <p>{message.content}</p>
                                            <small>{new Date(message.timestamp).toLocaleString()}</small>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="message-form">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                            />
                            <button type="submit" className="send-button">
                                <FaPaperPlane />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportDashboard; 