import React, { useState, useEffect } from 'react';
import SHA256 from 'crypto-js/sha256';
import { Card, CardContent, Box, TextField, Button, Typography, Stack } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { validateKey } from './api/authApi';
import ValidationResult from './ui/ValidationResult';

const ValidateForm = ({ productKey: propProductKey }) => {
  const [productKey, setProductKey] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propProductKey) {
      setProductKey(propProductKey);
    }
  }, [propProductKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const hashKey = SHA256(date + '|' + productKey).toString();
      const hashCode = SHA256(productKey + '|' + hashKey).toString();

      await validateKey({
        productKey,
        hashKey,
        hashCode,
        date
      });

      setResult({
        type: 'success',
        message: '✅ Client is valid',
        data: {
          productKey,
          hashKey,
          hashCode,
          date
        }
      });
    } catch (error) {
      setResult({
        type: 'error',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <VerifiedUserIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Validate Client</Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Product Key"
                value={productKey}
                onChange={(e) => setProductKey(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
                sx={{ py: 1.5 }}
              >
                {loading ? 'Validating...' : 'Validate'}
              </Button>
            </Stack>
          </form>

          {result && <ValidationResult result={result} />}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ValidateForm;