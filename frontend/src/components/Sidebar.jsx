import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, PhoneCall, LogOut, Coffee, Clock } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [session, setSession] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const data = localStorage.getItem('agentSession');
        if (data) {
            setSession(JSON.parse(data));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (!session) return;
        const timer = setInterval(() => {
            const start = new Date(session.loginTime).getTime();
            const now = new Date().getTime();
            setElapsedTime(Math.floor((now - start) / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, [session]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`;
    };

    const handleLogout = () => {
        localStorage.removeItem('agentSession');
        navigate('/login');
    };

    if (!session) return null;

    const isActive = (path) => location.pathname === path;

    return (
        <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', width: '260px', backgroundColor: '#ffffff', borderRight: '1px solid var(--border-color)', height: '100vh', position: 'sticky', top: 0 }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ color: 'var(--primary-color)', margin: '0 0 0.5rem 0', fontSize: '1.8rem', letterSpacing: '-0.5px' }}>VoiceCart</h2>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', backgroundColor: 'rgba(0,0,0,0.03)', padding: '0.3rem 0.8rem', borderRadius: '12px' }}>
                    <span className={`dot ${session.status === 'ONLINE' ? 'dot-green' : session.status === 'ON_BREAK' ? 'dot-yellow' : 'dot-red'}`}></span> 
                    {session.status}
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', paddingLeft: '1rem' }}>Navigation</p>
                
                <button 
                    className={`btn ${isActive('/workspace') ? 'btn-primary' : ''}`} 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1rem', width: '100%', justifyContent: 'flex-start', backgroundColor: isActive('/workspace') ? 'var(--primary-color)' : 'transparent', color: isActive('/workspace') ? '#fff' : 'var(--text-dark)', border: 'none', textAlign: 'left', fontWeight: isActive('/workspace') ? '500' : 'normal' }}
                    onClick={() => navigate('/workspace')}
                >
                    <PhoneCall size={18} /> Call Workspace
                </button>
                
                <button 
                    className={`btn ${isActive('/dashboard') ? 'btn-primary' : ''}`} 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1rem', width: '100%', justifyContent: 'flex-start', backgroundColor: isActive('/dashboard') ? 'var(--primary-color)' : 'transparent', color: isActive('/dashboard') ? '#fff' : 'var(--text-dark)', border: 'none', textAlign: 'left', fontWeight: isActive('/dashboard') ? '500' : 'normal' }}
                    onClick={() => navigate('/dashboard')}
                >
                    <LayoutDashboard size={18} /> Performance Dashboard
                </button>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
                    <Clock size={16} /> <span>Session Time: <strong style={{ color: 'var(--text-dark)' }}>{formatTime(elapsedTime)}</strong></span>
                </div>
            </div>

            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', color: 'var(--danger-color)', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={handleLogout}>
                <LogOut size={16} /> Logout Session
            </button>
        </div>
    );
};

export default Sidebar;
