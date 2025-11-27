import React from 'react';
import './styles.css';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Divider,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import InsightsIcon from '@mui/icons-material/Insights';
import { createSleepLog, fetchSleepLogs, fetchSleepSummary, importSleepData } from './api';

const todayStr = () => new Date().toISOString().slice(0, 10);

const minutesToHours = (mins) => (mins ? (mins / 60).toFixed(2) : '0.00');

const formatLabel = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  return dateStr;
};

const TrendChart = ({ series = [] }) => {
  if (!series.length) return <Typography variant="body2" color="text.secondary">No data yet</Typography>;
  const width = Math.max(640, series.length * 38);
  const height = 260;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const maxVal = Math.max(...series.map((p) => p.hours || 0), 1);
  const minVal = 0;
  const xScale = (idx) => {
    const span = series.length - 1 || 1;
    return padding.left + (idx / span) * (width - padding.left - padding.right);
  };
  const yScale = (val) => {
    const usable = height - padding.top - padding.bottom;
    return padding.top + (1 - (val - minVal) / (maxVal - minVal)) * usable;
  };
  const points = series.map((p, i) => `${xScale(i)},${yScale(p.hours || 0)}`).join(' ');
  const ticks = 4;
  const yTicks = [...Array(ticks + 1)].map((_, i) => {
    const val = minVal + ((maxVal - minVal) * i) / ticks;
    return { val: val.toFixed(1), y: yScale(val) };
  });
  const step = Math.max(1, Math.ceil(series.length / 8));
  const xLabels = series.map((p, i) => ({ label: (i % step === 0 || i === series.length - 1) ? formatLabel(p.date) : '', x: xScale(i) }));
  return (
    <svg width={width} height={height} role="img" aria-label="Sleep trend with axes">
      {/* Axes */}
      <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="#aaa" />
      <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="#aaa" />
      {/* Y ticks */}
      {yTicks.map((t, idx) => (
        <g key={idx}>
          <line x1={padding.left - 5} x2={width - padding.right} y1={t.y} y2={t.y} stroke="#f0f0f0" />
          <text x={padding.left - 10} y={t.y + 4} fontSize="10" textAnchor="end" fill="#666">{t.val}h</text>
        </g>
      ))}
      {/* X labels */}
      {xLabels.map((t, idx) => (
        <text key={idx} x={t.x} y={height - padding.bottom + 20} fontSize="10" textAnchor="middle" fill="#666" transform={`rotate(-25 ${t.x},${height - padding.bottom + 20})`}>
          {t.label}
        </text>
      ))}
      {/* Data line */}
      <polyline fill="none" stroke="#1976d2" strokeWidth="3" points={points} strokeLinejoin="round" strokeLinecap="round" />
      {series.map((p, idx) => (
        <circle key={idx} cx={xScale(idx)} cy={yScale(p.hours || 0)} r="4" fill="#1976d2" opacity={0.9} />
      ))}
      {/* Axis labels */}
      <text x={padding.left} y={padding.top - 6} fontSize="11" fill="#444">Hours slept</text>
      <text x={width - padding.right} y={height - padding.bottom + 32} fontSize="11" fill="#444" textAnchor="end">Date</text>
    </svg>
  );
};

