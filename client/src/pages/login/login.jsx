import React, { useState } from 'react';
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/userSlice";
import FormLabel from '@mui/material/FormLabel';
import FavoriteIcon from '@mui/icons-material/Favorite';
import "./styles.css";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("/api/token/", { username, password });
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

            const userRes = await api.get("/api/userInfo/profile/", {
                params: { username },
            });

            dispatch(setUserInfo(userRes.data));
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Please check your username or password.");
        } finally {
            setLoading(false);
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
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div style={{ textAlign: "center", marginTop: 18, color: "#888" }}>
                Don&apos;t have an account?{" "}
                <a href="/register" style={{ color: "#1976d2" }}>Join now</a>
            </div>
        </div>
    );
};

export default Login;
