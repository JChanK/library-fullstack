import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Button,
    Stack,
    Paper,
    Divider
} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { BookService } from '../services/bookService';
import { AuthorService } from '../services/authorService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = () => {
    const [recentBooks, setRecentBooks] = useState([]);
    const [topAuthors, setTopAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const booksResponse = await BookService.getAllBooks();
                const sortedBooks = booksResponse.data
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3);

                setRecentBooks(sortedBooks);

                const authorsResponse = await AuthorService.getAllAuthors();
                const sortedAuthors = authorsResponse.data
                    .sort((a, b) => (b.books?.length || 0) - (a.books?.length || 0))
                    .slice(0, 3);

                setTopAuthors(sortedAuthors);

            } catch (err) {
                console.error('Ошибка при загрузке данных для главной страницы:', err);
                setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <LoadingSpinner message="Загрузка данных..." />;
    }

    return (
        <Box sx={{ backgroundColor: '#fafafa', minHeight: '100vh', p: 3 }}>
            {/* Баннер / Приветствие */}
            <Paper sx={{
                p: 4,
                mb: 4,
                textAlign: 'center',
                background: 'linear-gradient(to right, #f8bbd0, #fce4ec)',
                color: '#5d4037',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 500 }}>
                    Добро пожаловать в библиотеку
                </Typography>
                <Typography variant="h6" sx={{ mb: 3, color: '#795548' }}>
                    Удобный инструмент для управления книгами, авторами и отзывами
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Box sx={{ width: '220px' }}> {/* Adjust the width as needed */}
                        <Button
                            variant="contained"
                            sx={{
                                width: '100%',
                                backgroundColor: '#e91e63',
                                '&:hover': {
                                    backgroundColor: '#ad1457'
                                }
                            }}
                            component={Link}
                            to="/books"
                            size="large"
                        >
                            Просмотр книг
                        </Button>
                    </Box>
                    <Box sx={{ width: '220px' }}> {/* Same width as above */}
                        <Button
                            variant="outlined"
                            sx={{
                                width: '100%', 
                                color: '#e91e63',
                                borderColor: '#e91e63',
                                '&:hover': {
                                    borderColor: '#ad1457'
                                }
                            }}
                            component={Link}
                            to="/authors"
                            size="large"
                        >
                            Просмотр авторов
                        </Button>
                    </Box>
                </Stack>
            </Paper>

            {/* Последние добавленные книги */}
            <Box sx={{ mb: 5 }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <Typography variant="h5" component="h2" sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#5d4037'
                    }}>
                        <WhatshotIcon sx={{ mr: 1, color: '#e91e63' }} />
                        Последние добавленные книги
                    </Typography>
                    <Button
                        component={Link}
                        to="/books"
                        sx={{ color: '#e91e63' }}
                    >
                        Все книги
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {recentBooks.length > 0 ? (
                        recentBooks.map(book => (
                            <Grid item xs={12} sm={4} key={book.id}>
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s',
                                    backgroundColor: '#fff',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                    }
                                }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="div" gutterBottom sx={{ color: '#5d4037' }}>
                                            {book.title}
                                        </Typography>
                                        {book.authors && book.authors.length > 0 && (
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Авторы: {book.authors.map(author => author.name).join(', ')}
                                            </Typography>
                                        )}
                                        {book.description && (
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                {book.description.length > 100
                                                    ? `${book.description.substring(0, 100)}...`
                                                    : book.description}
                                            </Typography>
                                        )}
                                    </CardContent>
                                    <Box sx={{ p: 2, pt: 0 }}>
                                        <Button
                                            component={Link}
                                            to={`/books/${book.id}`}
                                            size="small"
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                color: '#e91e63',
                                                borderColor: '#e91e63',
                                                '&:hover': {
                                                    borderColor: '#ad1457'
                                                }
                                            }}
                                        >
                                            Подробнее
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography sx={{ textAlign: 'center', color: '#5d4037' }}>
                                Пока нет добавленных книг
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>

            <Divider sx={{ mb: 5, borderColor: '#e0e0e0' }} />

            {/* Популярные авторы */}
            <Box sx={{ mb: 5 }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <Typography variant="h5" component="h2" sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#5d4037'
                    }}>
                        <StarIcon sx={{ mr: 1, color: '#ff9800' }} />
                        Популярные авторы
                    </Typography>
                    <Button
                        component={Link}
                        to="/authors"
                        sx={{ color: '#e91e63' }}
                    >
                        Все авторы
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {topAuthors.length > 0 ? (
                        topAuthors.map(author => (
                            <Grid item xs={12} sm={4} key={author.id}>
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s',
                                    backgroundColor: '#fff',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                    }
                                }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="div" gutterBottom sx={{ color: '#5d4037' }}>
                                            {author.name}
                                        </Typography>
                                        {author.biography && (
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                {author.biography.length > 100
                                                    ? `${author.biography.substring(0, 100)}...`
                                                    : author.biography}
                                            </Typography>
                                        )}
                                    </CardContent>
                                    <Box sx={{ p: 2, pt: 0 }}>
                                        <Button
                                            component={Link}
                                            to={`/authors/${author.id}`}
                                            size="small"
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                color: '#e91e63',
                                                borderColor: '#e91e63',
                                                '&:hover': {
                                                    borderColor: '#ad1457'
                                                }
                                            }}
                                        >
                                            Подробнее
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography sx={{ textAlign: 'center', color: '#5d4037' }}>
                                Пока нет добавленных авторов
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>

            {/* Информационные карточки */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Card sx={{
                        height: '100%',
                        width: '1040px',
                        backgroundColor: '#fce4ec',
                        color: '#5d4037',
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <MenuBookIcon sx={{ fontSize: 40, mr: 2, color: '#e91e63' }} />
                                <Typography variant="h5" component="div">
                                    Управление книгами
                                </Typography>
                            </Box>
                            <Typography variant="body1">
                                Добавляйте новые книги, редактируйте существующие, добавляйте изображения и категории.
                                Ведите полный учет вашей библиотеки.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{
                        height: '120px',
                        width: '1040px',
                        backgroundColor: '#f3e5f5',
                        color: '#5d4037',
                        transition: 'transform 0.2s',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PersonIcon sx={{ fontSize: 40, mr: 2, color: '#9c27b0' }} />
                                <Typography variant="h5" component="div">
                                    Управление авторами
                                </Typography>
                            </Box>
                            <Typography variant="body1">
                                Храните информацию об авторах, их биографии и списки их произведений.
                                Легко находите все книги конкретного автора.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default HomePage;