const Sleep = () => {
  const [form, setForm] = React.useState({
    sleep_day: todayStr(),
    hours_slept: '7.5',
    was_interrupted: false,
    interruptions: 0,
    interruption_minutes: 0,
    notes: '',
  });
  const [logs, setLogs] = React.useState([]);
  const [summary, setSummary] = React.useState(null);
  const [file, setFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [range, setRange] = React.useState({ start: '', end: '' });

  const loadData = React.useCallback(async (params = {}) => {
    try {
      const query = {};
      if (params.start) query.start = params.start;
      if (params.end) query.end = params.end;
      const [logsRes, summaryRes] = await Promise.all([
        fetchSleepLogs(query),
        fetchSleepSummary(query),
      ]);
      setLogs(logsRes?.data || []);
      setSummary(summaryRes?.data || null);
    } catch (e) {
      setError('Could not load sleep data.');
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createSleepLog({
        ...form,
        hours_slept: parseFloat(form.hours_slept || 0),
        interruptions: form.was_interrupted ? Number(form.interruptions || 0) : 0,
        interruption_minutes: form.was_interrupted ? Number(form.interruption_minutes || 0) : 0,
      });
      await loadData();
    } catch (err) {
      const message = err?.response?.data?.detail || JSON.stringify(err?.response?.data || 'Unable to save sleep entry.');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Select a JSON file to import.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await importSleepData({ file });
      await loadData();
    } catch (err) {
      const message = err?.response?.data?.detail || 'Import failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleImport = async () => {
    setLoading(true);
    setError('');
    try {
      await importSleepData({ useSample: true });
      await loadData();
    } catch (err) {
      const message = err?.response?.data?.detail || 'Sample import failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const minutesSeries = summary?.timeseries?.map((t) => t.minutes) || [];
  const chartSeries = (summary?.timeseries || []).map((t) => ({
    date: t.sleep_day || t.date || t.sleep_day_label || '',
    hours: (t.minutes || 0) / 60,
  }));

  const handleApplyRange = async () => {
    await loadData({ start: range.start || undefined, end: range.end || undefined });
  };

  const handleResetRange = async () => {
    setRange({ start: '', end: '' });
    await loadData();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <BedtimeIcon /> Sleep Tracker
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Record quick entries, import the bundled dataset, and monitor trends with lightweight charts.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={6}>
          <Card>
            <CardHeader title="Quick entry" subheader="How many hours did you sleep?" />
            <CardContent>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Date"
                  type="date"
                  value={form.sleep_day}
                  onChange={(e) => handleChange('sleep_day', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <TextField
                  label="Hours slept"
                  type="number"
                  inputProps={{ step: 0.25, min: 0 }}
                  value={form.hours_slept}
                  onChange={(e) => handleChange('hours_slept', e.target.value)}
                  required
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.was_interrupted}
                      onChange={(e) => handleChange('was_interrupted', e.target.checked)}
                    />
                  }
                  label="Sleep was interrupted"
                />
                {form.was_interrupted && (
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                      label="Number of interruptions"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={form.interruptions}
                      onChange={(e) => handleChange('interruptions', e.target.value)}
                      sx={{ flex: 1, minWidth: 150 }}
                    />
                    <TextField
                      label="Minutes awake in between"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={form.interruption_minutes}
                      onChange={(e) => handleChange('interruption_minutes', e.target.value)}
                      sx={{ flex: 1, minWidth: 150 }}
                    />
                  </Box>
                )}
                <TextField
                  label="Notes"
                  value={form.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  multiline
                  maxRows={3}
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button variant="contained" type="submit" disabled={loading}>
                  Save sleep entry
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Card>
            <CardHeader title="Import data" subheader="Upload JSON or load the bundled sample." />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
                  Choose JSON file
                  <input type="file" hidden accept=".json" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </Button>
                {file && <Typography variant="body2" color="text.secondary">{file.name}</Typography>}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button variant="contained" onClick={handleImport} disabled={loading}>Import selected</Button>
                  <Button variant="text" startIcon={<CloudDownloadIcon />} onClick={handleSampleImport} disabled={loading}>
                    Use bundled sample
                  </Button>
                </Box>
                {error && <Typography color="error">{error}</Typography>}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Charts & stats" subheader="All available sleep data" avatar={<InsightsIcon />} />
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Avg hours</Typography>
                  <Typography variant="h5">{summary ? summary.average_hours_asleep.toFixed(2) : '0.00'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Interrupted</Typography>
                  <Typography variant="h5">{summary ? `${summary.interruption_rate}%` : '0%'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Longest</Typography>
                  <Typography variant="h5">{summary ? minutesToHours(summary.longest_sleep_minutes) : '0.00'}h</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: { xs: 'stretch', sm: 'flex-end' }, mb: 2 }}>
                <TextField
                  label="From"
                  type="date"
                  size="small"
                  value={range.start}
                  onChange={(e) => setRange((prev) => ({ ...prev, start: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 200 }}
                />
                <TextField
                  label="To"
                  type="date"
                  size="small"
                  value={range.end}
                  onChange={(e) => setRange((prev) => ({ ...prev, end: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 200 }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" size="small" onClick={handleApplyRange}>Apply</Button>
                  <Button variant="text" size="small" onClick={handleResetRange}>Show all</Button>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box className="sleep-chart">
                <TrendChart series={chartSeries} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="Sleep history" />
            <CardContent>
              <Paper variant="outlined" sx={{ maxHeight: 360, overflow: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Hours</TableCell>
                      <TableCell>Interrupted</TableCell>
                      <TableCell>Interruptions</TableCell>
                      <TableCell>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(logs || []).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.sleep_day}</TableCell>
                        <TableCell>{minutesToHours(log.total_minutes_asleep)}h</TableCell>
                        <TableCell>{log.was_interrupted ? 'Yes' : 'No'}</TableCell>
                        <TableCell>{log.interruptions || 0}</TableCell>
                        <TableCell>{log.notes || '-'}</TableCell>
                      </TableRow>
                    ))}
                    {!logs?.length && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <Typography align="center" color="text.secondary">No entries yet.</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Sleep;
