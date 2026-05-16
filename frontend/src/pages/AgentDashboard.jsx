import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import CallStatus from '../components/CallStatus';
import CustomerLookup from '../components/CustomerLookup';

const AgentDashboard = () => {
    const [activeCall, setActiveCall] = useState(null);
    const [customer, setCustomer] = useState(null);
    const navigate = useNavigate();

    return (
        <div className="app-layout" style={{ backgroundColor: '#f8fafc' }}>
            <Sidebar />
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <TopNavbar />
                
                <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
                    <h1 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-dark)', fontSize: '1.8rem' }}>Agent Call Workspace</h1>
                    
                    <CallStatus activeCall={activeCall} setActiveCall={setActiveCall} />

                    <div className="grid grid-cols-2" style={{ marginTop: '1.5rem', gap: '1.5rem' }}>
                        <div>
                            <CustomerLookup setCustomer={setCustomer} customer={customer} />
                        </div>
                        
                        <div>
                            {customer ? (
                                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                                    <div style={{ backgroundColor: '#f0f9ff', margin: '-1.5rem -1.5rem 1.5rem -1.5rem', padding: '1.5rem', borderBottom: '1px solid #bae6fd', borderRadius: '12px 12px 0 0' }}>
                                        <h3 style={{ margin: 0, color: '#0369a1' }}>Customer Profile</h3>
                                    </div>
                                    
                                    <div style={{ marginBottom: '1.5rem', flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                            <div style={{ backgroundColor: 'var(--primary-color)', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                                {customer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 0.2rem 0', color: 'var(--text-dark)' }}>{customer.name}</p>
                                                <p style={{ color: 'var(--text-muted)', margin: 0 }}>{customer.phoneNumber}</p>
                                            </div>
                                        </div>
                                        
                                        {customer.address && (
                                            <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
                                                <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Delivery Address</strong>
                                                <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-dark)' }}>{customer.address}</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <button 
                                        className="btn btn-primary" 
                                        style={{ marginTop: 'auto', width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)' }}
                                        onClick={() => navigate(`/orders/${customer.phoneNumber}`, { state: { customer } })}
                                    >
                                        Proceed to Order Placement &rarr;
                                    </button>
                                </div>
                            ) : (
                                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', backgroundColor: 'rgba(0,0,0,0.02)', border: '2px dashed var(--border-color)', minHeight: '300px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', color: '#cbd5e1' }}>
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                    <p style={{ fontSize: '1.1rem', margin: 0 }}>No customer selected</p>
                                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Search or create a customer to proceed.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;
