import { useState } from "react";
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
} from "@mui/material";

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

  const handleConfirm = (choice) => {
    if (choice === "no") {
      setOpen(false);
      return;
    }
    setStep("moodTag");
  };

  const handleSaveMood = () => {
    const newRecord = {
      time: new Date().toLocaleString(),
      mood: moodTag,
      cause: moodCause,
    };
    setMoodRecords((prev) => [newRecord, ...prev]);
    setOpen(false);
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
