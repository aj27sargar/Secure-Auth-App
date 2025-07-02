import React from 'react';
import {
  TextField,
  Button,
  Typography,
  Stack,
  Box
} from '@mui/material';

export const GenerateFormFields = ({ formData, handleChange, handleSubmit, loading }) => (
  <form onSubmit={handleSubmit}>
    <Stack spacing={2}>
      <TextField
        label="Client Name"
        name="ClientName"
        value={formData.ClientName}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Start Date"
        name="StartDate"
        type="date"
        value={formData.StartDate}
        onChange={handleChange}
        required
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="End Date"
        name="EndDate"
        type="date"
        value={formData.EndDate}
        onChange={handleChange}
        required
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="CIN (Optional)"
        name="CIN"
        value={formData.CIN}
        onChange={handleChange}
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        fullWidth
        sx={{ py: 1.5 }}
      >
        {loading ? 'Generating...' : 'Generate Key'}
      </Button>
    </Stack>
  </form>
);

export const UnlockFormFields = ({ unlockProductKey, setUnlockProductKey, handleUnlock, unlockLoading }) => (
  <form onSubmit={handleUnlock}>
    <Stack spacing={2}>
      <TextField
        label="Product Key to Unlock"
        value={unlockProductKey}
        onChange={(e) => setUnlockProductKey(e.target.value)}
        required
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        disabled={unlockLoading}
        fullWidth
      >
        {unlockLoading ? 'Unlocking...' : 'Unlock Account'}
      </Button>
    </Stack>
  </form>
);

export const KeyDisplay = ({ label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    <Typography variant="body2" sx={{ flexGrow: 1, cursor: 'pointer' }}>
      <strong>{label}:</strong> {value}
    </Typography>
    <Button
      variant="text"
      onClick={() => navigator.clipboard.writeText(value)}
      sx={{ ml: 1 }}
    >
      Copy
    </Button>
  </Box>
);
