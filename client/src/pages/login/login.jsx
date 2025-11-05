import React, { useState } from 'react';

import api from "../../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import FormLabel from '@mui/material/FormLabel';


import "./styles.css";
import FavoriteIcon from '@mui/icons-material/Favorite'; // Example icon for branding

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post("/api/token/", { username, password })
        
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            navigate("/")
            
        } catch (error) {
            alert(error)
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
                    Welcome back! Please login to your account.
                </div>
            </div>
            <form onSubmit={handleSubmit} className="login-form">
                <div>
                    <FormLabel>Username</FormLabel>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter your username"
                    />
                </div>
                <div>
                    <FormLabel>Password</FormLabel>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit" disabled={loading}>{loading ? 'Logining...' : 'Login'}</button>

            </form>
            <div style={{ textAlign: "center", marginTop: 18, color: "#888" }}>
                Don&apos;t have an account? <a href="/register" style={{ color: "#1976d2" }}>Join now</a>
            </div>
        </div>
    );
};

export default Login;