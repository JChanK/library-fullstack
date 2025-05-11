import api from './api';

export const BookService = {
    getAllBooks: () => api.get('/books'),
    getBookById: (id) => api.get(`/books/${id}`),

    createBook: (book) => {
        const formattedBook = {
            title: book.title,
            authors: book.authors.map(author => ({
                id: author.id || undefined,
                name: author.name || '',
                surname: author.surname || ''
            })),
            reviews: book.reviews?.map(review => ({
                message: review.message || ''
            })) || []
        };

        console.log('Sending formatted book data:', formattedBook);

        return api.post('/books', formattedBook, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    updateBook: (id, book) => {
        const formattedBook = {
            title: book.title,
            authors: book.authors.map(author => {
                if (typeof author === 'object') {
                    return {
                        id: author.id,
                        name: author.name,
                        surname: author.surname
                    };
                } else {
                    return { id: author };
                }
            })
        };
        return api.put(`/books/${id}`, formattedBook);
    },

    deleteBook: (id) => api.delete(`/books/${id}`),
    getBooksByAuthor: (name, surname) => api.get(`/books/search/by-author?name=${name}&surname=${surname}`),
    getBookByTitle: (title) => api.get(`/books/search/by-title?title=${title}`),
    getBooksByReviewContent: (message) => api.get(`/books/contain?message=${message}`),
    createBulkBooks: (books) => api.post('/books/bulk', books)
};