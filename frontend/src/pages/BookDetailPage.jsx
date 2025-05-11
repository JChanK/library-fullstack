import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Box,
    Paper,
    Grid,
    Chip,
    Divider,
    Button,
    CircularProgress,
    Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import { BookService } from '../services/bookService';
import { ReviewService } from '../services/reviewService';
import BookForm from '../components/books/BookForm';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';
import ConfirmDialog from '../components/common/ConfirmDialog';

const BookDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openBookForm, setOpenBookForm] = useState(false);
    const [openReviewForm, setOpenReviewForm] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    useEffect(() => {
        if (id) {
            fetchBookDetails();
        }
    }, [id]);

    const fetchBookDetails = async () => {
        try {
            setLoading(true);
            const bookResponse = await BookService.getBookById(id);
            setBook(bookResponse.data);

            try {
                const reviewsResponse = await ReviewService.getReviewsByBookId(id);
                setReviews(reviewsResponse.data || []);
            } catch (reviewErr) {
                console.warn('Не удалось загрузить отзывы:', reviewErr);
                setReviews([]);
            }

            setError(null);
        } catch (err) {
            console.error('Failed to fetch book details:', err);
            setError('Не удалось загрузить информацию о книге. Пожалуйста, попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBook = async (bookData) => {
        try {
            const response = await BookService.updateBook(id, bookData);
            setBook(response.data);
            setOpenBookForm(false);
        } catch (err) {
            console.error('Failed to update book:', err);
        }
    };

    const handleDeleteBook = async () => {
        try {
            await BookService.deleteBook(id);
            navigate('/books');
        } catch (err) {
            console.error('Failed to delete book:', err);
        }
    };

    const handleAddReview = async (reviewData) => {
        try {
            const response = await ReviewService.createReview(id, {
                message: reviewData.message
            });
            setReviews(prev => [...prev, response.data]);
            setOpenReviewForm(false);
        } catch (err) {
            console.error('Ошибка при добавлении отзыва:', err);
            setError('Не удалось добавить отзыв');
        }
    };

    const handleUpdateReview = async (reviewId, reviewData) => {
        try {
            const response = await ReviewService.updateReview(id, reviewId, {
                message: reviewData.message
            });
            setReviews(prev => prev.map(r =>
                r.id === reviewId ? { ...r, message: reviewData.message } : r
            ));
        } catch (err) {
            console.error('Ошибка при обновлении отзыва:', err);
            setError('Не удалось обновить отзыв: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await ReviewService.deleteReview(id, reviewId);
            setReviews(prev => prev.filter(r => r.id !== reviewId));
        } catch (err) {
            console.error('Ошибка при удалении отзыва:', err);
            setError('Не удалось удалить отзыв: ' + (err.response?.data?.message || err.message));
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
                        onClick={() => navigate('/books')}
                        sx={{
                            color: '#e91e63',
                            borderColor: '#e91e63',
                            '&:hover': {
                                borderColor: '#ad1457'
                            }
                        }}
                    >
                        К списку книг
                    </Button>
                </Box>
            </Box>
        );
    }

    if (!book) {
        return (
            <Box sx={{
                py: 3,
                backgroundColor: '#fafafa'
            }}>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                    Книга не найдена
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/books')}
                        sx={{
                            color: '#e91e63',
                            borderColor: '#e91e63',
                            '&:hover': {
                                borderColor: '#ad1457'
                            }
                        }}
                    >
                        К списку книг
                    </Button>
                </Box>
            </Box>
        );
    }

    const safeReviews = reviews || [];

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
                    onClick={() => navigate('/books')}
                    sx={{
                        color: '#e91e63',
                        borderColor: '#e91e63',
                        '&:hover': {
                            borderColor: '#ad1457'
                        }
                    }}
                >
                    К списку книг
                </Button>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setOpenBookForm(true)}
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
                    <Grid item xs={12} md={4}>
                        <Box
                            component="img"
                            src={book.imageUrl || `https://picsum.photos/seed/${book.title.replace(/\s+/g, '')}/400/600`}
                            alt={book.title}
                            sx={{
                                width: '100%',
                                height: 'auto',
                                objectFit: 'cover',
                                borderRadius: 1,
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#5d4037' }}>
                            {book.title}
                        </Typography>

                        {book.authors && book.authors.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 1,
                                    color: '#5d4037'
                                }}>
                                    <PersonIcon sx={{ mr: 1, color: '#e91e63' }} /> Авторы:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {book.authors.map((author, authorIndex) => (
                                        <Chip
                                            key={authorIndex}
                                            label={author.name + (author.surname ? ` ${author.surname}` : '')}
                                            onClick={() => navigate(`/authors/${author.id}`)}
                                            sx={{
                                                mr: 1,
                                                mb: 1,
                                                backgroundColor: '#fce4ec',
                                                color: '#5d4037',
                                                '&:hover': {
                                                    backgroundColor: '#f8bbd0'
                                                }
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        <Box sx={{ mb: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="body2" color="text.secondary">
                                    ({safeReviews.length} {safeReviews.length === 1 ? 'отзыв' :
                                    safeReviews.length >= 2 && safeReviews.length <= 4 ? 'отзыва' : 'отзывов'})
                                </Typography>
                            </Stack>
                        </Box>

                        <Divider sx={{ my: 2, borderColor: '#e0e0e0' }} />

                        {book.description && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body1" paragraph>
                                    {book.description}
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            <Box sx={{ mb: 4 }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <Typography variant="h5" component="h2" sx={{ color: '#5d4037' }}>
                        Отзывы
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => setOpenReviewForm(true)}
                        sx={{
                            backgroundColor: '#e91e63',
                            '&:hover': {
                                backgroundColor: '#ad1457'
                            }
                        }}
                    >
                        Добавить отзыв
                    </Button>
                </Box>

                <ReviewList
                    reviews={safeReviews}
                    onUpdate={handleUpdateReview}
                    onDelete={handleDeleteReview}
                />
            </Box>

            <BookForm
                open={openBookForm}
                book={book}
                onClose={() => setOpenBookForm(false)}
                onSubmit={handleUpdateBook}
            />

            <ReviewForm
                open={openReviewForm}
                bookId={id}
                onClose={() => setOpenReviewForm(false)}
                onSubmit={handleAddReview}
            />

            <ConfirmDialog
                open={openDeleteDialog}
                title="Удаление книги"
                content="Вы уверены, что хотите удалить эту книгу? Это действие нельзя отменить."
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={handleDeleteBook}
            />
        </Box>
    );
};

export default BookDetailPage;