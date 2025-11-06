import { Card, Typography, Grid, TextField, Button, Box } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

export default function Body() {
  const navigate = useNavigate();

  const weightHistory = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Weight (kg)",
        data: [72.5, 72.0, 71.6, 71.2],
        backgroundColor: "rgba(25,118,210,0.6)",
      },
    ],
  };

  const bodyFatHistory = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Body Fat (%)",
        data: [17.9, 17.7, 17.5, 17.3],
        backgroundColor: "rgba(76,175,80,0.6)",
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
          ⚖ Body Measurements
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
            <Typography sx={headerStyle}>Current Stats</Typography>
            <Box sx={contentBoxStyle}>
              <Typography>Weight: 71.5 kg</Typography>
              <Typography>BMI: 22.9</Typography>
              <Typography>Body Fat: 17.5 %</Typography>
            </Box>
          </Card>
        </Grid>

        {/* Card 2 */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={cardStyle}>
            <Typography sx={headerStyle}>Log New Measurement</Typography>
            <Box sx={contentBoxStyle}>
              <TextField label="Weight (kg)" fullWidth margin="dense" />
              <TextField label="Body Fat (%)" fullWidth margin="dense" />
              <Button variant="contained" sx={{ mt: 2 }}>
                Save
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Chart 1 */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={cardStyle}>
            <Typography sx={headerStyle}>Weight History</Typography>
            <Box sx={{ ...contentBoxStyle, width: "100%" }}>
              <Bar data={weightHistory} />
            </Box>
          </Card>
        </Grid>

        {/* Chart 2 */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={cardStyle}>
            <Typography sx={headerStyle}>Body Fat Trend</Typography>
            <Box sx={{ ...contentBoxStyle, width: "100%" }}>
              <Bar data={bodyFatHistory} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
