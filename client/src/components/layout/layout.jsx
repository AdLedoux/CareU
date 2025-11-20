import React, { useEffect, useState } from 'react';
import "./styles.css"
import { Outlet } from "react-router-dom";
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ArticleIcon from '@mui/icons-material/Article';
import Sidebar from '../sidebar/sidebar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';

const drawerWidth = 400;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    height: 90,
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const handleClickLogout = async (e) => {
    e.preventDefault();
    console.log("logout clicked");

    const refresh = localStorage.getItem('refresh_token');
    const access = localStorage.getItem('access_token');

    if (refresh) {
        try {
            await fetch('/api/token/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access}`,
                },
                body: JSON.stringify({ refresh }),
            });
        } catch (err) {
            console.error('logout request failed', err);
        }
    }

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
};

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        variants: [
            {
                props: ({ open }) => open,
                style: {
                    ...openedMixin(theme),
                    '& .MuiDrawer-paper': openedMixin(theme),
                },
            },
            {
                props: ({ open }) => !open,
                style: {
                    ...closedMixin(theme),
                    '& .MuiDrawer-paper': closedMixin(theme),
                },
            },
        ],
    }),
);

const Layout = () => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const user = useSelector((state) => state.user);

    const [lastSynced, setLastSynced] = useState("");

    useEffect(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        setLastSynced(`${timeString} Today`);
    }, []);
    
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                open={open}
                sx={{
                    background:"honeydew",
                    color: "black",
                    boxShadow: "none"
                }}
            >
                <Toolbar sx={{ height: { xs: 200, sm: 90 }, px: 4, display: { xs: 'none', sm: 'inline-flex' } }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 5, display: { xs: 'none', sm: 'inline-flex' }, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                        <Avatar
                            alt="user avatar"
                            src={require('../../assets/images/user-avator.png')}
                            sx={{ width: 60, height: 60, objectFit: 'cover' }}
                        />
                        <Typography variant="h5" noWrap component="div" sx={{ fontWeight: '600' }}>
                            {user.username}
                            <Typography variant="body1" sx={{ fontWeight: '200' }}>
                                Last synced: {lastSynced}
                            </Typography>
                            <Button variant="text" onClick={handleClickLogout}>Logout</Button>
                        </Typography>

                    </Box>

                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    display: { xs: 'none', sm: 'block' },
                }}
            >
                <DrawerHeader>
                    <Typography variant="h4" noWrap sx={{ fontWeight: '600', textAlign: 'center', flexGrow: 1 }}>
                        CareU
                    </Typography>
                    <IconButton onClick={handleDrawerClose}>
                        <ArticleIcon />
                    </IconButton>
                </DrawerHeader>
                <Sidebar open={open} />
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { xs: '100%', sm: `calc(100% - ${open ? drawerWidth : closedMixin(theme).width}px)` },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: { xs: 'center', sm: 'flex-start' }
                }}
            >
                <DrawerHeader sx={{ display: { xs: 'none', sm: 'block' } }} />
                <Box sx={{ display: { xs: 'flex', sm: 'none' }, height: 200, alignItems: 'center', gap: 2, flexGrow: 1 }}>
                    <Avatar
                        alt="user avatar"
                        src={require('../../assets/images/user-avator.png')}
                        sx={{ width: 100, height: 100, objectFit: 'cover' }}
                    />
                    <Typography variant="h5" noWrap component="div" sx={{ fontWeight: '600' }}>
                        {user.username}
                        <Typography variant="body1" sx={{ fontWeight: '200' }}>
                            Last synced: {lastSynced}
                        </Typography>
                        <Button variant="text" onClick={handleClickLogout}>Logout</Button>
                    </Typography>
                </Box>

                <Outlet />
            </Box>
        </Box>
    )
}

export default Layout;
