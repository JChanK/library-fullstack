import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from '@mui/material';

const ConfirmDialog = ({ open, title, content, onClose, onConfirm }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#fafafa'
                }
            }}
        >
            <DialogTitle sx={{
                color: '#5d4037',
                backgroundColor: '#f5f5f5',
                borderBottom: '1px solid #e0e0e0'
            }}>
                {title}
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
                <Typography sx={{ color: '#5d4037' }}>{content}</Typography>
            </DialogContent>
            <DialogActions sx={{
                px: 3,
                py: 2,
                backgroundColor: '#f5f5f5',
                borderTop: '1px solid #e0e0e0'
            }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: '#5d4037',
                        '&:hover': {
                            backgroundColor: '#f5f5f5'
                        }
                    }}
                >
                    Отмена
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    sx={{
                        backgroundColor: '#e91e63',
                        '&:hover': {
                            backgroundColor: '#ad1457'
                        }
                    }}
                >
                    Подтвердить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;