import React, { useState } from 'react';
import CallStatus from '../components/CallStatus';
import CustomerLookup from '../components/CustomerLookup';
import MenuModal from '../components/MenuModal';

const AgentDashboard = () => {
    const [activeCall, setActiveCall] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [orderSuccessMsg, setOrderSuccessMsg] = useState('');

    return (
        <div>
            <CallStatus activeCall={activeCall} setActiveCall={setActiveCall} />

            {orderSuccessMsg && (
                <div style={{ padding: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #c3e6cb' }}>
                    <strong>Success!</strong> Order #{orderSuccessMsg} placed successfully.
                    <button className="btn" style={{ float: 'right', padding: '0 5px' }} onClick={() => setOrderSuccessMsg('')}>X</button>
                </div>
            )}

            <div className="grid grid-cols-2" style={{ marginTop: '1rem' }}>
                <div>
                    <CustomerLookup setCustomer={setCustomer} />
                </div>
                
                <div>
                    {customer ? (
                        <div className="card">
                            <h3>Selected Customer</h3>
                            <p><strong>Name:</strong> {customer.name}</p>
                            <p><strong>Phone:</strong> {customer.phoneNumber}</p>
                            <p><strong>Email:</strong> {customer.email}</p>
                            <p><strong>Address:</strong> {customer.address}</p>
                            
                            <button 
                                className="btn btn-primary" 
                                style={{ marginTop: '1rem', width: '100%' }}
                                onClick={() => setIsMenuOpen(true)}
                            >
                                Take Order
                            </button>
                        </div>
                    ) : (
                        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                            <p>Search or create a customer to take an order.</p>
                        </div>
                    )}
                </div>
            </div>

            {isMenuOpen && (
                <MenuModal 
                    onClose={() => setIsMenuOpen(false)} 
                    customer={customer} 
                    activeCall={activeCall} 
                    setOrderSuccess={setOrderSuccessMsg}
                />
            )}
        </div>
    );
};

export default AgentDashboard;
