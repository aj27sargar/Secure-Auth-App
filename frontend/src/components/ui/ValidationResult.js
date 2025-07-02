import React from 'react';
import { Alert, Box, Typography } from '@mui/material';

const ValidationResult = ({ result }) => (
  <Alert severity={result.type} sx={{ mt: 2 }}>
    {result.message}
    {result.type === 'success' && (
      <Box sx={{ mt: 2, fontSize: '0.9rem', color: 'text.secondary' }}>
        <Typography variant="caption"><strong>Validation Details:</strong></Typography>
        <Typography variant="caption">• Product Key: {result.data.productKey}</Typography>
        <Typography variant="caption">• Hash Key: {result.data.hashKey}</Typography>
        <Typography variant="caption">• Hash Code: {result.data.hashCode}</Typography>
        <Typography variant="caption">• Date: {result.data.date}</Typography>
      </Box>
    )}
  </Alert>
);

export default ValidationResult;
