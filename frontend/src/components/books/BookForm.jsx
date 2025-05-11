import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    Typography,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Chip,
    OutlinedInput,
    Checkbox,
    ListItemText,
    CircularProgress,
    Alert
} from '@mui/material';
import { AuthorService } from '../../services/authorService';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const BookForm = ({ open, book, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        authors: []
    });
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newAuthor, setNewAuthor] = useState({
        name: '',
        surname: ''
    });
    const [showAuthorForm, setShowAuthorForm] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            fetchAuthors();
            setError(null);
        }
    }, [open]);

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title || '',
                authors: book.authors || []
            });
        } else {
            resetForm();
        }
    }, [book]);

    const fetchAuthors = async () => {
        try {
            setLoading(true);
            const response = await AuthorService.getAllAuthors();
            setAuthors(response.data);
        } catch (err) {
            console.error('Failed to fetch authors:', err);
            setError('Не удалось загрузить список авторов');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            authors: []
        });
        setNewAuthor({
            name: '',
            surname: ''
        });
        setErrors({});
        setShowAuthorForm(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleAuthorChange = (event) => {
        const { value } = event.target;
        // Преобразуем выбранные ID в объекты авторов
        const selectedAuthors = value.map(idOrObj => {
            if (typeof idOrObj === 'object') return idOrObj;
            const existingAuthor = authors.find(a => a.id === idOrObj);
            return existingAuthor || { id: idOrObj };
        });
        setFormData(prev => ({ ...prev, authors: selectedAuthors }));
    };

    const handleNewAuthorChange = (e) => {
        const { name, value } = e.target;
        setNewAuthor(prev => ({ ...prev, [name]: value }));
        if (errors[`author${name.charAt(0).toUpperCase() + name.slice(1)}`]) {
            setErrors(prev => ({
                ...prev,
                [`author${name.charAt(0).toUpperCase() + name.slice(1)}`]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Название книги обязательно';
        }
        if (formData.authors.length === 0) {
            newErrors.authors = 'Необходимо выбрать хотя бы одного автора';
        }

        if (showAuthorForm) {
            if (!newAuthor.name.trim()) {
                newErrors.authorName = 'Имя автора обязательно';
            }
            if (!newAuthor.surname.trim()) {
                newErrors.authorSurname = 'Фамилия автора обязательна';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        const bookData = {
            title: formData.title,
            authors: formData.authors.map(author => {
                if (author.id) {
                    return {
                        id: author.id,
                        name: author.name,
                        surname: author.surname
                    };
                }
                if (showAuthorForm && newAuthor.name && newAuthor.surname) {
                    return {
                        name: newAuthor.name.trim(),
                        surname: newAuthor.surname.trim()
                    };
                }
                return author;
            })
        };

        if (showAuthorForm && newAuthor.name && newAuthor.surname) {
            bookData.authors.push({
                name: newAuthor.name.trim(),
                surname: newAuthor.surname.trim()
            });
        }

        console.log('Submitting book data:', bookData);
        onSubmit(bookData);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth sx={{
            '& .MuiPaper-root': {
                backgroundColor: '#fafafa',
            }
        }}>
            <DialogTitle sx={{ color: '#5d4037' }}>
                {book ? 'Редактировать книгу' : 'Добавить новую книгу'}
            </DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ mt: 2 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        required
                        label="Название книги"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        margin="normal"
                        error={!!errors.title}
                        helperText={errors.title}
                        sx={{
                            '& .MuiInputLabel-root': { color: '#5d4037' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#f8bbd0' },
                                '&:hover fieldset': { borderColor: '#e91e63' },
                            }
                        }}
                    />

                    <FormControl fullWidth margin="normal" error={!!errors.authors}>
                        <InputLabel id="authors-label" sx={{ color: '#5d4037' }}>Авторы *</InputLabel>
                        <Select
                            labelId="authors-label"
                            id="authors"
                            multiple
                            value={formData.authors}
                            onChange={handleAuthorChange}
                            input={<OutlinedInput label="Авторы *" sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#f8bbd0',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#e91e63',
                                },
                            }} />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((author) => (
                                        <Chip
                                            key={author.id || `new-${author.name}-${author.surname}`}
                                            label={`${author.name} ${author.surname || ''}`}
                                            sx={{
                                                backgroundColor: '#f8bbd0',
                                                color: '#5d4037',
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                            disabled={loading}
                        >
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                    <CircularProgress size={24} sx={{ color: '#e91e63' }} />
                                </Box>
                            ) : (
                                authors.map((author) => (
                                    <MenuItem key={author.id} value={author}>
                                        <Checkbox checked={formData.authors.some(a => a.id === author.id)}
                                                  sx={{ color: '#e91e63', '&.Mui-checked': { color: '#ad1457' } }} />
                                        <ListItemText primary={`${author.name} ${author.surname || ''}`}
                                                      sx={{ color: '#5d4037' }} />
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                        {errors.authors && (
                            <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                                {errors.authors}
                            </Typography>
                        )}
                    </FormControl>

                    {showAuthorForm ? (
                        <Box sx={{
                            mt: 2,
                            p: 2,
                            border: '1px solid #f8bbd0',
                            borderRadius: 1,
                            backgroundColor: 'white'
                        }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ color: '#5d4037' }}>
                                Новый автор
                            </Typography>
                            <TextField
                                fullWidth
                                label="Имя *"
                                name="name"
                                value={newAuthor.name}
                                onChange={handleNewAuthorChange}
                                margin="normal"
                                placeholder="Лев"
                                error={!!errors.authorName}
                                helperText={errors.authorName || "Должно начинаться с заглавной буквы"}
                                sx={{
                                    '& .MuiInputLabel-root': { color: '#5d4037' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#f8bbd0' },
                                        '&:hover fieldset': { borderColor: '#e91e63' },
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Фамилия *"
                                name="surname"
                                value={newAuthor.surname}
                                onChange={handleNewAuthorChange}
                                margin="normal"
                                placeholder="Толстой"
                                error={!!errors.authorSurname}
                                helperText={errors.authorSurname || "Должно начинаться с заглавной буквы"}
                                sx={{
                                    '& .MuiInputLabel-root': { color: '#5d4037' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#f8bbd0' },
                                        '&:hover fieldset': { borderColor: '#e91e63' },
                                    }
                                }}
                            />
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    onClick={() => setShowAuthorForm(false)}
                                    sx={{ color: '#5d4037' }}
                                >
                                    Отмена
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Button
                            onClick={() => setShowAuthorForm(true)}
                            variant="outlined"
                            sx={{
                                mt: 2,
                                color: '#e91e63',
                                borderColor: '#e91e63',
                                '&:hover': {
                                    borderColor: '#ad1457',
                                    backgroundColor: 'rgba(233, 30, 99, 0.04)'
                                }
                            }}
                            disabled={loading}
                        >
                            Добавить нового автора
                        </Button>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    sx={{ color: '#5d4037' }}
                >
                    Отмена
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        backgroundColor: '#e91e63',
                        '&:hover': {
                            backgroundColor: '#ad1457',
                        }
                    }}
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                        book ? 'Сохранить' : 'Добавить'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookForm;