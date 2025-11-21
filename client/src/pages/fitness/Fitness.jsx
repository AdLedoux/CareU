import { Card, Typography, Box } from "@mui/material";
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 3,
      }}
    >
      {fitnessChart && (
        <Card elevation={3} sx={cardStyle}>
          <Typography sx={headerStyle}>Fitness Intensity Trend</Typography>
          <Box sx={{ flexGrow: 1, width: "100%" }}>
            <Line data={fitnessChart} options={{ maintainAspectRatio: false }} />
          </Box>
        </Card>
      )}
    </Box>
  );
}
