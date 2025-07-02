import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Tooltip,
  IconButton,
  Alert,
  Divider
} from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import InfoIcon from '@mui/icons-material/Info';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from 'axios';

import { GenerateFormFields } from './ui/FormFields';

const GenerateForm = ({ onKeyGenerated }) => {
  const [formData, setFormData] = useState({ ClientName: '', StartDate: '', EndDate: '', CIN: '' });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedAt] = useState(new Date().toLocaleString());
  const [unlockProductKey, setUnlockProductKey] = useState('');
  const [unlockResponse, setUnlockResponse] = useState(null);
  const [unlockLoading, setUnlockLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    try {
      const res = await axios.post('http://localhost:5000/api/clients/generate', formData);
      setResponse({ type: 'success', data: res.data });
      onKeyGenerated?.(res.data.ProductKey);
    } catch (err) {
      setResponse({ type: 'error', message: err.response?.data?.error || 'Something went wrong' });
    }
    setLoading(false);
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    setUnlockLoading(true);
    setUnlockResponse(null);
    try {
      const res = await axios.post('http://localhost:5000/api/clients/unlock', { productKey: unlockProductKey });
      setUnlockResponse({ type: 'success', message: res.data.message });
    } catch (err) {
      setUnlockResponse({ type: 'error', message: err.response?.data?.error || 'Something went wrong' });
    }
    setUnlockLoading(false);
  };

  const KeyDisplay = ({ label, value, tooltip }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Tooltip title={tooltip || "Click to copy"}>
        <Typography variant="body2" sx={{ flexGrow: 1, cursor: 'pointer' }}>
          <strong>{label}:</strong> {value}
        </Typography>
      </Tooltip>
      <IconButton size="small" onClick={() => navigator.clipboard.writeText(value)}>
        <ContentCopyIcon fontSize="small" />
      </IconButton>
    </Box>
  );

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 5}}>
        <Stack spacing={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <VpnKeyIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              Amukh Server
            </Typography>
          </Box>
          
          <GenerateFormFields
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            loading={loading}
          />

          {response?.type === 'success' && (
            <Alert severity="success" sx={{ mt: 2 }} icon={<InfoIcon />}>
              <Box>
                <Typography variant="h6" gutterBottom>Generated Keys</Typography>
                <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
                  Generated on: {generatedAt}
                </Typography>
                <KeyDisplay label="Product Key" value={response.data.ProductKey} tooltip="Click to copy Product Key" />
                <KeyDisplay label="Hash Key" value={response.data.HashKey} tooltip="Click to copy Hash Key" />
                <KeyDisplay label="Hash Code" value={response.data.HashCode} tooltip="Click to copy Hash Code" />
                
                <Box sx={{ mt: 2, fontSize: '0.8rem', color: 'text.secondary' }}>
                  <Typography variant="caption" display="block"><strong>Hash Generation Formula:</strong></Typography>
                  <Typography variant="caption" display="block">• Hash Key = SHA256(date + '|' + productKey)</Typography>
                  <Typography variant="caption" display="block">• Hash Code = SHA256(productKey + '|' + hashKey)</Typography>
                </Box>
              </Box>
            </Alert>
          )}

          {response?.type === 'error' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {response.message}
            </Alert>
          )}

          <Divider sx={{ my: 3 }}>
            <Typography variant="overline">Manual Reactivation</Typography>
          </Divider>

          <Typography variant="h6" align="center" gutterBottom>
            Unlock Client Account
          </Typography>
          <form onSubmit={handleUnlock}>
            <Stack spacing={2}>
              <TextField label="Product Key to Unlock" value={unlockProductKey} onChange={(e) => setUnlockProductKey(e.target.value)} required fullWidth />
              <Button type="submit" variant="contained" color="secondary" disabled={unlockLoading} fullWidth>
                {unlockLoading ? 'Unlocking...' : 'Unlock Account'}
              </Button>
            </Stack>
          </form>
          {unlockResponse && (
            <Alert severity={unlockResponse.type} sx={{ mt: 2 }}>
              {unlockResponse.message}
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GenerateForm;
