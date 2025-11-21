import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
} from "@mui/material";

import moodImg from "../../assets/images/mood.jpg";
import emoImg from "../../assets/images/emo.jpg";
import { useSelector } from "react-redux";
import api from "../../api";

const MOOD_TAGS = [
  "Happy", "Joyful", "Relaxed", "Cheerful", "Fulfilled",
  "Sad", "Depressed", "Angry", "Anxious", "Stressed", "Down"
];

const MOOD_CAUSES = [
  "Family", "Partner", "Friends", "Work", "School",
  "Money", "Health", "Exercise", "Weather", "Entertainment", "Other"
];

export default function Mood() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState("confirm");

  const [moodTag, setMoodTag] = useState("");
  const [moodCause, setMoodCause] = useState("");

  const [moodRecords, setMoodRecords] = useState([]);
  const userId = useSelector((state) => state.user.user_id);

  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    fetchMoods();
  }, [userId]);

  async function fetchMoods() {
    try {
      if (!userId) return;
      const res = await api.get(`/api/mood/moods/${userId}/`);
      const data = Array.isArray(res.data) ? res.data : [];
      const normalized = data.map((it) => ({
        ...it,
        time: it.timestamp || it.time || new Date().toLocaleString(),
        mood: it.mood_tag || it.mood || "",
        cause: it.mood_cause || it.cause || "",
      }));
      setMoodRecords(normalized);
    } catch (err) {
      console.error("Failed to fetch moods:", err);
    }
  }

  const handleConfirm = (choice) => {
    if (choice === "no") {
      setOpen(false);
      return;
    }
    setStep("moodTag");
  };

  const handleSaveMood = () => {
    (async () => {
      try {
        const payload = {
          Id: userId,
          mood_tag: moodTag,
          mood_cause: moodCause,
        };
        const res = await api.post("/api/mood/moods/add/", payload);
        if (res && res.data) {
          const it = res.data;
          const norm = {
            ...it,
            time: it.timestamp || new Date().toLocaleString(),
            mood: it.mood_tag || "",
            cause: it.mood_cause || "",
          };
          setMoodRecords((prev) => [norm, ...prev]);
          setSnack({ open: true, message: "Mood saved", severity: "success" });
        } else {
          setSnack({ open: true, message: "Saved but no server data returned", severity: "warning" });
        }
        setOpen(false);
      } catch (err) {
        console.error("Failed to save mood:", err);
        setSnack({ open: true, message: "Failed to save mood", severity: "error" });
      }
    })();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 3 }}>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        BackdropProps={{ invisible: false }}
      >
        {step === "confirm" && (
          <>
            <img src={moodImg} alt="select your mood" style={{ width: "100%", maxWidth: 360, height: "auto", display: "block", margin: "0 auto 12px" }} />
            <DialogTitle>Select your overall feeling today</DialogTitle>
            <DialogActions>
              <Button variant="outlined" onClick={() => handleConfirm("no")}>
                No
              </Button>
              <Button variant="contained" onClick={() => handleConfirm("yes")}>
                Yes
              </Button>
            </DialogActions>
          </>
        )}

        {step === "moodTag" && (
          <>
            <img src={emoImg} alt="select your mood" style={{ width: "100%", maxWidth: 360, height: "auto", display: "block", margin: "0 auto 12px" }} />
            <DialogTitle>Which one best describes this feeling?</DialogTitle>
            <DialogContent>
              <ToggleButtonGroup
                value={moodTag}
                exclusive
                onChange={(e, v) => v && setMoodTag(v)}
                sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}
              >
                {MOOD_TAGS.map((tag) => (
                  <ToggleButton key={tag} value={tag}>
                    {tag}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </DialogContent>
            <DialogActions>
              <Button
                disabled={!moodTag}
                variant="contained"
                onClick={() => setStep("moodCause")}
              >
                Next
              </Button>
            </DialogActions>
          </>
        )}

        {step === "moodCause" && (
          <>
            <img src={emoImg} alt="select your emo" style={{ width: "100%", maxWidth: 360, height: "auto", display: "block", margin: "0 auto 12px" }} />
            <DialogTitle>What influenced your mood?</DialogTitle>
            <DialogContent>
              <ToggleButtonGroup
                value={moodCause}
                exclusive
                onChange={(e, v) => v && setMoodCause(v)}
                sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}
              >
                {MOOD_CAUSES.map((cause) => (
                  <ToggleButton key={cause} value={cause}>
                    {cause}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </DialogContent>
            <DialogActions>
              <Button
                disabled={!moodCause}
                variant="contained"
                onClick={handleSaveMood}
              >
                Finish
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Card sx={{ width: "90vw", maxWidth: 800, p: 3, mt: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Mood Records
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Time</strong></TableCell>
              <TableCell><strong>Mood</strong></TableCell>
              <TableCell><strong>Cause</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {moodRecords.map((rec, i) => (
              <TableRow key={i}>
                <TableCell>{rec.time}</TableCell>
                <TableCell>{rec.mood}</TableCell>
                <TableCell>{rec.cause}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {moodRecords.length === 0 && (
          <Typography sx={{ mt: 2, color: "#999", textAlign: "center" }}>
            No mood records yet
          </Typography>
        )}
      </Card>
    </Box>
  );
}

