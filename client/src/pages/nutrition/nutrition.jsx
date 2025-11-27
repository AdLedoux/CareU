import React from 'react';
import './styles.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Divider from '@mui/material/Divider';

import { searchFoods, saveMeal, getMeals, getSummary, createFood } from './api';

function computeMealTotals(meal) {
  const totals = { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };
  (meal.items || []).forEach(it => {
    const factor = (it.quantity_g || 0) / 100.0;
    const f = it.food || {};
    totals.calories += (f.calories || 0) * factor;
    totals.protein_g += (f.protein_g || 0) * factor;
    totals.carbs_g += (f.carbs_g || 0) * factor;
    totals.fat_g += (f.fat_g || 0) * factor;
  });
  return totals;
}
const MEAL_NAMES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const Nutrition = () => {
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [mealName, setMealName] = React.useState('Breakfast');
  const [search, setSearch] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [meals, setMeals] = React.useState([]);
  const [items, setItems] = React.useState([]); // {food, quantity_g}
  const [totals, setTotals] = React.useState({ calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0, sugar_g: 0, sodium_mg: 0 });
  const [manual, setManual] = React.useState({ name: '', grams: 100, calories: '', protein: '', carbs: '', fat: '' });
  const [lastSaved, setLastSaved] = React.useState(null);

  React.useEffect(() => {
    // Load existing meals and totals for today
    (async () => {
      try {
        const [mealsRes, summaryRes] = await Promise.all([
          getMeals(date),
          getSummary(date),
        ]);
        // Prefill builder with first meal if present
        setMeals(mealsRes?.data || []);
        if (summaryRes?.data) setTotals(summaryRes.data);
      } catch (e) {
        // noop
      }
    })();
  }, [date]);

  const handleSearch = async () => {
    try {
      const res = await searchFoods(search);
      setResults(res.data || []);
    } catch (e) {
      setResults([]);
    }
  };

  const addItem = (food) => {
    setItems(prev => [...prev, { food, quantity_g: 100 }]);
  };

  const updateQty = (idx, qty) => {
    const q = Number(qty) || 0;
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity_g: q } : it));
  };

  const removeItem = (idx) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  
  const handleDeleteMeal = async (id) => {
    try {
      const { deleteMeal } = await import('./api');
      await deleteMeal(id);
      const [mealsRes, summaryRes] = await Promise.all([getMeals(date), getSummary(date)]);
      setMeals(mealsRes.data || []);
      setTotals(summaryRes.data || totals);
    } catch {}
  };const handleSave = async () => {
    try {
      await saveMeal({
        date,
        name: mealName,
        items: items.map(it => ({ food_id: it.food.id, quantity_g: it.quantity_g }))
      });
      const [mealsRes2, summaryRes] = await Promise.all([getMeals(date), getSummary(date)]);
      setMeals(mealsRes2.data || []);
      setTotals(summaryRes.data || totals);
      setLastSaved(new Date().toISOString());
    } catch (e) {
      // noop
    }
  };

  return (
  <Box sx={{ width: '100%' }}>
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 0.5 }}>Nutrition Tracker</Typography>
      <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 2 }}>Track your meals and macros daily.</Typography>

      {/* Search Bar */}
      <Paper component="form" onSubmit={(e)=>{e.preventDefault(); handleSearch();}} sx={{ p: '4px 8px', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <SearchIcon sx={{ color: 'text.secondary' }} />
        <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search food (e.g., Chicken breast)" value={search} onChange={(e)=>setSearch(e.target.value)} />
        <Button type="submit" variant="contained">Search</Button>
      </Paper>
      {Boolean(results.length) && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <List>
              {results.map((f) => (
                <ListItem key={f.id} secondaryAction={<Button size="small" onClick={() => addItem(f)}>Add</Button>}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body1">{f.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{Math.round(f.calories)} kcal / 100g</Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Add Meal */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography gutterBottom variant="h6">Add Meal</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="meal-name-label">Meal</InputLabel>
              <Select labelId="meal-name-label" label="Meal" value={mealName} onChange={(e) => setMealName(e.target.value)}>
                {['Breakfast','Lunch','Dinner','Snack'].map(n => (
                  <MenuItem key={n} value={n}>{n}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField type="date" size="small" label="Date" value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} />
          </Box>

          <Typography variant="subtitle2">Manual Entry</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
            <TextField size="small" label="Name" value={manual.name} onChange={(e) => setManual({ ...manual, name: e.target.value })} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField size="small" type="number" label="Quantity (g)" value={manual.grams} onChange={(e) => setManual({ ...manual, grams: Number(e.target.value) || 0 })} sx={{ flex: 1 }} />
              <TextField size="small" type="number" label="Calories" value={manual.calories} onChange={(e) => setManual({ ...manual, calories: e.target.value })} sx={{ flex: 1 }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField size="small" type="number" label="Protein (g)" value={manual.protein} onChange={(e) => setManual({ ...manual, protein: e.target.value })} sx={{ flex: 1 }} />
              <TextField size="small" type="number" label="Carbs (g)" value={manual.carbs} onChange={(e) => setManual({ ...manual, carbs: e.target.value })} sx={{ flex: 1 }} />
              <TextField size="small" type="number" label="Fat (g)" value={manual.fat} onChange={(e) => setManual({ ...manual, fat: e.target.value })} sx={{ flex: 1 }} />
            </Box>
            <Button variant="outlined" onClick={async () => {
              const g = Number(manual.grams) || 0;
              if (!manual.name || g <= 0) return;
              const cals = Number(manual.calories) || 0;
              const prot = Number(manual.protein) || 0;
              const carbs = Number(manual.carbs) || 0;
              const fat = Number(manual.fat) || 0;
              const factor = g > 0 ? (100 / g) : 0;
              try {
                const res = await createFood({ name: manual.name, calories: cals * factor, protein_g: prot * factor, carbs_g: carbs * factor, fat_g: fat * factor });
                const food = res?.data;
                if (food?.id) { setItems(prev => [...prev, { food, quantity_g: g }]); setManual({ name: '', grams: 100, calories: '', protein: '', carbs: '', fat: '' }); }
              } catch {}
            }}>Add to Meal</Button>
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>Current Items</Typography>
          <List>
            {items.map((it, idx) => (
              <ListItem key={idx} secondaryAction={<IconButton edge="end" aria-label="delete" onClick={() => removeItem(idx)}><DeleteIcon /></IconButton>}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1">{it.food.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{Math.round(it.food.calories)} kcal/100g</Typography>
                  </Box>
                  <TextField type="number" size="small" label="g" value={it.quantity_g} onChange={(e) => updateQty(idx, e.target.value)} sx={{ width: 100 }} />
                </Box>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleSave} disabled={!items.length}>Save Meal</Button>
          </Box>
        </CardContent>
      </Card>

      {/* Daily Totals */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Daily Totals</Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="date-select-label">Select Date</InputLabel>
              <Select labelId="date-select-label" label="Select Date" value={date} onChange={(e) => setDate(e.target.value)}>
                {[...Array(14)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - i); const val = d.toISOString().slice(0,10); return <MenuItem key={val} value={val}>{val}</MenuItem>; })}
              </Select>
            </FormControl>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}><Card sx={{ p: 1 }}><Typography align="center">Calories</Typography><Typography align="center" variant="h6">{Math.round(totals.calories || 0)}</Typography></Card></Grid>
            <Grid item xs={6} sm={3}><Card sx={{ p: 1 }}><Typography align="center">Protein (g)</Typography><Typography align="center" variant="h6">{Math.round(totals.protein_g || 0)}</Typography></Card></Grid>
            <Grid item xs={6} sm={3}><Card sx={{ p: 1 }}><Typography align="center">Carbs (g)</Typography><Typography align="center" variant="h6">{Math.round(totals.carbs_g || 0)}</Typography></Card></Grid>
            <Grid item xs={6} sm={3}><Card sx={{ p: 1 }}><Typography align="center">Fat (g)</Typography><Typography align="center" variant="h6">{Math.round(totals.fat_g || 0)}</Typography></Card></Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Meals List (optional, below totals) */}
      {!!meals.length && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Meals on {date}</Typography>
          <Grid container spacing={2}>
            {(meals || []).map((m) => { const mt = computeMealTotals(m); return (
              <Grid item xs={12} key={m.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{m.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{date}</Typography>
                      </Box>
                      <Button color="error" onClick={() => handleDeleteMeal(m.id)}>Delete</Button>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                      <Typography variant="body2">Calories: {Math.round(mt.calories)}</Typography>
                      <Typography variant="body2">Protein: {Math.round(mt.protein_g)}g</Typography>
                      <Typography variant="body2">Carbs: {Math.round(mt.carbs_g)}g</Typography>
                      <Typography variant="body2">Fat: {Math.round(mt.fat_g)}g</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ); })}
          </Grid>
        </Box>
      )}
    </Container>
  </Box>
);};

export default Nutrition;



