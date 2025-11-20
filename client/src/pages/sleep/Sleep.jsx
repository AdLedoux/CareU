import { Card, Typography, Box } from "@mui/material";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import api from "../../api";

export default function Sleep() {
  const [sleepChart, setSleepChart] = useState(null);

  const userId = 7086361926;

  useEffect(() => {
    async function fetchSleepData() {
      try {
        const res = await api.get(`/api/sleep/sleep/${userId}/`);
        const data = Array.isArray(res.data) ? res.data : [];

        // 按日期排序
        const sorted = [...data].sort(
          (a, b) => new Date(a.SleepDay) - new Date(b.SleepDay)
        );

        setSleepChart({
          labels: sorted.map(r => new Date(r.SleepDay).toLocaleDateString()),
          datasets: [
            {
              label: "Minutes Asleep",
              data: sorted.map(r => r.TotalMinutesAsleep),
              borderColor: "#3f51b5",
              backgroundColor: "rgba(63,81,181,0.25)",
              fill: true,
              tension: 0.3,
            },
            {
              label: "Time in Bed",
              data: sorted.map(r => r.TotalTimeInBed),
              borderColor: "#f50057",
              backgroundColor: "rgba(245,0,87,0.25)",
              fill: true,
              tension: 0.3,
            },
          ],
        });
      } catch (err) {
        console.error("Failed fetching sleep data:", err);
      }
    }

    fetchSleepData();
  }, [userId]);

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    padding: 3,
    width: "90vw",
    maxWidth: "1000px",
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
      {sleepChart && (
        <Card elevation={3} sx={cardStyle}>
          <Typography sx={headerStyle}>Daily Sleep Trend</Typography>
          <Box sx={{ flexGrow: 1, width: "100%" }}>
            <Line data={sleepChart} options={{ maintainAspectRatio: false }} />
          </Box>
        </Card>
      )}
    </Box>
  );
}
