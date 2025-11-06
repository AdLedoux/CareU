import { Card, Typography, Grid, Box, Button } from "@mui/material";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

export default function Heart() {
  const navigate = useNavigate();

  const hrTrend = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Resting HR (BPM)",
        data: [72, 74, 70, 75, 71, 69, 73],
        borderColor: "#e53935",
        backgroundColor: "rgba(229,57,53,0.15)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const bpTrend = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Systolic (mmHg)",
        data: [118, 120, 122, 119, 121, 117, 118],
        borderColor: "#ef6c00",
        backgroundColor: "rgba(239,108,0,0.15)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Diastolic (mmHg)",
        data: [78, 77, 79, 80, 76, 75, 77],
        borderColor: "#43a047",
        backgroundColor: "rgba(67,160,71,0.15)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const cardStyle = {
    height: 360,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 2,
  };

  const headerStyle = {
    color: "#1976d2",
    fontWeight: 700,
    fontSize: "1.2rem",
    textAlign: "center",
    marginBottom: 1,
  };

  const contentBoxStyle = {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
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
          ❤️ Heart Health
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
        {/* Card 1 */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={cardStyle}>
            <Typography sx={headerStyle}>Current Readings</Typography>
            <Box sx={contentBoxStyle}>
              <Typography>Resting HR: 72 BPM</Typography>
              <Typography>Max HR Today: 132 BPM</Typography>
              <Typography>Avg This Week: 76 BPM</Typography>
            </Box>
          </Card>
        </Grid>

        {/* Card 2 */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={cardStyle}>
            <Typography sx={headerStyle}>Insights</Typography>
            <Box sx={contentBoxStyle}>
              <Typography>
                Your heart rate is within a healthy range for your age group.
              </Typography>
              <Typography>
                Keep resting HR below 80 BPM for optimal fitness.
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={cardStyle}>
            <Typography sx={headerStyle}>Heart Rate Trend</Typography>
            <Box sx={{ ...contentBoxStyle, width: "100%" }}>
              <Line data={hrTrend} />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={cardStyle}>
            <Typography sx={headerStyle}>Blood Pressure Trend</Typography>
            <Box sx={{ ...contentBoxStyle, width: "100%" }}>
              <Line data={bpTrend} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
