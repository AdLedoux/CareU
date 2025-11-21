import { Card, CardContent, Typography, Grid, TextField, Button, Box } from "@mui/material";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

export default function Fitness() {
  const navigate = useNavigate();

  const cycleLengths = {
    labels: ["Aug", "Sep", "Oct", "Nov"],
    datasets: [
      {
        label: "Cycle Length (days)",
        data: [27, 28, 29, 28],
        borderColor: "#ec407a",
        backgroundColor: "rgba(236,64,122,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const symptomCounts = {
    labels: ["Mood", "Cramps", "Headache", "Fatigue"],
    datasets: [
      {
        label: "Occurrences (Last 4 Cycles)",
        data: [5, 7, 3, 6],
        backgroundColor: "rgba(255,99,132,0.6)",
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
  );
}
