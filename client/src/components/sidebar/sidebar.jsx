import React from 'react';
import "./styles.css"
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';

import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MedicationIcon from '@mui/icons-material/Medication';
import AppleIcon from '@mui/icons-material/Apple';
import HomeIcon from '@mui/icons-material/Home';
import BedIcon from '@mui/icons-material/Bed';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Divider from '@mui/material/Divider';

const Sidebar = (props) => {
    const { open } = props;

    const Icons = [
        <HomeIcon />,
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

    const item_list = ['Home', 'Activity', 'Body Measurements', 'Cycle Tracking', 'Heart', 'Medications', 'Nutrition', 'Sleep', 'Symptoms', 'Fitness']
    const linklist = ['/', '/activity', '/body-measurements', '/cycle-tracking', '/heart', '/medications', '/nutrition', '/sleep', '/symptoms', '/fitness']

    return (
        <>
            <Divider />
            <List>
                {item_list.map((text, index) => (
                    <ListItem key={text} disablePadding sx={{ display: 'block' }} >
                        <ListItemButton
                            sx={[
                                {
                                    minHeight: 48,
                                    px: 2.5,
                                },
                                open
                                    ? {
                                        justifyContent: 'initial',
                                    }
                                    : {
                                        justifyContent: 'center',
                                    },
                            ]}
                            href={linklist[index]}
                        >
                            <ListItemIcon
                                sx={[
                                    {
                                        minWidth: 0,
                                        justifyContent: 'center',
                                    },
                                    open
                                        ? {
                                            mr: 3,
                                        }
                                        : {
                                            mr: 'auto',
                                        },
                                ]}
                            >
                                {Icons[index]}
                            </ListItemIcon>
                            <ListItemText
                                primary={text}
                                sx={[
                                    open
                                        ? {
                                            opacity: 1,
                                        }
                                        : {
                                            opacity: 0,
                                        },
                                ]}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </>
    );
}

export default Sidebar;
