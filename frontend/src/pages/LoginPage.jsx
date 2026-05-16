import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import axios from 'axios';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            if (isLogin) {
                // Login Flow
                const res = await axios.post('http://localhost:8080/api/auth/login', {
                    phoneNumber: phone,
                    password: password
                });
                
                const user = res.data.user;
                // Create mock session extending user data
                const sessionData = {
                    id: Math.floor(Math.random() * 1000),
                    agent: user,
                    loginTime: new Date().toISOString(),
                    status: 'ONLINE',
                    totalCallTimeSeconds: 0,
                    totalBreakTimeSeconds: 0,
                    callsTaken: 0,
                    breakDetails: [] // track array of breaks
                };
                
                localStorage.setItem('agentSession', JSON.stringify(sessionData));
                navigate('/workspace');
            } else {
                // Register Flow
                const res = await axios.post('http://localhost:8080/api/auth/register', {
                    phoneNumber: phone,
                    password: password,
                    name: name
                });
                
                setSuccessMsg('Registration successful! You can now log in.');
                setIsLogin(true);
                setPassword('');
            }
        } catch (err) {
            setError(err.response?.data?.error || (isLogin ? 'Login failed. Ensure backend is running and credentials are correct.' : 'Registration failed. Phone number might already be in use.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="card login-box" style={{ maxWidth: '400px', margin: '0 auto', marginTop: '10vh' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <div style={{ backgroundColor: 'var(--primary-color)', padding: '15px', borderRadius: '50%', color: 'white', display: 'inline-flex' }}>
                        {isLogin ? <LogIn size={32} /> : <UserPlus size={32} />}
                    </div>
                </div>
                <h1 style={{ textAlign: 'center' }}>VoiceCart</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>Agent Portal</p>
                
                <div style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    <button 
                        className={`btn ${isLogin ? 'btn-primary' : 'btn-outline'}`} 
                        style={{ flex: 1, borderRadius: '4px 0 0 4px', borderBottom: isLogin ? 'none' : '1px solid transparent' }}
                        onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }}
                        type="button"
                    >
                        Login
                    </button>
                    <button 
                        className={`btn ${!isLogin ? 'btn-primary' : 'btn-outline'}`} 
                        style={{ flex: 1, borderRadius: '0 4px 4px 0', borderBottom: !isLogin ? 'none' : '1px solid transparent' }}
                        onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }}
                        type="button"
                    >
                        Register
                    </button>
                </div>

                {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', padding: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', textAlign: 'center' }}>{error}</div>}
                {successMsg && <div style={{ color: 'var(--success-color)', marginBottom: '1rem', padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', textAlign: 'center' }}>{successMsg}</div>}
                
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="John Doe" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={!isLogin}
                            />
                        </div>
                    )}
                    <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Mobile Number / Username</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="+1234567890" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }} disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login to Dashboard' : 'Register Account')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
