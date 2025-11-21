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
import { useSelector, useDispatch } from "react-redux";
import { fetchMoods, createMood } from "../../redux/moodSlice";

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

  const userId = useSelector((state) => state.user.user_id);
  const moodItems = useSelector((state) => state.mood.items || []);
  const dispatch = useDispatch();

  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    if (!userId) return;
    dispatch(fetchMoods(userId));
  }, [userId, dispatch]);

  const handleConfirm = (choice) => {
    if (choice === "no") {
      setOpen(false);
      return;
    }
    setStep("moodTag");
  };

  const handleSaveMood = async () => {
    try {
      const payload = {
        Id: userId,
        mood_tag: moodTag,
        mood_cause: moodCause,
      };
      const result = await dispatch(createMood(payload)).unwrap();
      // createMood thunk already pushes the created item into the slice's items
      setSnack({ open: true, message: "Mood saved", severity: "success" });
      setOpen(false);
    } catch (err) {
      console.error("Failed to save mood:", err);
      setSnack({ open: true, message: "Failed to save mood", severity: "error" });
    }
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
            {moodItems.map((it, i) => {
              const time = it.timestamp || it.time || new Date().toLocaleString();
              const mood = it.mood_tag || it.mood || "";
              const cause = it.mood_cause || it.cause || "";
              return (
                <TableRow key={i}>
                  <TableCell>{time}</TableCell>
                  <TableCell>{mood}</TableCell>
                  <TableCell>{cause}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {moodItems.length === 0 && (
          <Typography sx={{ mt: 2, color: "#999", textAlign: "center" }}>
            No mood records yet
          </Typography>
        )}
      </Card>
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s)=>({...s, open:false}))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnack((s)=>({...s, open:false}))} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

