import { Card, Typography, Grid, TextField, Button, Box, Snackbar, Alert } from "@mui/material";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function Body() {
  const navigate = useNavigate();
  const userId = 8877689391;

  const [dailyData, setDailyData] = useState([]);

  const [newWeight, setNewWeight] = useState("");
  const [newFat, setNewFat] = useState("");
  const [newBMI, setNewBMI] = useState("");

  const [weightChart, setWeightChart] = useState(null);
  const [fatChart, setFatChart] = useState(null);
  const [bmiChart, setBMIChart] = useState(null);

  useEffect(() => {
    // fetchDaily moved outside so it can be re-used after POST
    fetchDaily();
  }, [userId]);

  // define fetchDaily so we can call it after posting new records
  async function fetchDaily() {
    try {
      const res = await api.get(`/api/weightlog/weight/${userId}/daily/`);
      const data = Array.isArray(res.data) ? res.data : [];

      setDailyData(data);

      setWeightChart({
        labels: data.map((d) => d.date),
        datasets: [
          {
            label: "Weight (kg)",
            data: data.map((d) => d.WeightKg),
            borderColor: "#1976d2",
            backgroundColor: "rgba(25,118,210,0.25)",
            fill: true,
            tension: 0.3,
          },
        ],
      });

      setFatChart({
        labels: data.map((d) => d.date),
        datasets: [
          {
            label: "Body Fat (%)",
            data: data.map((d) => d.Fat),
            borderColor: "#4caf50",
            backgroundColor: "rgba(76,175,80,0.25)",
            fill: true,
            tension: 0.3,
          },
        ],
      });

      setBMIChart({
        labels: data.map((d) => d.date),
        datasets: [
          {
            label: "BMI",
            data: data.map((d) => d.BMI),
            borderColor: "#ff9800",
            backgroundColor: "rgba(255,152,0,0.25)",
            fill: true,
            tension: 0.3,
          },
        ],
      });
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  }

  async function handleSubmit() {
    if (!newWeight) return;

    try {
      const res = await api.post("/api/weightlog/weight/add/", {
        Id: userId,
        // use fixed dev date to avoid large span
        Date: "2016-04-13 00:00:00",
        WeightKg: parseFloat(newWeight),
        WeightPounds: parseFloat(newWeight * 2.20462),
        Fat: newFat ? parseFloat(newFat) : null,
        BMI: newBMI ? parseFloat(newBMI) : null,
      });

      // refresh data from backend (JSON file)
      await fetchDaily();

      // show success snackbar
      setSnackbar({ open: true, message: "Saved weight log successfully.", severity: "success" });
    } catch (err) {
      console.error("Failed to save:", err);
      setSnackbar({ open: true, message: "Failed to save weight log.", severity: "error" });
    }
  }

  // snackbar state for success/error dialog
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  function handleCloseSnackbar() {
    setSnackbar((s) => ({ ...s, open: false }));
  }

  const cardStyle = {
    height: 420,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 2,
  };

  const headerStyle = {
    color: "#1976d2",
    fontWeight: 700,
    fontSize: "1.3rem",
    textAlign: "center",
    marginBottom: 1,
  };

  const contentBoxStyle = {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  };

  return (
    <div style={{ padding: 24 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">⚖ Body Measurements</Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{
            color: "#1976d2",
            borderColor: "#1976d2",
            "&:hover": { backgroundColor: "rgba(25,118,210,0.08)", borderColor: "#115293" },
          }}
        >
          ← Back to Dashboard
        </Button>
      </Box>

      <Grid container spacing={2} direction="column">
        <Grid item xs={12}>
          <Card elevation={3} sx={cardStyle}>
            <Typography sx={headerStyle}>Log New Measurement</Typography>

            <Box sx={{ width: "100%" }}>
              <TextField
                label="Weight (kg)"
                fullWidth
                margin="dense"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
              />
              <TextField
                label="Body Fat (%)"
                fullWidth
                margin="dense"
                value={newFat}
                onChange={(e) => setNewFat(e.target.value)}
              />
              <TextField
                label="BMI"
                fullWidth
                margin="dense"
                value={newBMI}
                onChange={(e) => setNewBMI(e.target.value)}
              />

              <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
                Save
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={3} sx={cardStyle}>
            <Typography sx={headerStyle}>Latest Stats</Typography>

            <Box sx={contentBoxStyle}>
              {dailyData.length > 0 ? (
                <>
                  <Typography>Weight: {dailyData[dailyData.length - 1].WeightKg} kg</Typography>
                  <Typography>Fat: {dailyData[dailyData.length - 1].Fat ?? "N/A"}%</Typography>
                  <Typography>BMI: {dailyData[dailyData.length - 1].BMI ?? "N/A"}</Typography>
                </>
              ) : (
                <Typography>No Data Yet</Typography>
              )}
            </Box>
          </Card>
        </Grid>

        {weightChart && (
          <Grid item xs={12}>
            <Card elevation={3} sx={{ ...cardStyle, height: 500 }}>
              <Typography sx={headerStyle}>Daily Weight</Typography>
              <Box sx={{ flexGrow: 1 }}>
                <Line data={weightChart} options={{ maintainAspectRatio: false }} />
              </Box>
            </Card>
          </Grid>
        )}

        {fatChart && (
          <Grid item xs={12}>
            <Card elevation={3} sx={{ ...cardStyle, height: 500 }}>
              <Typography sx={headerStyle}>Daily Body Fat</Typography>
              <Box sx={{ flexGrow: 1 }}>
                <Line data={fatChart} options={{ maintainAspectRatio: false }} />
              </Box>
            </Card>
          </Grid>
        )}

        {bmiChart && (
          <Grid item xs={12}>
            <Card elevation={3} sx={{ ...cardStyle, height: 500 }}>
              <Typography sx={headerStyle}>Daily BMI</Typography>
              <Box sx={{ flexGrow: 1 }}>
                <Line data={bmiChart} options={{ maintainAspectRatio: false }} />
              </Box>
            </Card>
          </Grid>
        )}
      </Grid>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

      </div>
  );
}

// Snackbar component placed at module root would break hooks rules, so ensure it's used inside component; already implemented.
