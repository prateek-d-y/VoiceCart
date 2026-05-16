import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Clock, PhoneCall, Coffee, ArrowLeft } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DashboardPage = () => {
    const navigate = useNavigate();
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
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (!session) return null;

    // Calculate times
    // Ensure we handle session.breakDetails array properly
    const breakDetails = session.breakDetails || [];
    let calculatedBreakTime = 0;
    
    breakDetails.forEach(b => {
        const end = b.endTime ? new Date(b.endTime).getTime() : new Date().getTime();
        const start = new Date(b.startTime).getTime();
        calculatedBreakTime += Math.floor((end - start) / 1000);
    });

    const totalBreakTime = session.totalBreakTimeSeconds > 0 ? session.totalBreakTimeSeconds : calculatedBreakTime;
    const freeTime = Math.max(0, elapsedTime - session.totalCallTimeSeconds - totalBreakTime);
    
    const chartData = {
        labels: ['Free Time', 'Call Time', 'Break Time'],
        datasets: [
            {
                data: [freeTime, session.totalCallTimeSeconds, totalBreakTime],
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
                borderWidth: 0,
                hoverOffset: 4
            },
        ],
    };

    const chartOptions = {
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, padding: 20, font: { family: "'Inter', sans-serif", size: 13 } } }
        }
    };

    return (
        <div className="app-layout" style={{ backgroundColor: '#f8fafc' }}>
            <Sidebar />
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <TopNavbar />
                
                <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h1 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '1.8rem' }}>Agent Performance Dashboard</h1>
                            <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>Overview of your current session metrics and activity logs.</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => navigate('/workspace')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ArrowLeft size={16} /> Back to Workspace
                        </button>
                    </div>

                    <div className="grid grid-cols-3" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem' }}>
                            <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '1rem', borderRadius: '12px', marginRight: '1rem' }}>
                                <Clock size={28} />
                            </div>
                            <div>
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase' }}>Total Logged In Time</p>
                                <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-dark)' }}>{formatTime(elapsedTime)}</h2>
                            </div>
                        </div>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem' }}>
                            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '12px', marginRight: '1rem' }}>
                                <PhoneCall size={28} />
                            </div>
                            <div>
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase' }}>Calls Handled</p>
                                <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-dark)' }}>{session.callsTaken}</h2>
                            </div>
                        </div>
                        <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem' }}>
                            <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '1rem', borderRadius: '12px', marginRight: '1rem' }}>
                                <Coffee size={28} />
                            </div>
                            <div>
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500', textTransform: 'uppercase' }}>Total Break Time</p>
                                <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-dark)' }}>{formatTime(totalBreakTime)}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Time Distribution</h3>
                            <div style={{ height: '300px', width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {elapsedTime > 0 ? (
                                    <Doughnut data={chartData} options={chartOptions} />
                                ) : (
                                    <p style={{ color: 'var(--text-muted)' }}>Calculating time metrics...</p>
                                )}
                            </div>
                        </div>

                        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '400px' }}>
                            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Break Details</h3>
                            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
                                {breakDetails.length === 0 ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
                                        <p>No breaks taken yet in this session.</p>
                                    </div>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)', textAlign: 'left', color: 'var(--text-muted)' }}>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)' }}>Type</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)' }}>Started</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)' }}>Ended</th>
                                                <th style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)' }}>Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {breakDetails.map((b, idx) => {
                                                const start = new Date(b.startTime);
                                                const end = b.endTime ? new Date(b.endTime) : null;
                                                const durSecs = end ? Math.floor((end.getTime() - start.getTime()) / 1000) : Math.floor((new Date().getTime() - start.getTime()) / 1000);
                                                
                                                return (
                                                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                        <td style={{ padding: '0.75rem 1rem', fontWeight: '500' }}>
                                                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: b.endTime ? '#f59e0b' : '#ef4444', marginRight: '6px' }}></span>
                                                            {b.type}
                                                        </td>
                                                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                        <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{end ? end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ongoing'}</td>
                                                        <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>{formatTime(durSecs)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
