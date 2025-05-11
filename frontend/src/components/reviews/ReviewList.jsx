import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReviewForm from './ReviewForm';
import ConfirmDialog from '../common/ConfirmDialog';

const ReviewList = ({ reviews, onUpdate, onDelete }) => {
    const [selectedReview, setSelectedReview] = useState(null);
    const [editFormOpen, setEditFormOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeReviewId, setActiveReviewId] = useState(null);

    const handleMenuOpen = (event, reviewId) => {
        setAnchorEl(event.currentTarget);
        setActiveReviewId(reviewId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setActiveReviewId(null);
    };

    const handleEditClick = (review) => {
        setSelectedReview(review);
        setEditFormOpen(true);
        handleMenuClose();
    };

    const handleDeleteClick = (review) => {
        setSelectedReview(review);
        setDeleteDialogOpen(true);
        handleMenuClose();
    };

    const handleUpdateReview = (reviewData) => {
        onUpdate(selectedReview.id, reviewData);
        setEditFormOpen(false);
        setSelectedReview(null);
    };

    const handleConfirmDelete = () => {
        onDelete(selectedReview.id);
        setDeleteDialogOpen(false);
        setSelectedReview(null);
    };

    if (!reviews || reviews.length === 0) {
        return (
            <Card sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    У этой книги пока нет отзывов. Будьте первым, кто оставит отзыв!
                </Typography>
            </Card>
        );
    }

    return (
        <Box>
            {reviews.map((review) => (
                <Card key={review.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="subtitle1" component="div">
                                        Анонимный пользователь
                                    </Typography>
                                </Box>
                            </Box>

                            <IconButton
                                aria-label="Действия"
                                onClick={(e) => handleMenuOpen(e, review.id)}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id={`review-menu-${review.id}`}
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl) && activeReviewId === review.id}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={() => handleEditClick(review)}>
                                    <ListItemIcon>
                                        <EditIcon fontSize="small" />
                                    </ListItemIcon>
                                    Редактировать
                                </MenuItem>
                                <MenuItem onClick={() => handleDeleteClick(review)}>
                                    <ListItemIcon>
                                        <DeleteIcon fontSize="small" color="error" />
                                    </ListItemIcon>
                                    <Typography color="error">Удалить</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body1" component="div">
                                {review.message}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            ))}

            <ReviewForm
                open={editFormOpen}
                review={selectedReview}
                bookId={selectedReview?.bookId}
                onClose={() => setEditFormOpen(false)}
                onSubmit={handleUpdateReview}
            />

            <ConfirmDialog
                open={deleteDialogOpen}
                title="Удаление отзыва"
                content="Вы уверены, что хотите удалить этот отзыв? Это действие нельзя отменить."
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </Box>
    );
};

export default ReviewList;