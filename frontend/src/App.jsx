import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AgentDashboard from './pages/AgentDashboard';
import DashboardPage from './pages/DashboardPage';
import OrderPage from './pages/OrderPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/workspace" element={<AgentDashboard />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/orders/:phone" element={<OrderPage />} />
      </Routes>
    </Router>
  );
}

export default App;
