import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GitHubIcon from '@mui/icons-material/GitHub';

const Header = () => {
    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: '#f8bbd0',
                color: '#5d4037',
                boxShadow: 'none'
            }}
        >
            <Toolbar>
                <MenuBookIcon sx={{ mr: 2, color: '#e91e63' }} />
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        textDecoration: 'none',
                        color: '#5d4037',
                        flexGrow: 1,
                        fontWeight: 600,
                        '&:hover': {
                            color: '#e91e63'
                        }
                    }}
                >
                    Библиотека
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        component={Link}
                        to="/books"
                        sx={{
                            color: '#5d4037',
                            '&:hover': {
                                color: '#e91e63',
                                backgroundColor: 'rgba(233, 30, 99, 0.1)'
                            }
                        }}
                    >
                        Книги
                    </Button>
                    <Button
                        component={Link}
                        to="/authors"
                        sx={{
                            color: '#5d4037',
                            '&:hover': {
                                color: '#e91e63',
                                backgroundColor: 'rgba(233, 30, 99, 0.1)'
                            }
                        }}
                    >
                        Авторы
                    </Button>
                    <IconButton
                        sx={{
                            color: '#5d4037',
                            '&:hover': {
                                color: '#e91e63'
                            }
                        }}
                        component="a"
                        href="https://github.com/JChanK/library"
                        target="_blank"
                    >
                        <GitHubIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;