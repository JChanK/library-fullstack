import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button,
    TextField,
    InputAdornment,
    Box,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import BookList from '../components/books/BookList';
import BookForm from '../components/books/BookForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { BookService } from '../services/bookService';

const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = books.filter(book =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (book.authors && book.authors.some(author =>
                    (author.name + ' ' + (author.surname || '')).toLowerCase().includes(searchTerm.toLowerCase())
                ))
            );
            setFilteredBooks(filtered);
        } else {
            setFilteredBooks(books);
        }
    }, [searchTerm, books]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await BookService.getAllBooks();
            setBooks(response.data);
            setFilteredBooks(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch books:', err);
            setError('Не удалось загрузить список книг. Пожалуйста, попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBook = async (bookData) => {
        try {
            setLoading(true);
            const response = await BookService.createBook(bookData);
            setBooks(prevBooks => [...prevBooks, response.data]);
            setOpenForm(false);
            setError(null);
        } catch (err) {
            console.error('Failed to create book:', err);
            setError('Не удалось создать книгу: ' +
                (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBook = async (bookData) => {
        try {
            const bookId = selectedBook.id;
            const response = await BookService.updateBook(bookId, bookData);

            setBooks(prevBooks =>
                prevBooks.map(book => book.id === bookId ? response.data : book)
            );

            setSelectedBook(null);
            setOpenForm(false);
        } catch (err) {
            console.error('Failed to update book:', err);
        }
    };

    const handleDeleteBook = async (bookId) => {
        try {
            await BookService.deleteBook(bookId);
            setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
            setBookToDelete(null);
            setOpenDeleteDialog(false);
        } catch (err) {
            console.error('Failed to delete book:', err);
        }
    };

    const handleConfirmDelete = (bookId) => {
        setBookToDelete(bookId);
        setOpenDeleteDialog(true);
    };

    const handleEditBook = (book) => {
        setSelectedBook(book);
        setOpenForm(true);
    };

    const handleSubmitBook = (bookData) => {
        if (selectedBook) {
            handleUpdateBook(bookData);
        } else {
            handleCreateBook(bookData);
        }
    };

    const handleCloseForm = () => {
        setSelectedBook(null);
        setOpenForm(false);
    };

    return (
        <Box sx={{ backgroundColor: '#fafafa', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{ color: '#5d4037' }}>
                    Книги
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenForm(true)}
                    sx={{
                        backgroundColor: '#e91e63',
                        '&:hover': {
                            backgroundColor: '#ad1457'
                        }
                    }}
                >
                    Добавить книгу
                </Button>
            </Box>

            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Поиск по названию или автору..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#e91e63' }} />
                            </InputAdornment>
                        ),
                        sx: {
                            backgroundColor: 'white',
                            borderRadius: 1,
                            '&:focus-within': {
                                outline: 'none',
                            },
                        }
                    }}
                    sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#f8bbd0',
                            },
                            '&:hover fieldset': {
                                borderColor: '#e91e63',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#e91e63',
                                borderWidth: '1px',
                            },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#e91e63',
                        },
                    }}
                />
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress sx={{ color: '#e91e63' }} />
                </Box>
            ) : error ? (
                <Typography color="error" variant="h6" sx={{ textAlign: 'center', py: 4 }}>
                    {error}
                </Typography>
            ) : (
                <BookList
                    books={filteredBooks}
                    onEdit={handleEditBook}
                    onDelete={handleConfirmDelete}
                />
            )}

            <BookForm
                open={openForm}
                book={selectedBook}
                onClose={handleCloseForm}
                onSubmit={handleSubmitBook}
            />

            <ConfirmDialog
                open={openDeleteDialog}
                title="Удаление книги"
                content="Вы уверены, что хотите удалить эту книгу? Это действие нельзя отменить."
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={() => handleDeleteBook(bookToDelete)}
            />
        </Box>
    );
};

export default BooksPage;