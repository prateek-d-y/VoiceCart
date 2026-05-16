import React, { useState, useEffect } from 'react';
import { lookupUser, createUser } from '../services/api';
import { Search, Plus, MapPin, Phone, History, Edit2 } from 'lucide-react';

const CustomerLookup = ({ setCustomer, customer }) => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newAddress, setNewAddress] = useState('');
    
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [editedAddress, setEditedAddress] = useState('');

    // Mock history since backend is disconnected for this demo
    const [orderHistory, setOrderHistory] = useState([]);
    const [callHistory, setCallHistory] = useState([]);

    useEffect(() => {
        if (customer) {
            setEditedAddress(customer.address || '');
            // Mock fetching history
            setOrderHistory([
                { id: 1, date: '2023-10-25', amount: 25.50, status: 'DELIVERED' },
                { id: 2, date: '2023-10-20', amount: 15.00, status: 'DELIVERED' }
            ]);
            setCallHistory([
                { id: 1, date: '2023-10-25 14:30', duration: '5m 20s' },
                { id: 2, date: '2023-10-15 11:10', duration: '2m 10s' }
            ]);
        }
    }, [customer]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (phone.length !== 10) {
            alert('Please enter a valid 10-digit mobile number.');
            return;
        }
        
        setLoading(true);
        setNotFound(false);
        try {
            const formattedPhone = '+1' + phone; // Mock format
            const res = await lookupUser(formattedPhone);
            if (res.data) {
                setCustomer(res.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setNotFound(true);
                setCustomer(null);
            } else {
                alert("Error looking up customer.");
            }
        }
        setLoading(false);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                phoneNumber: '+1' + phone,
                name: newName,
                email: newEmail,
                address: newAddress
            };
            const res = await createUser(payload);
            setCustomer(res.data);
            setNotFound(false);
        } catch (error) {
            console.error(error);
            alert("Failed to create customer.");
        }
        setLoading(false);
    };

    const handleUpdateAddress = () => {
        setCustomer({ ...customer, address: editedAddress });
        setIsEditingAddress(false);
        // In real app, make PUT request to backend here
    };

    return (
        <div className="card" style={{ height: '100%', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={20} className="text-primary" /> Customer Lookup
            </h3>
            
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
                <input 
                    type="tel" 
                    pattern="[0-9]{10}"
                    className="form-control" 
                    placeholder="Enter 10-digit number" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                />
                <button type="submit" className="btn btn-primary" disabled={loading || phone.length !== 10}>
                    Search
                </button>
            </form>

            {notFound && (
                <div style={{ padding: '1.5rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px' }}>
                    <p style={{ color: 'var(--warning-color)', marginBottom: '1rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} /> New Customer. Create profile:
                    </p>
                    <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input type="text" className="form-control" placeholder="Full Name" value={newName} onChange={e => setNewName(e.target.value)} required />
                        <input type="email" className="form-control" placeholder="Email Address" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                        <input type="text" className="form-control" placeholder="Delivery Address" value={newAddress} onChange={e => setNewAddress(e.target.value)} />
                        <button type="submit" className="btn btn-success" disabled={loading}>Create Profile</button>
                    </form>
                </div>
            )}

            {customer && !notFound && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> Delivery Address</strong>
                            {!isEditingAddress && (
                                <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }} onClick={() => setIsEditingAddress(true)}>
                                    <Edit2 size={12} /> Edit
                                </button>
                            )}
                        </div>
                        {isEditingAddress ? (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input className="form-control" value={editedAddress} onChange={(e) => setEditedAddress(e.target.value)} />
                                <button className="btn btn-primary" onClick={handleUpdateAddress}>Save</button>
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>{customer.address || 'No address provided'}</p>
                        )}
                    </div>

                    <div>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><History size={16} /> Last 5 Orders</h4>
                        {orderHistory.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {orderHistory.map(order => (
                                    <li key={order.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                        <span>Order #{order.id} ({order.date})</span>
                                        <span style={{ fontWeight: 'bold' }}>${order.amount.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No previous orders.</p>
                        )}
                    </div>

                    <div>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><Phone size={16} /> Recent Calls</h4>
                        {callHistory.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {callHistory.map(call => (
                                    <li key={call.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                        <span>{call.date}</span>
                                        <span style={{ color: 'var(--text-muted)' }}>{call.duration}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent calls.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerLookup;
