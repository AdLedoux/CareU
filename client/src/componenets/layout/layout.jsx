import React from 'react';
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
    const [open, setOpen] = React.useState(false);

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
                    background: '#ffd6e8 0%',
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
                    <Typography variant="h5" noWrap component="div" sx={{ fontWeight: '600' }}>
                        **User name and user image here**
                    </Typography>
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
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>User banner</Box>

                {/* main content will be render here*/}
                <Outlet />

            </Box>
        </Box>)
}

export default Layout;
