import React from 'react';
import {
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardActions,
    Button,
    Chip,
    Stack,
    Tooltip
} from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RateReviewIcon from '@mui/icons-material/RateReview';

const BookList = ({ books, onEdit, onDelete }) => {
    if (!books || books.length === 0) {
        return (
            <Typography variant="body1" sx={{ textAlign: 'center', p: 3 }}>
                Книги не найдены. Попробуйте изменить параметры поиска или добавьте новую книгу.
            </Typography>
        );
    }

    return (
        <Grid container spacing={3}>
            {books.map((book) => (
                <Grid item xs={12} sm={6} md={4} key={book.id}>
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
                        <CardMedia
                            component="img"
                            height="200"
                            image={book.imageUrl || `https://picsum.photos/seed/${book.id}/300/200`}
                            alt={book.title}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography gutterBottom variant="h6" component="div" noWrap sx={{ color: '#5d4037' }}>
                                {book.title}
                            </Typography>

                            {book.authors && book.authors.length > 0 && (
                                <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
                                    {book.authors.slice(0, 2).map((author) => (
                                        <Chip
                                            key={author.id}
                                            label={`${author.name} ${author.surname || ''}`}
                                            size="small"
                                            component={Link}
                                            to={`/authors/${author.id}`}
                                            clickable
                                            sx={{
                                                backgroundColor: '#f8bbd0',
                                                color: '#5d4037',
                                                '&:hover': {
                                                    backgroundColor: '#e91e63',
                                                    color: 'white'
                                                }
                                            }}
                                        />
                                    ))}
                                    {book.authors.length > 2 && (
                                        <Typography variant="body2" sx={{ color: '#5d4037' }}>...</Typography>
                                    )}
                                </Stack>
                            )}

                            <Stack direction="row" spacing={1} alignItems="center">
                                <Tooltip title="Количество отзывов">
                                    <Chip
                                        icon={<RateReviewIcon fontSize="small" sx={{ color: '#e91e63' }} />}
                                        label={book.reviews?.length || 0}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            borderColor: '#f8bbd0',
                                            color: '#5d4037'
                                        }}
                                    />
                                </Tooltip>
                            </Stack>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                startIcon={<VisibilityIcon />}
                                component={Link}
                                to={`/books/${book.id}`}
                                sx={{
                                    color: '#5d4037',
                                    '&:hover': {
                                        color: '#e91e63'
                                    }
                                }}
                            >
                                Просмотр
                            </Button>
                            <Button
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={() => onEdit(book)}
                                sx={{
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
                                startIcon={<DeleteIcon />}
                                onClick={() => onDelete(book.id)}
                                sx={{
                                    color: '#5d4037',
                                    '&:hover': {
                                        color: '#e91e63'
                                    }
                                }}
                            >
                                Удалить
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default BookList;