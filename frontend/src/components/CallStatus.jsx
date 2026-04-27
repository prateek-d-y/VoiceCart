import React, { useState, useEffect } from 'react';
import { getActiveCalls, endCall } from '../services/api';

const CallStatus = ({ activeCall, setActiveCall }) => {

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
        const intervalId = setInterval(fetchActiveCalls, 3000); // Poll every 3 seconds

        return () => clearInterval(intervalId);
    }, [setActiveCall]);

    const handleEndCall = async () => {
        if (!activeCall) return;
        try {
            await endCall(activeCall.id);
            setActiveCall(null);
        } catch (error) {
            console.error("Failed to end call:", error);
            alert("Failed to end call.");
        }
    };

    if (!activeCall) {
        return (
            <div className="card">
                <div className="status-indicator status-available">
                    <span className="dot dot-green"></span> Available
                </div>
            </div>
        );
    }

    if (activeCall.status === 'RINGING') {
        return (
            <div className="card">
                <div className="status-indicator status-ringing">
                    <span className="dot dot-yellow"></span> Incoming call from {activeCall.customerPhone}
                </div>
                {/* Normally agent would accept call here, but for simple flow we might assume auto-accept or just info */}
            </div>
        );
    }

    return (
        <div className="card">
            <div className="status-indicator status-incall" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                    <span className="dot dot-red"></span> On call with {activeCall.customerPhone}
                </div>
                <button className="btn btn-danger" onClick={handleEndCall}>End Call</button>
            </div>
        </div>
    );
};

export default CallStatus;
