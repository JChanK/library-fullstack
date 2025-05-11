import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button,
    TextField,
    InputAdornment,
    Box,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AuthorList from '../components/authors/AuthorList';
import AuthorForm from '../components/authors/AuthorForm';
import { AuthorService } from '../services/authorService';
import { BookService } from '../services/bookService';

const AuthorsPage = () => {
    const [authors, setAuthors] = useState([]);
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [books, setBooks] = useState([]);
    const [selectedBookId, setSelectedBookId] = useState('');
    const [openBookDialog, setOpenBookDialog] = useState(false);

    useEffect(() => {
        fetchAuthors();
        fetchBooks();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = authors.filter(author =>
                (author.name && author.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (author.surname && author.surname.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredAuthors(filtered);
        } else {
            setFilteredAuthors(authors);
        }
    }, [searchTerm, authors]);

    const fetchAuthors = async () => {
        try {
            setLoading(true);
            const response = await AuthorService.getAllAuthors();
            setAuthors(response.data);
            setFilteredAuthors(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch authors:', err);
            setError('Не удалось загрузить список авторов. Пожалуйста, попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    const fetchBooks = async () => {
        try {
            const response = await BookService.getAllBooks();
            setBooks(response.data);
        } catch (err) {
            console.error('Failed to fetch books:', err);
        }
    };

    const handleCreateAuthor = async (authorData) => {
        try {
            if (!selectedBookId) {
                setOpenBookDialog(true);
                return;
            }

            const response = await AuthorService.createAuthor(authorData, selectedBookId);
            setAuthors(prevAuthors => [...prevAuthors, response.data]);
            setOpenForm(false);
            setSelectedBookId('');
        } catch (err) {
            console.error('Failed to create author:', err);
        }
    };

    const handleUpdateAuthor = async (id, authorData) => {
        try {
            const response = await AuthorService.updateAuthor(id, authorData);
            setAuthors(prevAuthors =>
                prevAuthors.map(author => author.id === id ? response.data : author)
            );
            setSelectedAuthor(null);
            setOpenForm(false);
        } catch (err) {
            console.error('Failed to update author:', err);
        }
    };

    const handleDeleteAuthor = async (id) => {
        try {
            await AuthorService.deleteAuthor(id);
            setAuthors(prevAuthors => prevAuthors.filter(author => author.id !== id));
        } catch (err) {
            console.error('Failed to delete author:', err);
        }
    };

    const handleEditAuthor = (author) => {
        setSelectedAuthor(author);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setSelectedAuthor(null);
    };

    const handleBookSelect = () => {
        if (selectedBookId) {
            setOpenBookDialog(false);
            setOpenForm(true);
        }
    };

    return (
        <Box sx={{ backgroundColor: '#fafafa', p: 3 }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h4" component="h1" sx={{ color: '#5d4037' }}>
                    Авторы
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
                    Добавить автора
                </Button>
            </Box>

            <TextField
                fullWidth
                label="Поиск авторов"
                variant="outlined"
                margin="normal"
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

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress sx={{ color: '#e91e63' }} />
                </Box>
            ) : error ? (
                <Typography color="error" sx={{ textAlign: 'center', p: 3 }}>
                    {error}
                </Typography>
            ) : (
                <AuthorList
                    authors={filteredAuthors}
                    onEdit={handleEditAuthor}
                    onDelete={handleDeleteAuthor}
                />
            )}

            <AuthorForm
                open={openForm}
                author={selectedAuthor}
                onClose={handleCloseForm}
                onSubmit={selectedAuthor ?
                    (data) => handleUpdateAuthor(selectedAuthor.id, data) :
                    handleCreateAuthor
                }
            />

            <Dialog open={openBookDialog} onClose={() => setOpenBookDialog(false)}>
                <DialogTitle>Выберите книгу для автора</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="book-select-label">Книга</InputLabel>
                        <Select
                            labelId="book-select-label"
                            value={selectedBookId}
                            label="Книга"
                            onChange={(e) => setSelectedBookId(e.target.value)}
                        >
                            {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>
                                    {book.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenBookDialog(false)}
                        sx={{ color: '#5d4037' }}
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleBookSelect}
                        disabled={!selectedBookId}
                        sx={{ color: '#e91e63' }}
                    >
                        Выбрать
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AuthorsPage;