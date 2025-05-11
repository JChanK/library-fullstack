import api from './api';

export const AuthorService = {
    getAllAuthors: () => api.get('/authors'),
    getAuthorById: (id) => api.get(`/authors/${id}`),

    createAuthor: (author, bookId = null) => {
        let url = '/authors';
        const params = new URLSearchParams();

        if (bookId) {
            params.append('bookId', bookId);
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        return api.post(url, author);
    },

    updateAuthor: (id, author) => api.put(`/authors/${id}`, author),
    deleteAuthor: (id) => api.delete(`/authors/${id}`),

    getAuthorBooks: (authorId) => api.get(`/authors/${authorId}/books`)
};