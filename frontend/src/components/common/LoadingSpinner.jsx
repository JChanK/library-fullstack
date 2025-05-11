import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Загрузка...' }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                minHeight: '200px',
                p: 3
            }}
        >
            <CircularProgress size={40} />
            <Typography variant="body1" sx={{ mt: 2 }}>
                {message}
            </Typography>
        </Box>
    );
};

export default LoadingSpinner;