import React, { useState } from 'react';
import api from "../../api";
import { useNavigate } from "react-router-dom";
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Box,
    Slider,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
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
    const [open, setOpen] = useState(false); // for dialog
    const navigate = useNavigate();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !password) {
            alert("Username and password are required.");
            setLoading(false);
            return;
        } else if (age < 0 || age > 120) {
            alert("Please enter a valid age between 0 and 120.");
            setLoading(false);
            return;
        } else if (height < 0 || height > 300) {
            alert("Please enter a valid height between 0 and 300 cm.");
            setLoading(false);
            return;
        } else if (weight < 0 || weight > 300) {
            alert("Please enter a valid weight between 0 and 300 kg.");
            setLoading(false);
            return;
        } else if (!gender) {
            alert("Please select a gender.");
            setLoading(false);
            return;
        } else if (!age) {
            alert("Please enter your age.");
            setLoading(false);
            return;
        } else if (!height) {
            alert("Please enter your height.");
            setLoading(false);
            return;
        } else if (!weight) {
            alert("Please enter your weight.");
            setLoading(false);
            return;
        } else {
            setOpen(true);
        }

    };

    const handleDisagree = () => {
        setOpen(false);
    };

    const handleAgree = async () => {
        setLoading(true);
        try {
            await api.post("/api/user/register/", {
                username,
                password,
            });

            await api.post("/api/userInfo/basic/", {
                username,
                age,
                gender,
                height,
                weight,
            });
            navigate("/login");


        } catch (error) {
            if (error.response && error.response.data) {
                const data = error.response.data;
                if (typeof data === 'string') {
                    alert(data);
                } else if (typeof data === 'object') {
                    const messages = [];
                    for (const key in data) {
                        if (Array.isArray(data[key])) {
                            messages.push(`${key}: ${data[key].join(', ')}`);
                        } else {
                            messages.push(`${key}: ${data[key]}`);
                        }
                    }
                    alert(messages.join('\n'));
                } else {
                    alert('Registration failed');
                }
            } else {
                alert(error.message || 'Registration failed');
            }
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
                    Register a new account here
                </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
                {/* Username */}
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

                {/* Password */}
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

                {/* Age */}
                <div>
                    <FormLabel>Age</FormLabel>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        required
                        placeholder="Enter your age"
                        min={0}
                        max={120}
                    />
                    <small style={{ color: "#777" }}>Range: 0 – 120</small>
                </div>

                {/* Gender */}
                <div>
                    <FormLabel>Gender</FormLabel>
                    <RadioGroup
                        row
                        name="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                    </RadioGroup>
                </div>

                {/* Height */}
                <div>
                    <FormLabel>Height (cm)</FormLabel>
                    <Box sx={{ width: 300 }}>
                        <Slider
                            value={height}
                            onChange={(e, newValue) => setHeight(newValue)}
                            aria-label="height"
                            valueLabelDisplay="auto"
                            step={1}
                            min={0}
                            max={300}
                        />
                        <div style={{ textAlign: "center" }}>{height} cm</div>
                    </Box>
                </div>

                {/* Weight */}
                <div>
                    <FormLabel>Weight (kg)</FormLabel>
                    <Box sx={{ width: 300 }}>
                        <Slider
                            value={weight}
                            onChange={(e, newValue) => setWeight(newValue)}
                            aria-label="weight"
                            valueLabelDisplay="auto"
                            step={1}
                            min={0}
                            max={300}
                        />
                        <div style={{ textAlign: "center" }}>{weight} kg</div>
                    </Box>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Create Account'}
                </button>
            </form>

            <div style={{ textAlign: "center", marginTop: 18, color: "#888" }}>
                Already have an account?{' '}
                <a href="/login" style={{ color: "#1976d2" }}>Sign in</a>
            </div>

            {/* Consent Dialog */}
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleDisagree}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"User Consent for Personal Health Data"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        CareU collects and processes your personal information (such as age, height, weight, and gender)
                        solely for the purpose of providing personalized health insights and recommendations.{" "}
                        <br /><br />
                        Your data will be securely stored and never shared with third parties without your consent.
                        You may withdraw your consent and delete your data at any time in your account settings.{" "}
                        <br /><br />
                        Do you agree to share this information for improving your health experience within CareU?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDisagree} color="error">
                        Disagree
                    </Button>
                    <Button onClick={handleAgree} autoFocus color="primary" variant="contained">
                        Agree & Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Register;
