import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const MainLayout = ({ children }) => {
  return (
    <Container maxWidth={false} sx={{ px: 5, py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h4" component="h1" gutterBelow>
          🔐 Amukh Server
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Secure Client Authentication Management
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
        {children}
      </Box>
    </Container>
  );
};

export default MainLayout;
