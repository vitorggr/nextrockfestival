import React from "react"
import { Box, Typography } from '@mui/material';

export default function Footer() {
    return (
        <Box className="container" sx={{ mt: 20, textAlign: 'center' }}>
            <Typography variant="h6" component="h5" sx={{ mb: 2 }}>
                © { new Date().getFullYear()} Next Rock Festival. Todos os direitos reservados.
            </Typography>
        </Box>
    )
}
