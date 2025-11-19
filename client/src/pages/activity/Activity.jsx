import { Card, Typography, Grid, Box } from "@mui/material";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import api from "../../api";

export default function Activity() {
  const [dailyStepsChart, setDailyStepsChart] = useState(null);
  const [dailyDistanceChart, setDailyDistanceChart] = useState(null);
  const [dailyCaloriesChart, setDailyCaloriesChart] = useState(null);
  const [rawDailyData, setRawDailyData] = useState([]);

  const userId = 1503960366;

  useEffect(() => {
    async function fetchDailyData() {
      try {
        const res = await api.get(`/api/activity/activity/${userId}/daily/`);
        const data = Array.isArray(res.data) ? res.data : [];

        setDailyStepsChart({
          labels: data.map((d) => d.date),
          datasets: [
            {
              label: "Steps",
              data: data.map((d) => d.TotalSteps),
              borderColor: "#1976d2",
              backgroundColor: "rgba(25,118,210,0.25)",
              fill: true,
              tension: 0.3,
            },
          ],
        });

        setDailyDistanceChart({
          labels: data.map((d) => d.date),
          datasets: [
            {
              label: "Distance (km)",
              data: data.map((d) => d.TotalDistance),
              borderColor: "#4caf50",
              backgroundColor: "rgba(76,175,80,0.25)",
              fill: true,
              tension: 0.3,
            },
          ],
        });

        setDailyCaloriesChart({
          labels: data.map((d) => d.date),
          datasets: [
            {
              label: "Calories",
              data: data.map((d) => d.Calories),
              borderColor: "#ff9800",
              backgroundColor: "rgba(255,152,0,0.25)",
              fill: true,
              tension: 0.3,
            },
          ],
        });
        setRawDailyData(data);
      } catch (err) {
        console.error("Failed fetching daily data:", err);
      }
    }

    fetchDailyData();
  }, [userId]);

  function computeSummaries(data) {
    if (!data || data.length === 0) return null;
    const sorted = [...data].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    const latest = new Date(sorted[sorted.length - 1].date);
    const weekStart = new Date(latest);
    weekStart.setDate(latest.getDate() - 6);

    let weekly = { TotalSteps: 0, TotalDistance: 0, Calories: 0 };
    let monthly = { TotalSteps: 0, TotalDistance: 0, Calories: 0 };

    for (const r of sorted) {
      const d = new Date(r.date);
      if (d >= weekStart && d <= latest) {
        weekly.TotalSteps += Number(r.TotalSteps || 0);
        weekly.TotalDistance += Number(r.TotalDistance || 0);
        weekly.Calories += Number(r.Calories || 0);
      }
      if (d.getFullYear() === latest.getFullYear() && d.getMonth() === latest.getMonth()) {
        monthly.TotalSteps += Number(r.TotalSteps || 0);
        monthly.TotalDistance += Number(r.TotalDistance || 0);
        monthly.Calories += Number(r.Calories || 0);
      }
    }

    return {
      latestDate: sorted[sorted.length - 1].date,
      weekly,
      monthly,
    };
  }

  const summaries = computeSummaries(rawDailyData);

  const cardStyle = {
    height: 500,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 3,
    width: "90vw",
    maxWidth: "1200px",
    marginBottom: 16,
  };

  const headerStyle = {
    color: "#1976d2",
    fontWeight: 700,
    fontSize: "1.6rem",
    textAlign: "center",
    marginBottom: 1,
  };

  const contentBoxStyle = {
    flexGrow: 1,
    width: "100%",
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 3 }}>
      {dailyStepsChart && (
        <Card elevation={3} sx={cardStyle}>
          <Typography sx={headerStyle}>Daily Steps</Typography>
          <Box sx={contentBoxStyle}>
            <Line data={dailyStepsChart} options={{ maintainAspectRatio: false }} />
          </Box>
        </Card>
      )}

      {dailyDistanceChart && (
        <Card elevation={3} sx={cardStyle}>
          <Typography sx={headerStyle}>Daily Distance</Typography>
          <Box sx={contentBoxStyle}>
            <Line data={dailyDistanceChart} options={{ maintainAspectRatio: false }} />
          </Box>
        </Card>
      )}

      {dailyCaloriesChart && (
        <Card elevation={3} sx={cardStyle}>
          <Typography sx={headerStyle}>Daily Calories</Typography>
          <Box sx={contentBoxStyle}>
            <Line data={dailyCaloriesChart} options={{ maintainAspectRatio: false }} />
          </Box>
        </Card>
      )}
    </Box>
  );
}
