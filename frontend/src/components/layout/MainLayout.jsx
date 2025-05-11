import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';
import Header from './Header';

const MainLayout = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#fafafa'
        }}>
            <Header />
            <Container component="main" sx={{
                flexGrow: 1,
                py: 4,
                backgroundColor: '#fafafa'
            }}>
                <Outlet />
            </Container>
            <Box
                component="footer"
                sx={{
                    py: 3,
                    textAlign: 'center',
                    backgroundColor: '#f8bbd0',
                    color: '#5d4037'
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="body2">
                        © {new Date().getFullYear()} Библиотека
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default MainLayout;