import React from 'react';
import "./styles.css"
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import HearingIcon from '@mui/icons-material/Hearing';
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
        <HearingIcon />,
        <FavoriteIcon />,
        <MedicationIcon />,
        <AppleIcon />,
        <BedIcon />,
        <ChecklistRtlIcon />,
        <FitnessCenterIcon />
    ];

    const item_list = ['Activity', 'Body Measurements', 'Cycle Tracking', 'Hearing', 'Heart', 'Medications', 'Nutrition', 'Sleep', 'Symptoms', 'Fitness']


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
                        <Card sx={{ maxWidth: 345 }}>
                            <CardActionArea>
                                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                                    {Icons[index]}
                                    <Typography gutterBottom variant="h6">
                                        {item_list[index]}
                                    </Typography>
                                </Box>
                                <CardContent>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Lizards are a widespread group of squamate reptiles, with over 6,000
                                        species, ranging across all continents except Antarctica
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
