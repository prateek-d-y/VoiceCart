import React, { useState, useEffect } from 'react';
import { getActiveCalls, endCall } from '../services/api';
import { PhoneIncoming, PhoneOff, Phone, List } from 'lucide-react';

const CallStatus = ({ activeCall, setActiveCall }) => {
    // For demo purposes, we will simulate an incoming call if none exists
    const [mockCallState, setMockCallState] = useState('IDLE'); // IDLE, RINGING, IN_PROGRESS, IVR

    useEffect(() => {
        const fetchActiveCalls = async () => {
            try {
                const response = await getActiveCalls();
                if (response.data && response.data.length > 0) {
                    setActiveCall(response.data[0]);
                } else {
                    setActiveCall(null);
                }
            } catch (error) {
                console.error("Error fetching active calls:", error);
            }
        };

        fetchActiveCalls();
        const intervalId = setInterval(fetchActiveCalls, 3000);

        return () => clearInterval(intervalId);
    }, [setActiveCall]);

    // Mock functions to simulate UI
    const handleSimulateCall = () => {
        setMockCallState('RINGING');
        setActiveCall({ id: 999, customerPhone: '+19876543210', status: 'RINGING', startedAt: new Date().toISOString() });
    };

    const handleReceiveCall = () => {
        setMockCallState('IN_PROGRESS');
        setActiveCall({ ...activeCall, status: 'IN_PROGRESS' });
    };

    const handleEndCall = async () => {
        setMockCallState('IDLE');
        if (activeCall && activeCall.id !== 999) {
            try {
                await endCall(activeCall.id);
            } catch (error) {
                console.error("Failed to end call:", error);
            }
        }
        setActiveCall(null);
    };

    const handleIVR = () => {
        setMockCallState('IVR');
        alert("IVR Menu Triggered:\n1. Place Order\n2. Order Status\n3. Speak to Agent");
    };

    if (!activeCall) {
        return (
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'var(--text-muted)' }}>No active calls. Waiting for incoming calls...</div>
                <button className="btn btn-outline" onClick={handleSimulateCall}>
                    <PhoneIncoming size={16} /> Simulate Call
                </button>
            </div>
        );
    }

    if (activeCall.status === 'RINGING' || mockCallState === 'RINGING') {
        return (
            <div className="card" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="status-indicator status-ringing" style={{ animation: 'pulse 2s infinite' }}>
                        <span className="dot dot-yellow"></span> 
                        <strong style={{ marginLeft: '0.5rem' }}>Incoming Call</strong>: {activeCall.customerPhone}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-success" onClick={handleReceiveCall}>
                            <Phone size={16} /> Receive Call
                        </button>
                        <button className="btn btn-danger" onClick={handleEndCall}>
                            <PhoneOff size={16} /> Decline
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card" style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="status-indicator status-incall">
                    <span className="dot dot-red"></span> 
                    <strong style={{ marginLeft: '0.5rem' }}>In Call</strong>: {activeCall.customerPhone}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" onClick={handleIVR}>
                        <List size={16} /> Show IVR Menu
                    </button>
                    <button className="btn btn-danger" onClick={handleEndCall}>
                        <PhoneOff size={16} /> End Call
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallStatus;
