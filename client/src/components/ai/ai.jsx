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
  const scrollRef = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTabChange = (e, v) => setTab(v);

  const runAI = async () => {
    setLoading(true);
    try {
      if (tab === 0) {
        const res = await api.post('/api/ai/chat/', { message: input });
        setChatResult(res.data.result || 'No response');
      } else if (tab === 1) {
        const res = await api.post('/api/ai/weight/', userId ? { user_id: userId } : {});
        setWeightResult(res.data.result || 'No response');
      } else if (tab === 2) {
        const res = await api.post('/api/ai/mood/', userId ? { user_id: userId } : {});
        setMoodResult(res.data.result || 'No response');
      }
    } catch (err) {
      console.error(err);
      const msg = 'Error connecting to AI API';
      if (tab === 0) setChatResult(msg);
      if (tab === 1) setWeightResult(msg);
      if (tab === 2) setMoodResult(msg);
    } finally {
      setLoading(false);
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  return (
    <>
      <Fab color="primary" aria-label="open-ai" onClick={handleOpen} sx={{ position: 'fixed', right: 16, bottom: 16, zIndex: 1400 }}>
        <AddIcon />
      </Fab>

      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} PaperProps={{ sx: { width: 420, borderRadius: 2 } }}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6">AI Assistant</Typography>
            <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
            <Tab icon={<ChatIcon />} label="Chat" />
            <Tab icon={<AnalyticsIcon />} label="Weight Analysis" />
            <Tab icon={<MoodIcon />} label="Mood Summary" />
          </Tabs>

          <Paper variant="outlined" sx={{ height: 300, overflow: 'auto', p: 2 }} ref={scrollRef}>
            {tab === 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>Chat with the assistant</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{chatResult || 'Type a message and press Send.'}</Typography>
              </Box>
            )}

            {tab === 1 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>Weight analysis</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{weightResult || 'Press Generate to analyze recent weight records.'}</Typography>
              </Box>
            )}

            {tab === 2 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>Mood summary</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{moodResult || 'Press Generate to summarize recent mood entries.'}</Typography>
              </Box>
            )}
          </Paper>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {tab === 0 && (
              <TextField
                fullWidth
                placeholder="Enter message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') runAI(); }}
              />
            )}

            <Button variant="contained" color="primary" onClick={runAI} disabled={loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : (tab === 0 ? 'Send' : 'Generate')}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
