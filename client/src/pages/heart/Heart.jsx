import { Card, Typography, Box } from "@mui/material";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import api from "../../api";

export default function Heart() {
  const [hourlyChart, setHourlyChart] = useState(null);
  const [latestValue, setLatestValue] = useState(null);

  const userId = 2022484408;

  useEffect(() => {
    async function fetchHeartData() {
      try {
        const res = await api.get(`/api/heartRate/heart/${userId}/`);
        const data = Array.isArray(res.data) ? res.data : [];

        if (data.length > 0) {
          const sorted = [...data].sort((a, b) =>
            new Date(a.Time) - new Date(b.Time)
          );
          setLatestValue(sorted[sorted.length - 1]);
        }

        setHourlyChart({
          labels: data.map((d) =>
            new Date(d.Time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          ),
          datasets: [
            {
              label: "Heart Rate (BPM)",
              data: data.map((d) => d.Value),
              borderColor: "#e53935",
              backgroundColor: "rgba(229,57,53,0.25)",
              fill: true,
              tension: 0.3,
            },
          ],
        });
      } catch (err) {
        console.error("Failed fetching heart data:", err);
      }
    }

    fetchHeartData();
  }, [userId]);

  const cardStyle = {
    height: 320,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 3,
    width: "90vw",
    maxWidth: "1000px",
    marginBottom: 16,
  };

  const headerStyle = {
    color: "#e53935",
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
      {latestValue && (
        <Card elevation={3} sx={cardStyle}>
          <Typography sx={headerStyle}>Current Heart Rate</Typography>
          <Typography sx={{ fontSize: "2.4rem", fontWeight: 700 }}>
            {latestValue.Value} BPM
          </Typography>
          <Typography sx={{ marginTop: 1, color: "#666" }}>
            Last Measurement:{" "}
            {new Date(latestValue.Time).toLocaleString()}
          </Typography>
        </Card>
      )}

      {hourlyChart && (
        <Card elevation={3} sx={{ ...cardStyle, height: 500 }}>
          <Typography sx={headerStyle}>Hourly Heart Rate Trend</Typography>
          <Box sx={{ flexGrow: 1, width: "100%" }}>
            <Line data={hourlyChart} options={{ maintainAspectRatio: false }} />
          </Box>
        </Card>
      )}
    </Box>
  );
}
