import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Box,
    Paper,
    Grid,
    Button,
    CircularProgress,
    Divider,
    Card,
    CardContent,
    CardActions,
    Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Link } from 'react-router-dom';
import { AuthorService } from '../services/authorService';
import AuthorForm from '../components/authors/AuthorForm';
import ConfirmDialog from '../components/common/ConfirmDialog';

const AuthorDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openAuthorForm, setOpenAuthorForm] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [authorBooks, setAuthorBooks] = useState([]);

    useEffect(() => {
        if (author && author.id) {
            AuthorService.getAuthorBooks(author.id)
                .then(response => setAuthorBooks(response.data))
                .catch(console.error);
        }
    }, [author]);

    useEffect(() => {
        const fetchAuthorDetails = async () => {
            try {
                setLoading(true);
                const response = await AuthorService.getAuthorById(id);
                setAuthor(response.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch author details:', err);
                setError('Не удалось загрузить информацию об авторе.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchAuthorDetails();
    }, [id]);

    const handleUpdateAuthor = async (authorData) => {
        try {
            const response = await AuthorService.updateAuthor(id, authorData);
            setAuthor(response.data);
            setOpenAuthorForm(false);
        } catch (err) {
            console.error('Failed to update author:', err);
        }
    };

    const handleDeleteAuthor = async () => {
        try {
            await AuthorService.deleteAuthor(id);
            navigate('/authors');
        } catch (err) {
            console.error('Failed to delete author:', err);
        }
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '60vh',
                backgroundColor: '#fafafa'
            }}>
                <CircularProgress sx={{ color: '#e91e63' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                py: 3,
                backgroundColor: '#fafafa'
            }}>
                <Typography color="error" variant="h6" sx={{ textAlign: 'center' }}>
                    {error}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/authors')}
                        sx={{
                            color: '#e91e63',
                            borderColor: '#e91e63',
                            '&:hover': {
                                borderColor: '#ad1457'
                            }
                        }}
                    >
                        К списку авторов
                    </Button>
                </Box>
            </Box>
        );
    }

    if (!author) {
        return (
            <Box sx={{
                py: 3,
                backgroundColor: '#fafafa'
            }}>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                    Автор не найден
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/authors')}
                        sx={{
                            color: '#e91e63',
                            borderColor: '#e91e63',
                            '&:hover': {
                                borderColor: '#ad1457'
                            }
                        }}
                    >
                        К списку авторов
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#fafafa', p: 3 }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/authors')}
                    sx={{
                        color: '#e91e63',
                        borderColor: '#e91e63',
                        '&:hover': {
                            borderColor: '#ad1457'
                        }
                    }}
                >
                    К списку авторов
                </Button>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setOpenAuthorForm(true)}
                        sx={{
                            mr: 1,
                            color: '#e91e63',
                            borderColor: '#e91e63',
                            '&:hover': {
                                borderColor: '#ad1457'
                            }
                        }}
                    >
                        Редактировать
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => setOpenDeleteDialog(true)}
                        sx={{
                            color: '#e91e63',
                            borderColor: '#e91e63',
                            '&:hover': {
                                borderColor: '#ad1457'
                            }
                        }}
                    >
                        Удалить
                    </Button>
                </Box>
            </Box>

            <Paper elevation={2} sx={{
                p: 3,
                mb: 4,
                backgroundColor: 'white',
                borderRadius: 2
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
                                    color: '#5d4037',
                                    mb: 2,
                                    mx: 'auto'
                                }}
                            >
                                {author.name ? author.name.charAt(0) : 'A'}
                            </Avatar>
                            <Typography variant="h5" gutterBottom sx={{ color: '#5d4037' }}>
                                {`${author.name || ''} ${author.surname || ''}`.trim()}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Typography variant="h5" gutterBottom sx={{ color: '#5d4037' }}>
                            Информация об авторе
                        </Typography>
                        <Divider sx={{ mb: 2, borderColor: '#e0e0e0' }} />
                        <Typography variant="body1" paragraph>
                            <strong>Имя:</strong> {author.name || 'Не указано'}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Фамилия:</strong> {author.surname || 'Не указана'}
                        </Typography>
                        {author.biography && (
                            <Typography variant="body1" paragraph>
                                <strong>Биография:</strong> {author.biography}
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            {authorBooks.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" component="h2" sx={{
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        color: '#5d4037'
                    }}>
                        <MenuBookIcon sx={{ mr: 1, color: '#e91e63' }} /> Книги автора
                    </Typography>
                    <Grid container spacing={3}>
                        {authorBooks.map(book => (
                            <Grid item xs={12} sm={6} md={4} key={book.id}>
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backgroundColor: 'white',
                                    '&:hover': {
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                                    }
                                }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h6" component="div" sx={{ color: '#5d4037' }}>
                                            {book.title}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            component={Link}
                                            to={`/books/${book.id}`}
                                            sx={{ color: '#e91e63' }}
                                        >
                                            Подробнее
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            <AuthorForm
                open={openAuthorForm}
                author={author}
                onClose={() => setOpenAuthorForm(false)}
                onSubmit={handleUpdateAuthor}
            />

            <ConfirmDialog
                open={openDeleteDialog}
                title="Удаление автора"
                content="Вы уверены, что хотите удалить этого автора?"
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={handleDeleteAuthor}
            />
        </Box>
    );
};

export default AuthorDetailPage;