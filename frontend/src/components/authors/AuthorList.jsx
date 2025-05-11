import React from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Avatar,
    Box,
    Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const AuthorList = ({ authors, onEdit, onDelete }) => {
    if (!authors || authors.length === 0) {
        return (
            <Typography variant="subtitle1" align="center" sx={{ py: 4 }}>
                Авторы не найдены
            </Typography>
        );
    }

    const getAuthorInitials = (name, surname) => {
        if (!name && !surname) return 'A';
        const firstInitial = name ? name.charAt(0).toUpperCase() : '';
        const secondInitial = surname ? surname.charAt(0).toUpperCase() : '';
        return (firstInitial + secondInitial);
    };

    const getFullName = (name, surname) => {
        return `${name || ''} ${surname || ''}`.trim();
    };

    return (
        <Grid container spacing={3}>
            {authors.map((author) => (
                <Grid item xs={12} sm={6} md={4} key={author.id}>
                    <Card sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#fafafa',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                        }
                    }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        fontSize: '1.75rem',
                                        bgcolor: '#f8bbd0',
                                        color: '#ad1457',
                                        mb: 1
                                    }}
                                >
                                    {getAuthorInitials(author.name, author.surname)}
                                </Avatar>
                                <Typography variant="h6" component="div" align="center" sx={{ color: '#5d4037' }}>
                                    {getFullName(author.name, author.surname)}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                                <Chip
                                    icon={<MenuBookIcon sx={{ color: '#e91e63' }} />}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        width: '40px',
                                        borderColor: '#f8bbd0',
                                        color: '#5d4037',
                                        '& .MuiChip-icon': {
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: 0,
                                            height: '100%',
                                        },
                                        '& .MuiChip-label': {
                                            padding: '0',
                                            display: 'none',
                                        }
                                    }}
                                />
                            </Box>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                            <Button
                                component={Link}
                                to={`/authors/${author.id}`}
                                variant="outlined"
                                size="small"
                                sx={{
                                    color: '#e91e63',
                                    borderColor: '#e91e63',
                                    '&:hover': {
                                        borderColor: '#ad1457',
                                        backgroundColor: 'rgba(233, 30, 99, 0.04)'
                                    }
                                }}
                            >
                                Подробнее
                            </Button>
                            <Box>
                                <Button
                                    size="small"
                                    onClick={() => onEdit(author)}
                                    startIcon={<EditIcon />}
                                    sx={{
                                        mr: 1,
                                        color: '#5d4037',
                                        '&:hover': {
                                            color: '#e91e63'
                                        }
                                    }}
                                >
                                    Изменить
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => onDelete(author.id)}
                                    startIcon={<DeleteIcon />}
                                    sx={{
                                        color: '#5d4037',
                                        '&:hover': {
                                            color: '#e91e63'
                                        }
                                    }}
                                >
                                    Удалить
                                </Button>
                            </Box>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default AuthorList;