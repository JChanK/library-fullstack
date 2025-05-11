import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider, CircularProgress
} from '@mui/material';
import { AuthorService } from '../../services/authorService';

const AuthorForm = ({ open, author, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        surname: ''
    });
    const [authorBooks, setAuthorBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (author) {
            setFormData({
                name: author.name || '',
                surname: author.surname || ''
            });

            if (author.id) {
                fetchAuthorBooks(author.id);
            }
        } else {
            resetForm();
        }
    }, [author]);

    const fetchAuthorBooks = async (authorId) => {
        try {
            setLoading(true);
            const response = await AuthorService.getAuthorBooks(authorId);
            console.log('Fetched books:', response.data);
            setAuthorBooks(response.data || []);
        } catch (err) {
            console.error('Failed to fetch author books:', err);
            setAuthorBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            surname: ''
        });
        setErrors({});
        setAuthorBooks([]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Имя автора обязательно';
        } else if (!formData.name.match(/^[A-Z][a-zA-Z\s-]+$/)) {
            newErrors.name = 'Имя должно начинаться с заглавной буквы и содержать только буквы, пробелы или дефисы';
        }

        if (!formData.surname.trim()) {
            newErrors.surname = 'Фамилия автора обязательна';
        } else if (!formData.surname.match(/^[A-Z][a-zA-Z\s-]+$/)) {
            newErrors.surname = 'Фамилия должна начинаться с заглавной буквы и содержать только буквы, пробелы или дефисы';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{
            '& .MuiPaper-root': {
                backgroundColor: '#fafafa',
            }
        }}>
            <DialogTitle sx={{ color: '#5d4037' }}>
                {author ? 'Редактировать автора' : 'Добавить нового автора'}
            </DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        required
                        label="Имя автора"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        error={!!errors.name}
                        helperText={errors.name || "Должно начинаться с заглавной буквы"}
                        placeholder="Лев"
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
                        required
                        label="Фамилия автора"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        margin="normal"
                        error={!!errors.surname}
                        helperText={errors.surname || "Должно начинаться с заглавной буквы"}
                        placeholder="Толстой"
                        sx={{
                            '& .MuiInputLabel-root': { color: '#5d4037' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#f8bbd0' },
                                '&:hover fieldset': { borderColor: '#e91e63' },
                            }
                        }}
                    />

                    {author && author.id && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ color: '#5d4037' }}>
                                Книги автора:
                            </Typography>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <CircularProgress sx={{ color: '#e91e63' }} />
                                </Box>
                            ) : authorBooks.length > 0 ? (
                                <List sx={{ backgroundColor: 'white', borderRadius: 1 }}>
                                    {authorBooks.map((book, index) => (
                                        <React.Fragment key={book.id || index}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={book.title || 'Без названия'}
                                                    primaryTypographyProps={{ color: '#5d4037' }}
                                                />
                                            </ListItem>
                                            {index < authorBooks.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" sx={{ color: '#5d4037' }}>
                                    Нет связанных книг
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
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
                >
                    {author ? 'Сохранить' : 'Добавить'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AuthorForm;