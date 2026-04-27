import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AgentDashboard from './pages/AgentDashboard';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<AgentDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
