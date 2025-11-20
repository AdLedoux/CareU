import React from 'react';
import "./styles.css"
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MedicationIcon from '@mui/icons-material/Medication';
import AppleIcon from '@mui/icons-material/Apple';
import BedIcon from '@mui/icons-material/Bed';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

const Home = () => {
    const Icons = [
        <LocalFireDepartmentIcon />,
        <AccessibilityIcon />,
        <DirectionsBikeIcon />,
        <FavoriteIcon />,
        <MedicationIcon />,
        <AppleIcon />,
        <BedIcon />,
        <ChecklistRtlIcon />,
        <FitnessCenterIcon />
    ];

    const item_list = ['Activity', 'Body Measurements', 'Cycle Tracking', 'Heart', 'Medications', 'Nutrition', 'Sleep', 'Symptoms', 'Fitness']
    const linklist = ['/activity', '/body-measurements', 'cycle-tracking', 'heart', 'medications', 'nutrition', 'sleep', 'symptoms', 'fitness']

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
                                        Health activity summary
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Home;
