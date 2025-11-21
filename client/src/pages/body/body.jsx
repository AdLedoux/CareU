import { Card, Typography, Grid, TextField, Button, Box, Snackbar, Alert } from "@mui/material";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useSelector } from "react-redux";

export default function Body() {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.user_id);

  const [dailyData, setDailyData] = useState([]);

  const [newWeight, setNewWeight] = useState("");
  const [newFat, setNewFat] = useState("");
  const [newBMI, setNewBMI] = useState("");

  const [weightChart, setWeightChart] = useState(null);
  const [fatChart, setFatChart] = useState(null);
  const [bmiChart, setBMIChart] = useState(null);
  const [intradayChart, setIntradayChart] = useState(null);

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 8,
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: false,
        position: "left",
        grid: { display: true },
      },
      y1: {
        beginAtZero: false,
        position: "right",
        grid: { drawOnChartArea: false },
      },
    },
    plugins: {
      legend: { display: true, position: "top" },
    },
  };

  useEffect(() => {
    fetchDaily();
  }, [userId]);

  async function fetchDaily() {
    try {
      const res = await api.get(`/api/weightlog/weight/${userId}/daily/`);
      const data = Array.isArray(res.data) ? res.data : [];

      setDailyData(data);

      const labels = data.map((d) => (typeof d.date === "string" && d.date.length >= 5 ? d.date.slice(5) : d.date));

      setWeightChart({
        labels,
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
        labels,
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
        labels,
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

      fetchListAndBuildIntraday();
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  }

  async function fetchListAndBuildIntraday() {
    try {
      const res = await api.get(`/api/weightlog/weight/${userId}/`);
      const list = Array.isArray(res.data) ? res.data : [];
      if (!list.length) {
        setIntradayChart(null);
        return;
      }

      let targetDay = null;
      if (dailyData && dailyData.length) {
        const last = dailyData[dailyData.length - 1];
        targetDay = typeof last.date === 'string' ? last.date : null;
      }
      if (!targetDay) {
        let maxDt = null;
        for (const r of list) {
          const ds = r.Date || r.date || r.DateTime || r.Time;
          if (!ds) continue;
          const dts = new Date(String(ds).replace(' ', 'T'));
          if (isNaN(dts)) continue;
          if (!maxDt || dts > maxDt) maxDt = dts;
        }
        if (maxDt) targetDay = maxDt.toISOString().slice(0, 10);
      }
      if (!targetDay) {
        setIntradayChart(null);
        return;
      }

      const labels = [];
      for (let h = 0; h < 24; h++) {
        const hh = String(h).padStart(2, "0");
        labels.push(`${hh}:00`);
        labels.push(`${hh}:30`);
      }

      const binsW = new Array(48).fill(null);
      const binsF = new Array(48).fill(null);
      const binsB = new Array(48).fill(null);

      for (const r of list) {
        const ds = r.Date || r.date || r.DateTime || r.Time;
        if (!ds) continue;
        const s = String(ds);
        if (!s.startsWith(targetDay)) continue;
        const dObj = new Date(s.replace(" ", "T"));
        if (isNaN(dObj)) continue;
        const hour = dObj.getHours();
        const minute = dObj.getMinutes();
        const idx = hour * 2 + (minute >= 30 ? 1 : 0);
        if (r.WeightKg != null) binsW[idx] = r.WeightKg;
        if (r.Fat != null) binsF[idx] = r.Fat;
        if (r.BMI != null) binsB[idx] = r.BMI;
      }

      const filledW = [...binsW];
      const filledF = [...binsF];
      const filledB = [...binsB];
      for (let i = 0; i < 48; i++) {
        if (filledW[i] == null && i > 0) filledW[i] = filledW[i - 1];
        if (filledF[i] == null && i > 0) filledF[i] = filledF[i - 1];
        if (filledB[i] == null && i > 0) filledB[i] = filledB[i - 1];
      }

      setIntradayChart({
        labels,
        datasets: [
          {
            label: `Weight (kg) — ${targetDay}`,
            data: filledW,
            borderColor: "#1976d2",
            backgroundColor: "rgba(25,118,210,0.25)",
            fill: true,
            tension: 0.3,
            yAxisID: "y",
          },
          {
            label: `Body Fat (%) — ${targetDay}`,
            data: filledF,
            borderColor: "#4caf50",
            backgroundColor: "rgba(76,175,80,0.15)",
            fill: false,
            tension: 0.3,
            yAxisID: "y1",
          },
          {
            label: `BMI — ${targetDay}`,
            data: filledB,
            borderColor: "#ff9800",
            backgroundColor: "rgba(255,152,0,0.15)",
            fill: false,
            tension: 0.3,
            yAxisID: "y1",
          },
        ],
      });

    } catch (err) {
      console.error('Failed to fetch full list for intraday chart:', err);
      setIntradayChart(null);
    }
  }

  async function handleSubmit() {
    if (!newWeight) return;

    try {
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");

      await api.post("/api/weightlog/weight/add/", {
        Id: userId,
        Date: formattedDate,
        WeightKg: parseFloat(newWeight),
        WeightPounds: parseFloat(newWeight * 2.20462),
        Fat: newFat ? parseFloat(newFat) : null,
        BMI: newBMI ? parseFloat(newBMI) : null,
      });

      await fetchDaily();

      setSnackbar({ open: true, message: "Saved weight log successfully.", severity: "success" });
    } catch (err) {
      console.error("Failed to save:", err);
      setSnackbar({ open: true, message: "Failed to save weight log.", severity: "error" });
    }
  }


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

        {intradayChart && (
          <Grid item xs={12}>
            <Card elevation={3} sx={{ ...cardStyle, height: 500 }}>
              <Typography sx={headerStyle}>Hourly Status</Typography>
              <Box sx={{ flexGrow: 1 }}>
                <Line data={intradayChart} options={chartOptions} />
              </Box>
            </Card>
          </Grid>
        )}

        {weightChart && (
          <Grid item xs={12}>
            <Card elevation={3} sx={{ ...cardStyle, height: 500 }}>
              <Typography sx={headerStyle}>Monthly Weight</Typography>
              <Box sx={{ flexGrow: 1 }}>
                <Line data={weightChart} options={chartOptions} />
              </Box>
            </Card>
          </Grid>
        )}



        {fatChart && (
          <Grid item xs={12}>
            <Card elevation={3} sx={{ ...cardStyle, height: 500 }}>
              <Typography sx={headerStyle}>Monthly Body Fat</Typography>
              <Box sx={{ flexGrow: 1 }}>
                <Line data={fatChart} options={chartOptions} />
              </Box>
            </Card>
          </Grid>
        )}

        {bmiChart && (
          <Grid item xs={12}>
            <Card elevation={3} sx={{ ...cardStyle, height: 500 }}>
              <Typography sx={headerStyle}>Monthly BMI</Typography>
              <Box sx={{ flexGrow: 1 }}>
                <Line data={bmiChart} options={chartOptions} />
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

