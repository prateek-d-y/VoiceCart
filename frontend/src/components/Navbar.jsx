import React, { useState, useEffect } from 'react';
import '../App.css';

const Navbar = () => {
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-brand">VoiceCart – Agent Console</div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <span>{time}</span>
                <button className="btn btn-primary" onClick={() => alert("Logged out")}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
