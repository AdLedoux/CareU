import React, { useState } from 'react';

import api from "../../api";
import { useNavigate } from "react-router-dom";

import "./styles.css";
import FavoriteIcon from '@mui/icons-material/Favorite'; // Example icon for branding

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("/api/user/register/", { username, password })
            // On success navigate to login
            navigate("/login")

        } catch (error) {
            // If the backend returns validation errors, axios exposes them on error.response.data
            if (error.response && error.response.data) {
                // Try to show a helpful message. It may be a dict of field errors or a string.
                const data = error.response.data;
                if (typeof data === 'string') {
                    alert(data);
                } else if (typeof data === 'object') {
                    // Join field errors into a single message
                    const messages = [];
                    for (const key in data) {
                        if (Array.isArray(data[key])) {
                            messages.push(`${key}: ${data[key].join(', ')}`);
                        } else {
                            messages.push(`${key}: ${data[key]}`);
                        }
                    }
                    alert(messages.join('\n'))
                } else {
                    alert('Registration failed')
                }
            } else {
                alert(error.message || 'Registration failed')
            }
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="login-container">
            <div style={{ textAlign: "center", marginBottom: 12 }}>
                <FavoriteIcon style={{ fontSize: 48, color: "#1976d2" }} />
                <h1 style={{ margin: "8px 0 0 0" }}>CareU</h1>
                <div style={{ color: "#555", fontSize: 16, marginBottom: 8 }}>
                    Hi! Please register ...
                </div>
            </div>
            <form onSubmit={handleSubmit} className="login-form">
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter your username"
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
            </form>
            <div style={{ textAlign: "center", marginTop: 18, color: "#888" }}>
                You already have an account? <a href="/login" style={{ color: "#1976d2" }}>Sign in</a>
            </div>
        </div>
    );
};

export default Register;