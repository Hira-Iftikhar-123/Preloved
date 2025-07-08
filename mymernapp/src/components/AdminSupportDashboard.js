import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaTicketAlt, FaComments, FaExclamationCircle, FaCheckCircle, FaClock, FaUser, FaPaperPlane, FaTimes } from 'react-icons/fa';
import './SupportDashboard.css';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
axios.defaults.baseURL = API_BASE_URL;

const AdminSupportDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [activeTicket, setActiveTicket] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [activeTicket]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admin/support/tickets', {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            console.log('Admin tickets response:', response.data);
            setTickets(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admin tickets:', error);
            setLoading(false);
        }
    };

    const handleSelectTicket = async (ticket) => {
        setActiveTicket(ticket);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeTicket) return;
        try {
            console.log('Sending admin message for ticket:', activeTicket._id);
            const response = await axios.post(`/api/admin/support/tickets/${activeTicket._id}/messages`, { content: newMessage }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            console.log('Admin message response:', response.data);
            setActiveTicket(response.data);
            setTickets(tickets.map(t => t._id === response.data._id ? response.data : t));
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

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

    return (
        <div className="support-dashboard admin-support-dashboard">
            <div className="tickets-section">
                <div className="tickets-header">
                    <h2><FaTicketAlt /> Support Tickets</h2>
                </div>
                <div className="tickets-list">
                    {loading ? (
                        <div className="loading-tickets">Loading tickets...</div>
                    ) : tickets.length === 0 ? (
                        <div className="no-tickets">
                            <FaTicketAlt size={32} />
                            <p>No tickets yet</p>
                        </div>
                    ) : (
                        tickets.map(ticket => (
                            <div
                                key={ticket._id}
                                className={`ticket-item ${activeTicket?._id === ticket._id ? 'active' : ''} ${ticket.priority}`}
                                onClick={() => handleSelectTicket(ticket)}
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
                                <div className="ticket-user">
                                    <FaUser style={{ marginRight: 4 }} />
                                    {ticket.userId?.name} ({ticket.userId?.email})
                                </div>
                            </div>
                        ))
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
                        {activeTicket.messages && activeTicket.messages.length === 0 ? (
                            <div className="no-messages">No messages yet</div>
                        ) : (
                            activeTicket.messages.map((msg, idx) => {
                                const isUserMessage = msg.sender && activeTicket.userId?._id &&
                                    msg.sender.toString() === activeTicket.userId._id.toString();
                                let dateString = '';
                                if (msg.timestamp) {
                                    const d = new Date(msg.timestamp);
                                    dateString = isNaN(d) ? '' : d.toLocaleString();
                                }
                                return (
                                    <div
                                        key={idx}
                                        className={`message-bubble ${isUserMessage ? 'user-message' : 'admin-message'}`}
                                    >
                                        <div className="message-content">{msg.content}</div>
                                        <div className="message-meta">
                                            <span>{isUserMessage ? activeTicket.userId?.name : 'Admin'}</span>
                                            {dateString && <span>{dateString}</span>}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="message-form" onSubmit={handleSendMessage} style={{ display: 'flex', marginTop: 16 }}>
                        <input
                            type="text"
                            placeholder="Type your reply..."
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            className="message-input"
                            style={{ flex: 1, marginRight: 8 }}
                        />
                        <button type="submit" className="send-btn" style={{ padding: '8px 16px' }}>
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminSupportDashboard; 