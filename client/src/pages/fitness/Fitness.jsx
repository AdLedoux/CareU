<<<<<<< HEAD
import {
  Card,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFitness, createFitness } from "../../redux/fitnessSlice";

const ACTIVITIES = ["Walking", "Running", "Cycling", "Yoga", "Strength", "Other"];

export default function Fitness() {
  const userId = useSelector((state) => state.user.user_id);
  const items = useSelector((state) => state.fitness.items || []);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("select");
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    if (!userId) return;
    dispatch(fetchFitness(userId));
  }, [userId, dispatch]);

  const handleAdd = () => {
    setStep("select");
    setActivity("");
    setDuration(30);
    setOpen(true);
  };

  const handleNext = () => setStep("duration");

  const handleFinish = async () => {
    try {
      const payload = {
        Id: userId,
        activity_type: activity,
        duration_minutes: duration,
      };
      await dispatch(createFitness(payload)).unwrap();
      setOpen(false);
    } catch (err) {
      console.error("create fitness failed:", err);
      setOpen(false);
    }
  };

  function formatMinutes(m) {
    const mm = Number(m) || 0;
    const h = Math.floor(mm / 60);
    const mins = mm % 60;
    return `${String(h).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 3 }}>
      <Box sx={{ width: "90vw", maxWidth: 1000, mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Fitness Logs</Typography>
        <Button variant="contained" onClick={handleAdd}>Add Activity</Button>
      </Box>

      <Card sx={{ width: "90vw", maxWidth: 1000, p: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Time</strong></TableCell>
              <TableCell><strong>Activity</strong></TableCell>
              <TableCell><strong>Duration (min)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((it, i) => (
              <TableRow key={i}>
                <TableCell>{new Date(it.created_at || it.createdAt || it.created).toLocaleString()}</TableCell>
                <TableCell>{it.activity_type || it.ActivityType || it.Activity || ""}</TableCell>
                <TableCell>{formatMinutes(it.duration_minutes ?? it.Duration ?? 0)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {items.length === 0 && <Typography sx={{ mt: 2, color: '#999' }}>No records yet</Typography>}
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)}>
        {step === 'select' && (
          <>
            <DialogTitle>Select Activity</DialogTitle>
            <DialogContent>
              <ToggleButtonGroup
                value={activity}
                exclusive
                onChange={(e, v) => v && setActivity(v)}
                sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}
              >
                {ACTIVITIES.map((a) => (
                  <ToggleButton key={a} value={a}>{a}</ToggleButton>
                ))}
              </ToggleButtonGroup>
            </DialogContent>
            <DialogActions>
              <Button disabled={!activity} onClick={handleNext}>Next</Button>
            </DialogActions>
          </>
        )}

        {step === 'duration' && (
          <>
            <DialogTitle>Duration (minutes)</DialogTitle>
            <DialogContent sx={{ width: 400 }}>
              <Slider value={duration} min={1} max={240} onChange={(e, v) => setDuration(v)} valueLabelDisplay="on" />
              <Box sx={{ mt: 1, textAlign: 'center', fontWeight: 600 }}>{formatMinutes(duration)} (hh:mm)</Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setStep('select')}>Back</Button>
              <Button variant="contained" onClick={handleFinish}>Finish</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
=======
import { Card, CardContent, Typography, Grid, TextField, Button, Box } from "@mui/material";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import api from "../../api";

export default function Fitness() {
  const [fitnessChart, setFitnessChart] = useState(null);
  const userId = 1503960366;

  useEffect(() => {
    async function fetchFitnessData() {
      try {
        const res = await api.get(`/api/fitness/${userId}/`);
        const data = Array.isArray(res.data) ? res.data : [];

        const sorted = [...data].sort(
          (a, b) => new Date(a.ActivityHour) - new Date(b.ActivityHour)
        );

        setFitnessChart({
          labels: sorted.map(r =>
            new Date(r.ActivityHour).toLocaleString()
          ),
          datasets: [
            {
              label: "Total Intensity",
              data: sorted.map(r => r.TotalIntensity ?? 0),
              borderColor: "#3f51b5",
              backgroundColor: "rgba(63,81,181,0.25)",
              fill: true,
              tension: 0.3,
            },
            {
              label: "Average Intensity",
              data: sorted.map(r => r.AverageIntensity ?? 0),
              borderColor: "#f50057",
              backgroundColor: "rgba(245,0,87,0.25)",
              fill: true,
              tension: 0.3,
            },
          ],
        });
      } catch (err) {
        console.error("Failed fetching fitness data:", err);
      }
    }

    fetchFitnessData();
  }, [userId]);

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    padding: 3,
    width: "90vw",
    maxWidth: 1000,
    marginBottom: 16,
    height: 400,
  };

  const headerStyle = {
    color: "#3f51b5",
    fontWeight: 700,
    fontSize: "1.6rem",
    textAlign: "center",
    marginBottom: 2,
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
          📅 Fitness Tracking
        </Typography>

        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{
            color: "#1976d2",
            borderColor: "#1976d2",
            "&:hover": {
              backgroundColor: "rgba(25,118,210,0.08)",
              borderColor: "#115293",
            },
          }}
        >
          ← Back to Dashboard
        </Button>
      </Box>

      <Grid container spacing={2}>
        {/* Cards and charts remain unchanged */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={cardStyle}>
            <CardContent>
              <Typography sx={headerStyle}>Latest Record</Typography>
              <Box sx={contentBoxStyle}>
                <Typography>Start: Nov 1 2025</Typography>
                <Typography>Length: 28 days</Typography>
                <Typography>Next: Nov 29 2025</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={cardStyle}>
            <CardContent>
              <Typography sx={headerStyle}>Add Fitness Info</Typography>
              <Box sx={contentBoxStyle}>
                <TextField
                  type="date"
                  label="Start Date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Notes / Symptoms"
                  multiline
                  rows={2}
                  fullWidth
                  margin="dense"
                />
                <Button variant="contained" sx={{ mt: 2 }}>
                  Save
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={cardStyle}>
            <CardContent>
              <Typography sx={headerStyle}>Fitness Length History</Typography>
              <Box sx={{ ...contentBoxStyle, width: "100%" }}>
                <Line data={cycleLengths} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={cardStyle}>
            <CardContent>
              <Typography sx={headerStyle}>Symptom Frequency</Typography>
              <Box sx={{ ...contentBoxStyle, width: "100%" }}>
                <Line data={symptomCounts} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
>>>>>>> 06690bc (remove symptons + cycle features, add moods + fitness features)
  );
}
