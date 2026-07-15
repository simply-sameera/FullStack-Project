import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './Components/Auth/LoginSignup';
import Dashboard from './Components/Auth/Dashboard';
import Admin from './Components/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main Root Path maps to Login / Signup portal view */}
          <Route path="/" element={<LoginSignup />} />
          
          {/* Protected Main Application view displaying the Faculty assignment component */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Admin panel visibility */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;