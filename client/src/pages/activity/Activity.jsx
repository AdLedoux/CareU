import { Card, Typography, Grid, Button, Box } from "@mui/material";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

export default function Activity() {
  const navigate = useNavigate();

  const weeklySteps = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Steps",
        data: [8500, 9100, 7600, 10300, 9800, 5000, 7200],
        borderColor: "#1976d2",
        backgroundColor: "rgba(25,118,210,0.25)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const calorieTrend = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Calories Burned (kcal)",
        data: [280, 310, 295, 330, 350, 270, 260],
        borderColor: "#ff9800",
        backgroundColor: "rgba(255,152,0,0.25)",
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
      {/* ✅ Flex container for heading and back button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
          🏃 Activity Overview
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
            <Typography sx={headerStyle}>Today’s Summary</Typography>
            <Box sx={contentBoxStyle}>
              <Typography>Steps: 8 450</Typography>
              <Typography>Calories: 310 kcal</Typography>
              <Typography>Active Minutes: 47 min</Typography>
              <Button variant="contained" sx={{ mt: 2 }}>
                View Weekly Trend
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Card 2 */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={cardStyle}>
            <Typography sx={headerStyle}>7-Day Highlights</Typography>
            <Box sx={contentBoxStyle}>
              <Typography>Best Day: Fri (10 120 steps)</Typography>
              <Typography>Lowest Day: Sun (3 900 steps)</Typography>
              <Typography>Avg Calories: 295 kcal/day</Typography>
            </Box>
          </Card>
        </Grid>

        {/* Chart 1 */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={cardStyle}>
            <Typography sx={headerStyle}>Weekly Steps Trend</Typography>
            <Box sx={{ ...contentBoxStyle, width: "100%" }}>
              <Line data={weeklySteps} />
            </Box>
          </Card>
        </Grid>

        {/* Chart 2 */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={cardStyle}>
            <Typography sx={headerStyle}>Calories Trend</Typography>
            <Box sx={{ ...contentBoxStyle, width: "100%" }}>
              <Line data={calorieTrend} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
