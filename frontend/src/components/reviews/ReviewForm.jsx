import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box
} from '@mui/material';

const ReviewForm = ({ open, review, bookId, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        message: '',
        bookId: bookId
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (review) {
            setFormData({
                message: review.message || '',
                bookId: review.bookId || bookId
            });
        } else {
            resetForm();
        }
    }, [review, bookId]);

    const resetForm = () => {
        setFormData({
            message: '',
            bookId: bookId
        });
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.message.trim()) {
            newErrors.message = 'Текст отзыва обязателен';
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
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {review ? 'Редактировать отзыв' : 'Добавить отзыв'}
            </DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        required
                        label="Текст отзыва"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        margin="normal"
                        multiline
                        rows={4}
                        error={!!errors.message}
                        helperText={errors.message}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {review ? 'Сохранить' : 'Отправить'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReviewForm;