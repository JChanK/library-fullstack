import React from 'react';
import {
    Typography,
    Box,
    Paper,
    Grid,
    Divider,
    Avatar,
    Chip
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const AuthorDetail = ({ author }) => {
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
        <Paper elevation={2} sx={{
            p: 3,
            mb: 4,
            backgroundColor: '#fafafa'
        }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Avatar
                            sx={{
                                width: 150,
                                height: 150,
                                fontSize: '3rem',
                                bgcolor: '#f8bbd0',
                                color: '#ad1457',
                                mb: 2,
                                mx: 'auto'
                            }}
                        >
                            {getAuthorInitials(author.name, author.surname)}
                        </Avatar>

                        <Typography variant="h5" gutterBottom sx={{ color: '#5d4037' }}>
                            {getFullName(author.name, author.surname)}
                        </Typography>

                        <Chip
                            icon={<MenuBookIcon sx={{ color: '#e91e63' }} />}
                            variant="outlined"
                            sx={{
                                mt: 1,
                                borderColor: '#f8bbd0',
                                color: '#5d4037'
                            }}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} md={9}>
                    <Typography variant="h5" gutterBottom sx={{ color: '#5d4037' }}>
                        Информация об авторе
                    </Typography>

                    <Divider sx={{ mb: 2, borderColor: '#f8bbd0' }} />

                    <Typography variant="body1" paragraph sx={{ color: '#5d4037' }}>
                        <strong>Имя:</strong> {author.name || 'Не указано'}
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ color: '#5d4037' }}>
                        <strong>Фамилия:</strong> {author.surname || 'Не указана'}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default AuthorDetail;