import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, CheckCircle, Coffee, Briefcase, User as UserIcon } from 'lucide-react';

const TopNavbar = () => {
    const navigate = useNavigate();
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [session, setSession] = useState(null);
    const [showBreakMenu, setShowBreakMenu] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const updateSessionFromStorage = () => {
            const data = localStorage.getItem('agentSession');
            if (data) {
                setSession(JSON.parse(data));
            }
        };

        updateSessionFromStorage();
        window.addEventListener('storage', updateSessionFromStorage);

        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
            // Polling local storage for updates occasionally (e.g. if another tab modifies it)
            updateSessionFromStorage();
        }, 1000);

        // Click outside listener for dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowBreakMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            clearInterval(timer);
            window.removeEventListener('storage', updateSessionFromStorage);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('agentSession');
        navigate('/login');
    };

    const handleBreak = (breakType) => {
        if (!session) return;

        const newSession = { ...session };

        if (session.status === 'ON_BREAK') {
            // End current break
            newSession.status = 'ONLINE';
            if (newSession.breakDetails && newSession.breakDetails.length > 0) {
                const currentBreak = newSession.breakDetails[newSession.breakDetails.length - 1];
                if (!currentBreak.endTime) {
                    currentBreak.endTime = new Date().toISOString();
                }
            }
        } else {
            // Start new break
            newSession.status = 'ON_BREAK';
            if (!newSession.breakDetails) newSession.breakDetails = [];
            newSession.breakDetails.push({
                type: breakType,
                startTime: new Date().toISOString(),
                endTime: null
            });
        }

        localStorage.setItem('agentSession', JSON.stringify(newSession));
        setSession(newSession);
        setShowBreakMenu(false);
    };

    if (!session) return null;

    return (
        <nav style={{
            backgroundColor: 'white',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            zIndex: 10
        }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ClockIcon /> {time}
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>

                {/* Break Management Dropdown */}
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                    {session.status === 'ONLINE' ? (
                        <button
                            className="btn btn-outline"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '20px', borderColor: '#f59e0b', color: '#b45309', backgroundColor: 'rgba(245, 158, 11, 0.05)' }}
                            onClick={() => setShowBreakMenu(!showBreakMenu)}
                        >
                            <Coffee size={16} /> Take Break <ChevronDown size={14} />
                        </button>
                    ) : (
                        <button
                            className="btn btn-success"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '20px', animation: 'pulse 2s infinite' }}
                            onClick={() => handleBreak('')}
                        >
                            <CheckCircle size={16} /> Resume Work
                        </button>
                    )}

                    {showBreakMenu && session.status === 'ONLINE' && (
                        <div style={{
                            position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
                            backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            border: '1px solid var(--border-color)', width: '200px', overflow: 'hidden', zIndex: 50
                        }}>
                            <div style={{ padding: '0.75rem 1rem', backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                Select Break Type
                            </div>
                            <button className="dropdown-item" onClick={() => handleBreak('Tea Break')} style={dropdownItemStyle}>
                                <Coffee size={16} style={{ color: '#f59e0b' }} /> Tea Break
                            </button>
                            <button className="dropdown-item" onClick={() => handleBreak('Lunch')} style={dropdownItemStyle}>
                                <Coffee size={16} style={{ color: '#ef4444' }} /> Lunch
                            </button>
                            <button className="dropdown-item" onClick={() => handleBreak('Meeting')} style={dropdownItemStyle}>
                                <Briefcase size={16} style={{ color: '#3b82f6' }} /> Meeting
                            </button>
                            <button className="dropdown-item" onClick={() => handleBreak('Bio Break')} style={dropdownItemStyle}>
                                <UserIcon size={16} style={{ color: '#10b981' }} /> Bio Break
                            </button>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                    <div style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.5rem', borderRadius: '50%', boxShadow: '0 2px 4px rgba(79, 70, 229, 0.3)' }}>
                        <User size={18} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-dark)' }}>{session.agent?.name || 'Agent'}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{session.agent?.phoneNumber}</div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary-color)' }}>
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const dropdownItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    width: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.9rem',
    color: 'var(--text-dark)',
    transition: 'background-color 0.2s'
};

export default TopNavbar;
