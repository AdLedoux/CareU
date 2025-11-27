import React from 'react';
import "./styles.css"
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MedicationIcon from '@mui/icons-material/Medication';
import AppleIcon from '@mui/icons-material/Apple';
import BedIcon from '@mui/icons-material/Bed';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Ai from '../../components/ai/ai';

const Home = () => {
    const Icons = [
        <LocalFireDepartmentIcon />,
        <AccessibilityIcon />,
        <EmojiEmotionsIcon />,
        <FavoriteIcon />,
        // <MedicationIcon />,
        <AppleIcon />,
        <BedIcon />,
        <FitnessCenterIcon />,
    ];

    // const item_list = ['Activity', 'Body Measurements', 'Moods', 'Heart', 'Medications', 'Nutrition', 'Sleep', 'Fitness']
    // const linklist = ['/activity', '/body-measurements', 'moods', 'heart', 'medications', 'nutrition', 'sleep', 'fitness']

    const item_list = ['Activity', 'Body Measurements', 'Moods', 'Heart', 'Nutrition', 'Sleep', 'Fitness']
    const linklist = ['/activity', '/body-measurements', '/moods', '/heart', '/nutrition', '/sleep', '/fitness']

    const item_summaries = [
        'Track your daily physical activities, steps, and movement patterns to maintain an active lifestyle.',
        'Record key body metrics like weight, height, BMI, and body fat percentage to monitor health progress.',
        'Log your emotional states and mood changes to better understand your mental wellbeing over time.',
        'Keep track of heart-related data such as heart rate and blood pressure to monitor cardiovascular health.',
        // 'Manage your medications schedule, dosage, and reminders to ensure proper adherence.',
        'Track your meals, calories, and nutrient intake to support a balanced and healthy diet.',
        'Record sleep duration and quality to improve rest and overall wellness.',
        'Log workouts, exercise routines, and fitness goals to stay motivated and track performance improvements.'
    ];

    return (
        <Box sx={{ width: '100%' }}>
            <Grid
                container
                spacing={2}
                justifyContent={{ xs: 'center', sm: 'flex-start' }}
            >
                {item_list.map((item, index) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        key={index}
                        sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <Card sx={{ maxWidth: 345 }} >
                            <CardActionArea href={linklist[index]}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                                    {Icons[index]}
                                    <Typography gutterBottom variant="h6">
                                        {item_list[index]}
                                    </Typography>
                                </Box>
                                <CardContent>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {item_summaries[index]}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ position: 'fixed', right: 16, bottom: 16, zIndex: 1300 }}>
                <Ai />
            </Box>
        </Box>
    );
}

export default Home;
