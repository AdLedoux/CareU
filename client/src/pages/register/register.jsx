import React, { useState } from 'react';
import "./styles.css";
import FavoriteIcon from '@mui/icons-material/Favorite'; // Example icon for branding

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Username: ${username}\nPassword: ${password}`);
        // TODO: Add authentication logic here
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
                <button type="submit">Submit</button>
            </form>
            <div style={{ textAlign: "center", marginTop: 18, color: "#888" }}>
                You already have an account? <a href="/create-account" style={{ color: "#1976d2" }}>Sign in</a>
            </div>
        </div>
    );
};

export default Register;