import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import api from '../../api';

import {
  Box,
  Fab,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  CircularProgress,
  useMediaQuery,
  Paper,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import MoodIcon from '@mui/icons-material/Mood';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';

export default function Ai() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const userId = useSelector((state) => state.user?.user_id || '');

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [chatResult, setChatResult] = useState('');
  const [weightResult, setWeightResult] = useState('');
  const [moodResult, setMoodResult] = useState('');
  const [fitnessResult, setFitnessResult] = useState('');

  const scrollRef = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTabChange = (e, v) => setTab(v);

  // ─────────────────────────────
  // Run AI for different tabs
  // ─────────────────────────────
  const runAI = async () => {
    setLoading(true);
    try {
      if (tab === 0) {
        // Chat
        const res = await api.post('/api/ai/chat/', { message: input });
        setChatResult(res.data.result || 'No response');

        // 清空输入框！！
        setInput('');
      } 
      else if (tab === 1) {
        // Weight
        const res = await api.post('/api/ai/weight/', userId ? { user_id: userId } : {});
        setWeightResult(res.data.result || 'No response');
      } 
      else if (tab === 2) {
        // Mood
        const res = await api.post('/api/ai/mood/', userId ? { user_id: userId } : {});
        setMoodResult(res.data.result || 'No response');
      }
      else if (tab === 3) {
        // Fitness
        const res = await api.post('/api/ai/fitness/', userId ? { user_id: userId } : {});
        setFitnessResult(res.data.result || 'No response');
      }

    } catch (err) {
      console.error(err);
      const msg = 'Error connecting to AI API';
      if (tab === 0) setChatResult(msg);
      if (tab === 1) setWeightResult(msg);
      if (tab === 2) setMoodResult(msg);
      if (tab === 3) setFitnessResult(msg);
    } finally {
      setLoading(false);
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Fab
        color="primary"
        aria-label="open-ai"
        onClick={handleOpen}
        sx={{ position: 'fixed', right: 16, bottom: 16, zIndex: 1400 }}
      >
        <AddIcon />
      </Fab>

      {/* Dialog */}
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { width: 420, borderRadius: 2 } }}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6">AI Assistant</Typography>
            <IconButton edge="end" color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* Tabs */}
          <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
            <Tab icon={<ChatIcon />} label="Chat" />
            <Tab icon={<AnalyticsIcon />} label="Weight" />
            <Tab icon={<MoodIcon />} label="Mood" />
            <Tab icon={<FitnessCenterIcon />} label="Fitness" />
          </Tabs>

          {/* Output Box */}
          <Paper variant="outlined" sx={{ height: 300, overflow: 'auto', p: 2 }} ref={scrollRef}>
            {tab === 0 && (
              <Box>
                <Typography variant="subtitle2">Chat with AI</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {chatResult || 'Type a message and press Send.'}
                </Typography>
              </Box>
            )}

            {tab === 1 && (
              <Box>
                <Typography variant="subtitle2">Weight Analysis</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {weightResult || 'Press Generate.'}
                </Typography>
              </Box>
            )}

            {tab === 2 && (
              <Box>
                <Typography variant="subtitle2">Mood Summary</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {moodResult || 'Press Generate.'}
                </Typography>
              </Box>
            )}

            {tab === 3 && (
              <Box>
                <Typography variant="subtitle2">Fitness Summary</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {fitnessResult || 'Press Generate to analyze fitness activities.'}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Input + Send */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {tab === 0 && (
              <TextField
                fullWidth
                placeholder="Enter message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') runAI();
                }}
              />
            )}

            <Button variant="contained" onClick={runAI} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : (tab === 0 ? 'Send' : 'Generate')}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
