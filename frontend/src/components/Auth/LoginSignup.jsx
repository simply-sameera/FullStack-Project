import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', isError: false });
    const navigate = useNavigate();

    const API_URL = 'http://localhost:5000/api/auth';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', isError: false });
        
        const endpoint = isLogin ? '/login' : '/signup';
        
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem('user_token', data.token);
                    setMessage({ text: 'Login successful! Redirecting...', isError: false });
                    setTimeout(() => navigate('/dashboard'), 1500);
                } else {
                    setMessage({ text: data.message || 'Registration successful! Please log in.', isError: false });
                    setIsLogin(true); // Switch to login screen automatically
                    setPassword('');
                }
            } else {
                setMessage({ text: data.message || 'An error occurred.', isError: true });
            }
        } catch (err) {
            setMessage({ text: 'Error connecting to backend server.', isError: true });
        }
    };

    // Inline CSS to match your clean portal styling block
    const styles = {
        container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontFamily: 'Arial, sans-serif' },
        card: { background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '320px', textAlign: 'center' },
        input: { width: '90%', padding: '10px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '4px' },
        button: { width: '97%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
        toggleText: { marginTop: '15px', fontSize: '0.9em', color: '#555', cursor: 'pointer', textDecoration: 'underline' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>{isLogin ? 'User Login' : 'Register Account'}</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
                    <button type="submit" style={styles.button}>{isLogin ? 'Log In' : 'Sign Up'}</button>
                </form>
                {message.text && (
                    <p style={{ marginTop: '15px', fontWeight: 'bold', color: message.isError ? 'red' : 'green' }}>
                        {message.text}
                    </p>
                )}
                <p style={styles.toggleText} onClick={() => { setIsLogin(!isLogin); setMessage({ text: '', isError: false }); }}>
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
                </p>
            </div>
        </div>
    );
};

export default LoginSignup;