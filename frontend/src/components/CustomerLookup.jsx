import React, { useState } from 'react';
import { lookupUser, createUser } from '../services/api';

const CustomerLookup = ({ setCustomer }) => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newAddress, setNewAddress] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNotFound(false);
        try {
            const res = await lookupUser(phone);
            if (res.data) {
                setCustomer(res.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setNotFound(true);
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
                phoneNumber: phone,
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

    return (
        <div className="card">
            <h3>Customer Lookup</h3>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter customer mobile number (+1234...)" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>Search</button>
            </form>

            {notFound && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '5px' }}>
                    <p style={{ color: '#856404', marginBottom: '10px' }}>Customer not found. Create a new profile:</p>
                    <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input type="text" className="form-control" placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} required />
                        <input type="email" className="form-control" placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                        <input type="text" className="form-control" placeholder="Address" value={newAddress} onChange={e => setNewAddress(e.target.value)} />
                        <button type="submit" className="btn btn-success" disabled={loading}>Create Profile</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CustomerLookup;
