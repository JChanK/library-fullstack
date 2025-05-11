import api from './api';

export const ReviewService = {
    getReviewsByBookId: (bookId) => api.get(`/books/${bookId}/reviews`),
    createReview: (bookId, review) => api.post(`/books/${bookId}/reviews`, {
        message: review.message,
    }),
    updateReview: (bookId, id, review) => api.put(`/books/${bookId}/reviews/${id}`, {
        message: review.message,
    }),
    deleteReview: (bookId, id) => api.delete(`/books/${bookId}/reviews/${id}`),
};