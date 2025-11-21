import React, { useState } from 'react';
import api from "../../api";
import { useNavigate } from "react-router-dom";
import {
    Radio, RadioGroup, FormControlLabel, FormLabel,
    Box, Slider, Button, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import "./styles.css";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(60);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !password || !age || !gender || !height || !weight) {
            alert("Please fill in all required fields.");
            return;
        }
        setOpen(true);
    };

    const handleDisagree = () => setOpen(false);

    const handleAgree = async () => {
        setLoading(true);
        try {
            await api.post("/api/user/register/", { username, password });
            await api.post("/api/userInfo/profile/", { username, age, gender, height, weight });

            navigate("/login");
        } catch (error) {
            if (error.response && error.response.data) {
                const data = error.response.data;
                if (typeof data === 'string') alert(data);
                else if (typeof data === 'object') {
                    const messages = [];
                    for (const key in data) {
                        if (Array.isArray(data[key])) messages.push(`${key}: ${data[key].join(', ')}`);
                        else messages.push(`${key}: ${data[key]}`);
                    }
                    alert(messages.join('\n'));
                } else alert('Registration failed');
            } else alert(error.message || 'Registration failed');
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <div className="login-container">
            <div style={{ textAlign: "center", marginBottom: 12 }}>
                <FavoriteIcon style={{ fontSize: 48, color: "#1976d2" }} />
                <h1 style={{ margin: "8px 0 0 0" }}>CareU</h1>
                <div style={{ color: "#555", fontSize: 16, marginBottom: 8 }}>
                    Register a new account here
                </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
                <div>
                    <FormLabel>Username</FormLabel>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Enter your username" />
                </div>
                <div>
                    <FormLabel>Password</FormLabel>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" />
                </div>
                <div>
                    <FormLabel>Age</FormLabel>
                    <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} min={0} max={120} required />
                </div>
                <div>
                    <FormLabel>Gender</FormLabel>
                    <RadioGroup row value={gender} onChange={e => setGender(e.target.value)}>
                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                    </RadioGroup>
                </div>
                <div>
                    <FormLabel>Height (cm)</FormLabel>
                    <Box sx={{ width: 300 }}>
                        <Slider value={height} onChange={(e, newValue) => setHeight(newValue)} step={1} min={0} max={300} valueLabelDisplay="auto" />
                        <div style={{ textAlign: "center" }}>{height} cm</div>
                    </Box>
                </div>
                <div>
                    <FormLabel>Weight (kg)</FormLabel>
                    <Box sx={{ width: 300 }}>
                        <Slider value={weight} onChange={(e, newValue) => setWeight(newValue)} step={1} min={0} max={300} valueLabelDisplay="auto" />
                        <div style={{ textAlign: "center" }}>{weight} kg</div>
                    </Box>
                </div>
                <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Create Account'}</button>
            </form>

            <div style={{ textAlign: "center", marginTop: 18, color: "#888" }}>
                Already have an account? <a href="/login" style={{ color: "#1976d2" }}>Sign in</a>
            </div>

            <Dialog fullScreen={fullScreen} open={open} onClose={handleDisagree}>
                <DialogTitle>User Consent for Personal Health Data</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        CareU collects and processes your personal information solely for personalized health insights. Data is stored securely and never shared without consent.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDisagree} color="error">Disagree</Button>
                    <Button onClick={handleAgree} color="primary" variant="contained">Agree & Continue</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Register;
