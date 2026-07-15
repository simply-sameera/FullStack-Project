import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FacialExpression from '../FacialExpression'; // Imports your faculty's facial module

const Dashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('user_token');

    useEffect(() => {
        if (!token) {
            alert('Access Denied! Please login first.');
            navigate('/');
        }
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user_token');
        navigate('/');
    };

    if (!token) return null;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ccc', paddingBottom: '10px', marginBottom: '20px' }}>
                <h2>🤖 AI Smart Space Portal</h2>
                <button onClick={handleLogout} style={{ padding: '8px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Secure Sign Out
                </button>
            </div>
            
            {/* Renders your faculty's actual assignment application natively inside the authorized dashboard */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <FacialExpression />
            </div>
        </div>
    );
};

export default Dashboard;